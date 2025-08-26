-- ÉTAPE 1: Vérifier et ajouter la colonne is_admin à profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Colonne is_admin ajoutée à profiles';
    ELSE
        RAISE NOTICE 'Colonne is_admin existe déjà dans profiles';
    END IF;
END $$;