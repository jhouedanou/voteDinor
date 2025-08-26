-- ÉTAPE 5: RLS et politiques de sécurité

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

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