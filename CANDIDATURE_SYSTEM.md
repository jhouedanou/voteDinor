# Système de Candidature DINOR

## Architecture du système

### 1. Upload d'image (Cloudinary)
- **Service** : Cloudinary
- **Fonction** : Stockage et optimisation des images
- **API** : `/api/upload-photo.post.ts`
- **Format** : Base64 → Cloudinary
- **Optimisations** : Redimensionnement automatique, compression

### 2. Création de candidature
- **Service** : Supabase (base de données)
- **Fonction** : Stockage des informations candidat
- **API** : `/api/candidates.post.ts`
- **Statut initial** : `pending`

### 3. Notification d'approbation
- **Service** : HeroTofu
- **Fonction** : Envoi d'emails de notification
- **API** : `/api/notify-approval.post.ts`
- **Types** : `approved` / `rejected`

## Flux complet

### 1. Inscription candidat
```
Utilisateur → Upload photo (Cloudinary) → Création candidature (Supabase) → Statut: pending
```

### 2. Approbation admin
```
Admin → Dashboard → Approuver/Rejeter → Mise à jour statut → Notification email (HeroTofu)
```

### 3. Notification candidat
```
Email reçu → Candidat informé → Actions selon le statut
```

## Configuration requise

### Variables d'environnement
```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# HeroTofu (optionnel)
DISABLE_EMAIL=true  # Pour désactiver temporairement
```

### Base de données Supabase
```sql
-- Table candidates
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  photo_url TEXT,
  description TEXT,
  votes_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Fonctionnalités

### Upload d'image
- ✅ Validation du type de fichier
- ✅ Limite de taille (2MB)
- ✅ Optimisation automatique
- ✅ Organisation par dossier
- ✅ URL sécurisée

### Gestion des candidatures
- ✅ Statut en attente par défaut
- ✅ Interface admin pour approbation
- ✅ Notification automatique
- ✅ Gestion des erreurs

### Notifications
- ✅ Email d'approbation avec instructions
- ✅ Email de rejet avec critères
- ✅ Design rétro cohérent
- ✅ Liens vers le site

## Utilisation

### Pour les candidats
1. Se connecter avec Google/Facebook
2. Remplir le formulaire d'inscription
3. Uploader une photo vintage
4. Attendre l'approbation (24h max)

### Pour les admins
1. Accéder au dashboard admin
2. Voir les candidatures en attente
3. Approuver ou rejeter
4. Notification automatique envoyée

## Dépannage

### Problème d'upload Cloudinary
- Vérifier les variables d'environnement
- Vérifier les permissions Cloudinary
- Vérifier la taille du fichier

### Problème de notification
- Vérifier HeroTofu endpoint
- Utiliser `DISABLE_EMAIL=true` temporairement
- Vérifier les logs dans Vercel

### Problème d'approbation
- Vérifier les permissions Supabase
- Vérifier la connexion admin
- Vérifier les logs d'erreur
