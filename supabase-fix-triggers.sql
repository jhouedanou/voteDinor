-- Corriger les triggers qui posent problème

-- 1. Supprimer les anciens triggers
DROP TRIGGER IF EXISTS update_votes_count_on_insert ON votes;
DROP TRIGGER IF EXISTS update_votes_count_on_delete ON votes;

-- 2. Créer une fonction spécifique pour les votes (sans updated_at)
CREATE OR REPLACE FUNCTION update_candidate_votes_count_from_votes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Incrémenter le compteur
        UPDATE candidates 
        SET votes_count = votes_count + 1 
        WHERE id = NEW.candidate_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Décrémenter le compteur
        UPDATE candidates 
        SET votes_count = votes_count - 1 
        WHERE id = OLD.candidate_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Créer les nouveaux triggers avec la bonne fonction
CREATE TRIGGER update_votes_count_on_insert
    AFTER INSERT ON votes
    FOR EACH ROW EXECUTE PROCEDURE update_candidate_votes_count_from_votes();

CREATE TRIGGER update_votes_count_on_delete
    AFTER DELETE ON votes
    FOR EACH ROW EXECUTE PROCEDURE update_candidate_votes_count_from_votes();

-- 4. Vérifier que la fonction générale existe toujours pour les autres tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Vérifier si la colonne updated_at existe
    IF TG_TABLE_NAME = 'candidates' THEN
        NEW.updated_at = timezone('utc'::text, now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Recréer le trigger pour candidates seulement
DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 6. Vérifier les colonnes de la table votes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'votes' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Triggers corrigés avec succès!' as message;