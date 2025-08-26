-- ÉTAPE 5: RLS et politiques de sécurité (VERSION SIMPLE)

-- Activer RLS seulement sur les tables existantes
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

-- Supprimer toutes les politiques existantes
DO $$
DECLARE
    pol_name text;
BEGIN
    -- Supprimer politiques sur profiles
    FOR pol_name IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON profiles';
    END LOOP;
    
    -- Supprimer politiques sur candidates
    FOR pol_name IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'candidates' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON candidates';
    END LOOP;
    
    -- Supprimer politiques sur votes
    FOR pol_name IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'votes' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON votes';
    END LOOP;
END $$;

-- Politiques pour les profils (si la table existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Politiques pour profiles
        EXECUTE 'CREATE POLICY "Profils visibles par tous" ON profiles FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "Utilisateurs peuvent mettre à jour leur profil" ON profiles FOR UPDATE USING (auth.uid() = id)';
    END IF;
END $$;

-- Politiques pour les candidats (si la table existe)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'candidates') THEN
        -- Politiques pour candidates
        EXECUTE 'CREATE POLICY "Candidats approuvés visibles par tous" ON candidates FOR SELECT USING (status = ''approved'' OR auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true))';
        EXECUTE 'CREATE POLICY "Seuls les admins peuvent gérer les candidats" ON candidates FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true))';
    END IF;
END $$;

-- Politiques pour les votes (seulement si la table existe ET a la bonne structure)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'votes') AND
       EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'votes' AND column_name = 'user_id') THEN
        -- Politiques pour votes
        EXECUTE 'CREATE POLICY "Votes visibles par les admins seulement" ON votes FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true))';
        EXECUTE 'CREATE POLICY "Utilisateurs connectés peuvent voter" ON votes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
        EXECUTE 'CREATE POLICY "Utilisateurs peuvent supprimer leurs propres votes" ON votes FOR DELETE USING (auth.uid() = user_id)';
    END IF;
END $$;

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

SELECT 'Politiques RLS configurées avec succès!' as message;