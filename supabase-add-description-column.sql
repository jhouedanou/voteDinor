-- Vérifier la structure actuelle de la table candidates
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'candidates' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ajouter la colonne description si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'candidates' 
        AND column_name = 'description'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE candidates ADD COLUMN description TEXT;
        RAISE NOTICE 'Colonne description ajoutée à la table candidates';
    ELSE
        RAISE NOTICE 'Colonne description existe déjà';
    END IF;
END $$;

-- Vérifier le résultat
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'candidates' 
AND table_schema = 'public'
ORDER BY ordinal_position;