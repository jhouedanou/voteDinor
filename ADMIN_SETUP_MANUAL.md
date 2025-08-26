# Configuration Admin Manuel - Supabase

## Méthode 1 : Interface Supabase (Recommandée)

### 1. Créer l'utilisateur dans Supabase Auth
1. **Allez dans Supabase Dashboard** → Authentication → Users
2. **Cliquez sur** "Add user"
3. **Remplissez** :
   - Email : `protas@dinor.ci`
   - Password : `admin123`
   - Confirm password : `admin123`
4. **Cliquez sur** "Create user"

### 2. Vérifier le profil dans la base de données
1. **Allez dans** Supabase Dashboard → Table Editor
2. **Sélectionnez** la table `profiles`
3. **Trouvez** l'utilisateur `protas@dinor.ci`
4. **Cliquez sur** l'enregistrement pour l'éditer
5. **Changez** `is_admin` de `false` à `true`
6. **Sauvegardez**

### 3. Connexion
- **Email** : `protas@dinor.ci`
- **Mot de passe** : `admin123`

## Méthode 2 : Script SQL

### Exécuter le script
1. **Allez dans** Supabase Dashboard → SQL Editor
2. **Copiez et exécutez** le script `sql/check-and-fix-admin.sql`
3. **Vérifiez** les résultats dans la section "Results"

### Identifiants après script
- **Email** : `protas@dinor.ci`
- **Mot de passe** : `admin123`

## Méthode 3 : Interface web

### Utiliser l'interface de setup
1. **Allez sur** : `https://vote-dinor.vercel.app/admin-setup`
2. **Connectez-vous** avec Google/Facebook
3. **Cliquez sur** "👑 Devenir Admin"

## Vérification

### Tester la connexion
1. **Allez sur** : `https://vote-dinor.vercel.app/`
2. **Cliquez sur** "Se connecter"
3. **Entrez** les identifiants
4. **Vérifiez** que vous pouvez accéder au dashboard admin

### Accès au dashboard
- **URL directe** : `https://vote-dinor.vercel.app/admin/dashboard`
- **Via menu** : Menu utilisateur → "Dashboard Admin"

## Dépannage

### Si "Invalid login credentials"
1. Vérifiez que l'utilisateur existe dans Supabase Auth
2. Vérifiez que le profil a `is_admin = true`
3. Essayez de réinitialiser le mot de passe

### Si erreur 403 "Accès administrateur requis"
1. Vérifiez que `is_admin = true` dans la table `profiles`
2. Vérifiez que l'utilisateur est bien connecté
3. Essayez de vous déconnecter et reconnecter
