-- Vérifier la structure actuelle de la table votes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'votes' 
ORDER BY ordinal_position;

-- Supprimer la table votes si elle existe (attention aux données!)
DROP TABLE IF EXISTS votes CASCADE;

-- Recréer la table votes avec la bonne structure
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

-- Activer RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Recréer les politiques RLS
DROP POLICY IF EXISTS "Votes visibles par les admins seulement" ON votes;
DROP POLICY IF EXISTS "Utilisateurs connectés peuvent voter" ON votes;
DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer leurs propres votes" ON votes;

CREATE POLICY "Votes visibles par les admins seulement" ON votes
    FOR SELECT USING (auth.uid() IN (
        SELECT id FROM profiles WHERE is_admin = true
    ));

CREATE POLICY "Utilisateurs connectés peuvent voter" ON votes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Utilisateurs peuvent supprimer leurs propres votes" ON votes
    FOR DELETE USING (auth.uid() = user_id);

-- Recréer les triggers pour le comptage automatique des votes
DROP TRIGGER IF EXISTS update_votes_count_on_insert ON votes;
DROP TRIGGER IF EXISTS update_votes_count_on_delete ON votes;

CREATE TRIGGER update_votes_count_on_insert
    AFTER INSERT ON votes
    FOR EACH ROW EXECUTE PROCEDURE update_candidate_votes_count();

CREATE TRIGGER update_votes_count_on_delete
    AFTER DELETE ON votes
    FOR EACH ROW EXECUTE PROCEDURE update_candidate_votes_count();

SELECT 'Table votes recréée avec succès!' as message;