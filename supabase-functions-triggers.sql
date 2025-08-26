-- ÉTAPE 4: Fonctions et triggers

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Supprimer les triggers s'ils existent déjà
DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
DROP TRIGGER IF EXISTS update_votes_count_on_insert ON votes;
DROP TRIGGER IF EXISTS update_votes_count_on_delete ON votes;

-- Créer les triggers
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_votes_count_on_insert
    AFTER INSERT ON votes
    FOR EACH ROW EXECUTE PROCEDURE update_candidate_votes_count();

CREATE TRIGGER update_votes_count_on_delete
    AFTER DELETE ON votes
    FOR EACH ROW EXECUTE PROCEDURE update_candidate_votes_count();