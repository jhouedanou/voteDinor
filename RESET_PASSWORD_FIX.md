# Correction Réinitialisation Mot de Passe

## Problème actuel
L'API `/api/reset-password` retourne une erreur 500 lors de l'envoi d'email.

## Solutions

### Solution 1 : Désactiver temporairement l'email (Recommandée)

Ajoutez cette variable d'environnement dans Vercel :
```
DISABLE_EMAIL=true
```

Cela simulera l'envoi d'email sans utiliser HeroTofu.

### Solution 2 : Utiliser Supabase Auth directement

La page `/reset-password` utilise déjà Supabase Auth, donc vous pouvez :

1. **Aller directement** sur : `https://vote-dinor.vercel.app/reset-password`
2. **Utiliser** la fonction native de Supabase
3. **Ignorer** l'API personnalisée

### Solution 3 : Réinitialiser via Supabase Dashboard

1. **Allez dans** Supabase Dashboard → Authentication → Users
2. **Trouvez** l'utilisateur `protas@dinor.ci`
3. **Cliquez sur** "..." → "Reset password"
4. **Entrez** un nouveau mot de passe
5. **Sauvegardez**

### Solution 4 : Créer un nouvel utilisateur admin

Si la réinitialisation ne fonctionne pas, créez un nouvel admin :

1. **Allez dans** Supabase Dashboard → Authentication → Users
2. **Cliquez sur** "Add user"
3. **Remplissez** :
   - Email : `admin@dinor.ci`
   - Password : `admin123`
4. **Créez** l'utilisateur
5. **Allez dans** Table Editor → `profiles`
6. **Trouvez** `admin@dinor.ci` et changez `is_admin` à `true`

## Identifiants de test

### Admin existant (si réinitialisation réussie)
- **Email** : `protas@dinor.ci`
- **Mot de passe** : `admin123`

### Nouvel admin (si création réussie)
- **Email** : `admin@dinor.ci`
- **Mot de passe** : `admin123`

## Test de connexion

1. **Allez sur** : `https://vote-dinor.vercel.app/`
2. **Cliquez sur** "Se connecter"
3. **Entrez** les identifiants
4. **Accédez au dashboard** : `/admin/dashboard`

## Dépannage

### Si "Invalid login credentials"
- Vérifiez que l'utilisateur existe dans Supabase Auth
- Vérifiez que le profil a `is_admin = true`
- Essayez de créer un nouvel utilisateur

### Si erreur 403 "Accès administrateur requis"
- Vérifiez que `is_admin = true` dans la table `profiles`
- Vérifiez que l'utilisateur est bien connecté
- Essayez de vous déconnecter et reconnecter
