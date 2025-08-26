-- Script simple pour promouvoir un utilisateur en admin
-- Option 1: Promouvoir par email
UPDATE profiles 
SET is_admin = true, updated_at = NOW()
WHERE email = 'protas@dinor.ci';

-- Option 2: Voir le résultat
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at,
  updated_at
FROM profiles 
WHERE email = 'protas@dinor.ci';

-- Option 3: Voir tous les admins
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at
FROM profiles 
WHERE is_admin = true
ORDER BY created_at DESC;
