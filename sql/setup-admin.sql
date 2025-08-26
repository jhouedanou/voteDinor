-- Script pour configurer un admin manuellement
-- Remplacez 'votre-email@example.com' par l'email de l'utilisateur que vous voulez promouvoir admin

-- Option 1: Promouvoir par email
UPDATE profiles 
SET is_admin = true 
WHERE email = 'votre-email@example.com';

-- Option 2: Promouvoir par ID utilisateur (plus sûr)
-- Remplacez 'uuid-de-votre-utilisateur' par l'ID réel de l'utilisateur
UPDATE profiles 
SET is_admin = true 
WHERE id = 'uuid-de-votre-utilisateur';

-- Option 3: Voir tous les utilisateurs et leurs statuts admin
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- Option 4: Voir seulement les admins
SELECT 
  id,
  email,
  first_name,
  last_name,
  created_at
FROM profiles 
WHERE is_admin = true
ORDER BY created_at DESC;

-- Option 5: Retirer le statut admin
UPDATE profiles 
SET is_admin = false 
WHERE email = 'votre-email@example.com';
