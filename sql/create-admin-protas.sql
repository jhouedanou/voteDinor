-- Créer un admin nommé "protas" directement dans Supabase
-- Exécutez ce script dans Supabase Dashboard → SQL Editor

-- 1. Créer l'utilisateur dans auth.users
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

-- 2. Récupérer l'ID de l'utilisateur créé
WITH new_user AS (
  SELECT id FROM auth.users WHERE email = 'protas@dinor.ci'
)
-- 3. Créer le profil admin
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
  id,
  'protas@dinor.ci',
  'Protas',
  'Admin',
  'Protas Admin',
  true,
  true,
  NOW(),
  NOW()
FROM new_user;

-- 4. Vérifier que l'admin a été créé
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.created_at
FROM profiles p
WHERE p.email = 'protas@dinor.ci';
