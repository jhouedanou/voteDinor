# Configuration Protas - Guide Simple

## Méthode 1 : Interface Supabase (Recommandée)

### 1. Créer l'utilisateur Protas
1. **Allez dans** Supabase Dashboard → Authentication → Users
2. **Cliquez sur** "Add user"
3. **Remplissez** :
   - Email : `protas@dinor.ci`
   - Password : `admin123`
   - Confirm password : `admin123`
4. **Cliquez sur** "Create user"

### 2. Configurer le profil admin
1. **Allez dans** Supabase Dashboard → Table Editor
2. **Sélectionnez** la table `profiles`
3. **Trouvez** l'utilisateur `protas@dinor.ci`
4. **Cliquez sur** l'enregistrement pour l'éditer
5. **Changez** `is_admin` de `false` à `true`
6. **Sauvegardez**

### 3. Connexion à la page Protas
- **URL** : `https://vote-dinor.vercel.app/protas`
- **Email** : `protas@dinor.ci`
- **Mot de passe** : `admin123`

## Méthode 2 : Script SQL (Alternative)

Si l'interface ne fonctionne pas, exécutez le script `sql/create-protas-admin.sql` dans Supabase Dashboard → SQL Editor.

## Vérification

### Tester la connexion
1. **Allez sur** : `https://vote-dinor.vercel.app/protas`
2. **Entrez** les identifiants
3. **Vérifiez** que vous accédez au dashboard Protas

### Fonctionnalités disponibles
- ✅ **Statistiques** : Voir les candidats et votes
- ✅ **Candidats en attente** : Approuver/rejeter
- ✅ **Actions rapides** : Dashboard complet, actualiser, déconnexion
- ✅ **Sécurité** : Accès réservé à Protas uniquement

## Dépannage

### Si "Invalid login credentials"
- Vérifiez que l'utilisateur existe dans Supabase Auth
- Vérifiez que le profil a `is_admin = true`
- Essayez de réinitialiser le mot de passe

### Si erreur d'accès
- Vérifiez que vous utilisez bien `protas@dinor.ci`
- Vérifiez que `is_admin = true` dans la table `profiles`
- Essayez de vous déconnecter et reconnecter
