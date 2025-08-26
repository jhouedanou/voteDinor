-- Vérifier les tables existantes et leurs colonnes

-- 1. Vérifier les tables existantes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Vérifier la structure de la table votes si elle existe
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'votes'
ORDER BY ordinal_position;

-- 3. Vérifier la structure de la table candidates si elle existe
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'candidates'
ORDER BY ordinal_position;

-- 4. Vérifier la structure de la table profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;