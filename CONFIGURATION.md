# Configuration du Projet Vote DINOR

## 1. Base de données Supabase

### Créer les tables
1. Connectez-vous à votre dashboard Supabase
2. Allez dans l'onglet "SQL Editor"
3. Copiez et exécutez le contenu du fichier `supabase-schema.sql`

### Désactiver la confirmation d'email (optionnel)
1. Dans Supabase Dashboard → Authentication → Settings
2. Décochez "Enable email confirmations"
3. Cliquez "Save"

## 2. Variables d'environnement

Créez un fichier `.env` avec les variables suivantes:

```env
# Supabase
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_cle_anon_supabase

# reCAPTCHA v2
RECAPTCHA_SITE_KEY=votre_site_key_recaptcha
RECAPTCHA_SECRET_KEY=votre_secret_key_recaptcha

# Cloudinary (optionnel pour upload d'images)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

## 3. Configuration Google reCAPTCHA

1. Allez sur [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Créez un nouveau site avec reCAPTCHA v2
3. Domaines autorisés : `localhost`, votre domaine de production
4. Copiez la Site Key et Secret Key dans votre `.env`

## 4. Configuration OAuth (optionnel)

### Google OAuth
1. Dans Supabase Dashboard → Authentication → Providers
2. Activez le provider "Google"
3. Configurez avec vos credentials Google OAuth

### Facebook OAuth
1. Dans Supabase Dashboard → Authentication → Providers
2. Activez le provider "Facebook"
3. Configurez avec vos credentials Facebook OAuth:
   - **Client ID**: Votre Facebook App ID
   - **Client Secret**: Votre Facebook App Secret
   - **Redirect URL**: `https://votre-projet.supabase.co/auth/v1/callback`

#### Créer une Facebook App
1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle app ou utilisez une existante
3. Ajoutez le produit "Facebook Login"
4. Configurez les URLs de redirection OAuth:
   - `https://votre-projet.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (pour le développement)
5. Copiez l'App ID et App Secret dans Supabase

## 5. Déploiement Vercel

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement dans Vercel
3. Build Command: `npm run build`
4. Output Directory: `.output`

## 6. Test de l'application

1. `npm install`
2. `npm run dev`
3. Testez l'inscription avec reCAPTCHA
4. Testez le vote (nécessite d'être connecté)
5. Testez l'accès admin (nécessite is_admin = true dans la DB)

## 7. Configuration des admins

Pour donner les droits admin à un utilisateur:
```sql
UPDATE profiles 
SET is_admin = true 
WHERE id = 'uuid-de-votre-utilisateur';
```