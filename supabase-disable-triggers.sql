-- Solution simple : désactiver les triggers automatiques

-- Supprimer tous les triggers sur votes
DROP TRIGGER IF EXISTS update_votes_count_on_insert ON votes;
DROP TRIGGER IF EXISTS update_votes_count_on_delete ON votes;
DROP TRIGGER IF EXISTS update_votes_updated_at ON votes;

-- Supprimer les fonctions problématiques
DROP FUNCTION IF EXISTS update_candidate_votes_count();
DROP FUNCTION IF EXISTS update_candidate_votes_count_from_votes();

-- Laisser seulement le trigger pour candidates
CREATE OR REPLACE FUNCTION update_candidates_updated_at_only()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates 
    FOR EACH ROW EXECUTE PROCEDURE update_candidates_updated_at_only();

-- Créer une fonction pour mettre à jour manuellement les compteurs
CREATE OR REPLACE FUNCTION refresh_votes_count()
RETURNS void AS $$
BEGIN
    UPDATE candidates 
    SET votes_count = (
        SELECT COUNT(*) 
        FROM votes 
        WHERE votes.candidate_id = candidates.id
    );
END;
$$ LANGUAGE plpgsql;

SELECT 'Triggers simplifiés - comptage manuel des votes' as message;