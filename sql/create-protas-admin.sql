-- Créer l'admin Protas
-- Exécutez ce script dans Supabase Dashboard → SQL Editor

-- 1. Vérifier si l'utilisateur existe déjà
DO $$
BEGIN
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
WHERE u.email = 'protas@dinor.ci';

-- 3. Si le profil existe déjà, le mettre à jour
UPDATE profiles 
SET 
  is_admin = true,
  email_verified = true,
  updated_at = NOW()
WHERE email = 'protas@dinor.ci';

-- 4. Vérifier le résultat
SELECT 
  'Protas Admin créé/mis à jour avec succès!' as status,
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.email_verified
FROM profiles p
WHERE p.email = 'protas@dinor.ci';
