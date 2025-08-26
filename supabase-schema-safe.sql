-- SUPABASE SCHEMA POUR VOTE DINOR (VERSION SÉCURISÉE)
-- Exécuter ce script dans l'éditeur SQL de votre dashboard Supabase

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des candidats (si elle n'existe pas)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'candidates') THEN
        CREATE TABLE candidates (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            email TEXT,
            photo_url TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            votes_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$;

-- Table des votes (si elle n'existe pas)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'votes') THEN
        CREATE TABLE votes (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            ip_address INET NOT NULL,
            user_agent TEXT,
            vote_date DATE DEFAULT CURRENT_DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            
            -- Contrainte unique : 1 vote par utilisateur par candidat par jour
            UNIQUE(candidate_id, user_id, vote_date),
            -- Contrainte unique : 1 vote par IP par candidat par jour
            UNIQUE(candidate_id, ip_address, vote_date)
        );
    END IF;
END $$;

-- Ajouter la colonne is_admin à profiles si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Index pour optimiser les performances (avec vérification)
DO $$
BEGIN
    -- Index votes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_votes_candidate_id') THEN
        CREATE INDEX idx_votes_candidate_id ON votes(candidate_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_votes_user_id') THEN
        CREATE INDEX idx_votes_user_id ON votes(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_votes_ip_date') THEN
        CREATE INDEX idx_votes_ip_date ON votes(ip_address, vote_date);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_votes_created_at') THEN
        CREATE INDEX idx_votes_created_at ON votes(created_at);
    END IF;
    
    -- Index candidates
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_candidates_status') THEN
        CREATE INDEX idx_candidates_status ON candidates(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_candidates_votes_count') THEN
        CREATE INDEX idx_candidates_votes_count ON candidates(votes_count DESC);
    END IF;
END $$;

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at (avec vérification)
DO $$
BEGIN
    -- Trigger pour profiles
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at 
            BEFORE UPDATE ON profiles 
            FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
    
    -- Trigger pour candidates
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_candidates_updated_at') THEN
        CREATE TRIGGER update_candidates_updated_at 
            BEFORE UPDATE ON candidates 
            FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;

-- Fonction pour mettre à jour le compteur de votes
CREATE OR REPLACE FUNCTION update_candidate_votes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE candidates 
        SET votes_count = votes_count + 1 
        WHERE id = NEW.candidate_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE candidates 
        SET votes_count = votes_count - 1 
        WHERE id = OLD.candidate_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour maintenir le compteur de votes (avec vérification)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_votes_count_on_insert') THEN
        CREATE TRIGGER update_votes_count_on_insert
            AFTER INSERT ON votes
            FOR EACH ROW EXECUTE PROCEDURE update_candidate_votes_count();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_votes_count_on_delete') THEN
        CREATE TRIGGER update_votes_count_on_delete
            AFTER DELETE ON votes
            FOR EACH ROW EXECUTE PROCEDURE update_candidate_votes_count();
    END IF;
END $$;

-- Activer RLS sur toutes les tables (safe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'candidates') THEN
        ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'votes') THEN
        ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Profils visibles par tous" ON profiles;
DROP POLICY IF EXISTS "Utilisateurs peuvent mettre à jour leur profil" ON profiles;
DROP POLICY IF EXISTS "Candidats approuvés visibles par tous" ON candidates;
DROP POLICY IF EXISTS "Seuls les admins peuvent gérer les candidats" ON candidates;
DROP POLICY IF EXISTS "Votes visibles par les admins seulement" ON votes;
DROP POLICY IF EXISTS "Utilisateurs connectés peuvent voter" ON votes;
DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer leurs propres votes" ON votes;

-- Politiques pour les profils
CREATE POLICY "Profils visibles par tous" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Utilisateurs peuvent mettre à jour leur profil" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les candidats
CREATE POLICY "Candidats approuvés visibles par tous" ON candidates
    FOR SELECT USING (status = 'approved' OR auth.uid() IN (
        SELECT id FROM profiles WHERE is_admin = true
    ));

CREATE POLICY "Seuls les admins peuvent gérer les candidats" ON candidates
    FOR ALL USING (auth.uid() IN (
        SELECT id FROM profiles WHERE is_admin = true
    ));

-- Politiques pour les votes
CREATE POLICY "Votes visibles par les admins seulement" ON votes
    FOR SELECT USING (auth.uid() IN (
        SELECT id FROM profiles WHERE is_admin = true
    ));

CREATE POLICY "Utilisateurs connectés peuvent voter" ON votes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Utilisateurs peuvent supprimer leurs propres votes" ON votes
    FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Candidats de test (seulement si la table est vide)
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM candidates) = 0 THEN
        INSERT INTO candidates (nom, prenom, photo_url, description, status) VALUES
        ('Martin', 'Pierre', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', 'Passionné de cuisine traditionnelle française', 'approved'),
        ('Dubois', 'Marie', 'https://images.unsplash.com/photo-1494790108755-2616b612b494?w=300&h=300&fit=crop&crop=face', 'Chef spécialisée dans la pâtisserie', 'approved'),
        ('Lefebvre', 'Jean', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', 'Expert en cuisine méditerranéenne', 'approved'),
        ('Moreau', 'Sophie', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face', 'Créatrice de recettes innovantes', 'approved'),
        ('Petit', 'Lucas', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face', 'Spécialiste des produits du terroir', 'approved');
    END IF;
END $$;

-- Afficher les informations de configuration
SELECT 'Schema mis à jour avec succès!' as message;
SELECT 'Tables: profiles (existante + is_admin), candidates, votes' as tables;
SELECT 'RLS activé sur toutes les tables' as security;
SELECT 'Triggers créés pour la gestion automatique' as automation;