-- SUPABASE SCHEMA POUR VOTE DINOR
-- Exécuter ce script dans l'éditeur SQL de votre dashboard Supabase

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs (liée à auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des candidats
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

-- Table des votes
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

-- Index pour optimiser les performances
CREATE INDEX idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_ip_date ON votes(ip_address, vote_date);
CREATE INDEX idx_votes_created_at ON votes(created_at);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_votes_count ON candidates(votes_count DESC);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement le profil
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

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

-- Triggers pour maintenir le compteur de votes
CREATE TRIGGER update_votes_count_on_insert
    AFTER INSERT ON votes
    FOR EACH ROW EXECUTE PROCEDURE update_candidate_votes_count();

CREATE TRIGGER update_votes_count_on_delete
    AFTER DELETE ON votes
    FOR EACH ROW EXECUTE PROCEDURE update_candidate_votes_count();

-- POLITIQUES RLS (Row Level Security)

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

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

-- DONNÉES DE TEST (optionnel)
-- Créer un utilisateur admin de test (remplacez par votre vrai UUID utilisateur)
-- INSERT INTO profiles (id, full_name, is_admin) 
-- VALUES ('votre-uuid-utilisateur-ici', 'Admin Test', true);

-- Candidats de test
INSERT INTO candidates (nom, prenom, photo_url, description, status) VALUES
('Martin', 'Pierre', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', 'Passionné de cuisine traditionnelle française', 'approved'),
('Dubois', 'Marie', 'https://images.unsplash.com/photo-1494790108755-2616b612b494?w=300&h=300&fit=crop&crop=face', 'Chef spécialisée dans la pâtisserie', 'approved'),
('Lefebvre', 'Jean', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', 'Expert en cuisine méditerranéenne', 'approved'),
('Moreau', 'Sophie', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face', 'Créatrice de recettes innovantes', 'approved'),
('Petit', 'Lucas', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face', 'Spécialiste des produits du terroir', 'approved');

-- Afficher les informations de configuration
SELECT 'Schema créé avec succès!' as message;
SELECT 'Tables créées: profiles, candidates, votes' as tables;
SELECT 'RLS activé sur toutes les tables' as security;
SELECT 'Triggers créés pour la gestion automatique' as automation;