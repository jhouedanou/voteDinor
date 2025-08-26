-- Créer un admin nommé "protas" directement dans Supabase
-- Exécutez ce script dans Supabase Dashboard → SQL Editor

-- 1. Vérifier si l'utilisateur existe déjà
DO $$
BEGIN
  -- Si l'utilisateur n'existe pas, le créer
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'protas@dinor.ci') THEN
    -- Créer l'utilisateur dans auth.users
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
      crypt('D1n0r@dm1n2025!', gen_salt('bf')),
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

-- 2. Créer ou mettre à jour le profil admin
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

-- 3. Vérifier que l'admin a été créé/mis à jour
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.created_at
FROM profiles p
WHERE p.email = 'protas@dinor.ci';
