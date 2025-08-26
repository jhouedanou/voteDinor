-- Configuration simple pour Protas
-- Exécutez ce script dans Supabase Dashboard → SQL Editor

-- 1. Voir l'état actuel
SELECT 'État actuel:' as info;
SELECT 
  u.email as user_email,
  u.email_confirmed_at,
  p.is_admin,
  p.email_verified
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'protas@dinor.ci';

-- 2. Mettre à jour le profil admin (si l'utilisateur existe)
UPDATE profiles 
SET 
  is_admin = true,
  email_verified = true,
  updated_at = NOW()
WHERE email = 'protas@dinor.ci';

-- 3. Vérifier le résultat
SELECT 
  'Résultat après mise à jour:' as info,
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.email_verified
FROM profiles p
WHERE p.email = 'protas@dinor.ci';
