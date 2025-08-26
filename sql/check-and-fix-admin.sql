-- Script pour vérifier et corriger l'admin protas
-- Exécutez ce script dans Supabase Dashboard → SQL Editor

-- 1. Vérifier si l'utilisateur existe dans auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'protas@dinor.ci';

-- 2. Vérifier si le profil existe
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  email_verified,
  created_at
FROM profiles 
WHERE email = 'protas@dinor.ci';

-- 3. Si l'utilisateur n'existe pas, le créer
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'protas@dinor.ci') THEN
    -- Créer l'utilisateur avec un mot de passe simple
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
    RAISE NOTICE 'Utilisateur protas@dinor.ci créé avec le mot de passe: admin123';
  ELSE
    RAISE NOTICE 'Utilisateur protas@dinor.ci existe déjà';
  END IF;
END $$;

-- 4. Créer ou mettre à jour le profil admin
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
)
SELECT 
  u.id,
  'protas@dinor.ci',
  'Protas',
  'Admin',
  'Protas Admin',
  true,
  true,
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'protas@dinor.ci'
ON CONFLICT (id) DO UPDATE SET
  is_admin = true,
  email_verified = true,
  updated_at = NOW();

-- 5. Vérifier le résultat final
SELECT 
  'Utilisateur créé avec succès!' as status,
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.email_verified
FROM profiles p
WHERE p.email = 'protas@dinor.ci';
