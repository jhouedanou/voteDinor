-- SCRIPT COMPLET POUR CORRIGER TOUS LES PROBLÈMES

-- 1. Supprimer tous les triggers problématiques sur votes
DROP TRIGGER IF EXISTS update_votes_count_on_insert ON votes;
DROP TRIGGER IF EXISTS update_votes_count_on_delete ON votes;
DROP TRIGGER IF EXISTS update_votes_updated_at ON votes;

-- 2. Supprimer les fonctions qui causent des problèmes avec updated_at
DROP FUNCTION IF EXISTS update_candidate_votes_count();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 3. Ajouter la colonne description à candidates si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'candidates' 
        AND column_name = 'description'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE candidates ADD COLUMN description TEXT;
        RAISE NOTICE 'Colonne description ajoutée à candidates';
    END IF;
END $$;

-- 4. Ajouter la colonne email à candidates si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'candidates' 
        AND column_name = 'email'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE candidates ADD COLUMN email TEXT;
        RAISE NOTICE 'Colonne email ajoutée à candidates';
    END IF;
END $$;

-- 5. Créer une fonction simple pour mettre à jour updated_at uniquement sur candidates
CREATE OR REPLACE FUNCTION update_candidates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer le trigger pour candidates uniquement
DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates 
    FOR EACH ROW EXECUTE PROCEDURE update_candidates_updated_at();

-- 7. Vérifier la structure finale
SELECT 'Structure de la table candidates:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'candidates' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Structure de la table votes:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'votes' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Correction terminée - Les votes et inscriptions devraient maintenant fonctionner!' as message;