-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Votes visibles par les admins seulement" ON votes;
DROP POLICY IF EXISTS "Utilisateurs connectés peuvent voter" ON votes;
DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer leurs propres votes" ON votes;

-- Créer des politiques plus permissives
-- Permet à tous de lire les votes (pour les stats)
CREATE POLICY "Tous peuvent lire les votes" ON votes
    FOR SELECT USING (true);

-- Permet l'insertion de votes (sera contrôlée par l'API)
CREATE POLICY "API peut insérer des votes" ON votes
    FOR INSERT WITH CHECK (true);

-- Seuls les admins peuvent supprimer
CREATE POLICY "Seuls admins peuvent supprimer votes" ON votes
    FOR DELETE USING (
        auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
    );

-- Mise à jour uniquement pour les admins
CREATE POLICY "Seuls admins peuvent modifier votes" ON votes
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
    );

SELECT 'Politiques de votes mises à jour!' as message;