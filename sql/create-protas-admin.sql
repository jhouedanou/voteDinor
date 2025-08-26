-- Créer l'admin Protas - Version simplifiée
-- Exécutez ce script dans Supabase Dashboard → SQL Editor

-- 1. Vérifier si l'utilisateur existe déjà
SELECT 'Vérification utilisateur existant:' as info;
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'protas@dinor.ci';

-- 2. Vérifier si le profil existe déjà
SELECT 'Vérification profil existant:' as info;
SELECT id, email, is_admin, email_verified FROM profiles WHERE email = 'protas@dinor.ci';

-- 3. Créer l'utilisateur seulement s'il n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'protas@dinor.ci') THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data
    ) VALUES (
      gen_random_uuid(),
      'protas@dinor.ci',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"first_name": "Protas", "last_name": "Admin", "full_name": "Protas Admin"}'
    );
    RAISE NOTICE 'Utilisateur protas@dinor.ci créé avec succès';
  ELSE
    RAISE NOTICE 'Utilisateur protas@dinor.ci existe déjà';
  END IF;
END $$;

-- 4. Mettre à jour le profil admin (créer ou modifier)
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur
  SELECT id INTO user_id FROM auth.users WHERE email = 'protas@dinor.ci';
  
  IF user_id IS NOT NULL THEN
    -- Vérifier si le profil existe
    IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
      -- Mettre à jour le profil existant
      UPDATE profiles 
      SET 
        is_admin = true,
        email_verified = true,
        updated_at = NOW()
      WHERE id = user_id;
      RAISE NOTICE 'Profil admin mis à jour pour protas@dinor.ci';
    ELSE
      -- Créer un nouveau profil
      INSERT INTO profiles (
        id,
        email,
        first_name,
        last_name,
        full_name,
        is_admin,
        email_verified,
        created_at,
        updated_at
      ) VALUES (
        user_id,
        'protas@dinor.ci',
        'Protas',
        'Admin',
        'Protas Admin',
        true,
        true,
        NOW(),
        NOW()
      );
      RAISE NOTICE 'Profil admin créé pour protas@dinor.ci';
    END IF;
  ELSE
    RAISE NOTICE 'Utilisateur protas@dinor.ci non trouvé';
  END IF;
END $$;

-- 5. Vérifier le résultat final
SELECT 
  'Résultat final:' as info,
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.email_verified
FROM profiles p
WHERE p.email = 'protas@dinor.ci';
