# Configuration Facebook OAuth pour Vote DINOR

## Étape 1: Créer une Facebook App

1. **Allez sur Facebook Developers**
   - Visitez [developers.facebook.com](https://developers.facebook.com/)
   - Connectez-vous avec votre compte Facebook

2. **Créez une nouvelle app**
   - Cliquez sur "Créer une app"
   - Sélectionnez "Consumer" comme type d'app
   - Remplissez les informations de base (nom, email de contact)

3. **Ajoutez Facebook Login**
   - Dans le dashboard de votre app, cliquez sur "Ajouter un produit"
   - Sélectionnez "Facebook Login"
   - Cliquez sur "Configurer"

## Étape 2: Configurer Facebook Login

1. **Paramètres de base**
   - Dans "Facebook Login" → "Paramètres"
   - Ajoutez vos domaines autorisés :
     ```
     http://localhost:3000
     https://votre-domaine.com
     ```

2. **URLs de redirection OAuth**
   - Ajoutez ces URLs dans "URLs de redirection OAuth valides" :
     ```
     https://votre-projet.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - Remplacez `votre-projet` par l'ID de votre projet Supabase

3. **Récupérez vos credentials**
   - Notez votre **App ID** (visible dans "Paramètres" → "De base")
   - Notez votre **App Secret** (visible dans "Paramètres" → "De base")

## Étape 3: Configurer Supabase

1. **Allez dans votre dashboard Supabase**
   - Connectez-vous à [supabase.com](https://supabase.com)
   - Ouvrez votre projet

2. **Activez Facebook OAuth**
   - Allez dans "Authentication" → "Providers"
   - Trouvez "Facebook" et activez-le
   - Remplissez les champs :
     - **Client ID** : Votre Facebook App ID
     - **Client Secret** : Votre Facebook App Secret
   - Cliquez sur "Save"

## Étape 4: Tester la connexion

1. **Lancez votre application**
   ```bash
   npm run dev
   ```

2. **Testez la connexion Facebook**
   - Ouvrez votre app dans le navigateur
   - Cliquez sur "Connexion"
   - Cliquez sur "Continuer avec Facebook"
   - Vous devriez être redirigé vers Facebook pour l'autorisation

## Dépannage

### Erreur "URL de redirection non autorisée"
- Vérifiez que vous avez bien ajouté l'URL de redirection Supabase dans Facebook
- L'URL doit être exactement : `https://votre-projet.supabase.co/auth/v1/callback`

### Erreur "App non configurée"
- Assurez-vous que votre Facebook App est en mode "Développement" ou "Live"
- Vérifiez que vous avez bien ajouté le produit "Facebook Login"

### Erreur "Invalid OAuth redirect URI"
- Vérifiez que l'URL de redirection dans Supabase correspond à celle configurée dans Facebook

## Variables d'environnement

Aucune variable d'environnement supplémentaire n'est nécessaire pour Facebook OAuth. Tout est configuré directement dans Supabase.
