# 🎯 Flashback Gourmand - Concours Photo Rétro DINOR

Landing page pour le concours photo vintage DINOR avec design années 60, inscription des candidats et système de vote sécurisé.

## 🚀 Fonctionnalités

- **Design Vintage** : Palette couleurs DINOR des années 50-60
- **Inscription Candidats** : Formulaire avec upload photo
- **Vote Sécurisé** : 1 vote par candidat par jour avec reCAPTCHA v3
- **Temps Réel** : Compteurs de votes mis à jour instantanément
- **Responsive** : Compatible mobile et desktop

## 🛠 Stack Technologique

- **Frontend** : Nuxt 3 + Vue 3 + Tailwind CSS
- **Backend** : API Routes Nuxt.js
- **Base de données** : Firebase Firestore
- **Storage** : Firebase Storage
- **Sécurité** : Google reCAPTCHA v3
- **Hébergement** : Vercel/Netlify

## ⚡ Installation

1. **Cloner et installer**
```bash
npm install
```

2. **Configuration Firebase**
```bash
cp .env.example .env
# Remplir avec vos clés Firebase et reCAPTCHA
```

3. **Lancer en développement**
```bash
npm run dev
```

## 🔧 Configuration

### Firebase
1. Créer un projet Firebase
2. Activer Firestore Database
3. Activer Storage
4. Récupérer la configuration dans les paramètres du projet

### reCAPTCHA v3
1. Créer un site sur [Google reCAPTCHA](https://www.google.com/recaptcha)
2. Choisir reCAPTCHA v3
3. Ajouter votre domaine
4. Récupérer la clé de site et la clé secrète

### Variables d'environnement
```env
FIREBASE_PROJECT_ID=concours-dinor-ci
FIREBASE_API_KEY=...
RECAPTCHA_SECRET_KEY=...
RECAPTCHA_SITE_KEY=...
```

## 🎨 Design System

### Palette Couleurs DINOR
- **Orange** : #FF8C00 (principal)
- **Orange Clair** : #FFB84D
- **Crème** : #FFF8DC
- **Marron** : #8B4513
- **Beige** : #F5DEB3
- **Rouge Vintage** : #CD853F

### Classes Tailwind Personnalisées
```css
.bg-gradient-dinor
.text-dinor-orange
.border-dinor-red-vintage
```

## 📱 Structure

```
flashback-gourmand/
├── app.vue              # Page principale
├── server/api/          # API Routes
│   ├── candidates.get.ts
│   ├── candidates.post.ts
│   └── vote.post.ts
├── composables/         # Fonctions réutilisables
│   └── useRecaptcha.ts
├── plugins/             # Configuration
│   └── firebase.client.ts
└── assets/              # Styles et images
```

## 🔒 Sécurité

- **reCAPTCHA v3** sur inscription et vote
- **Rate Limiting** : 1 vote/candidat/jour/IP
- **Validation** : Numéros WhatsApp ivoiriens uniquement
- **Status** : Candidatures en attente de validation

## 🚀 Déploiement

### Vercel
```bash
npm run build
vercel --prod
```

### Variables d'environnement Vercel
Ajouter toutes les variables `.env` dans les paramètres du projet Vercel.

## 📊 Collections Firestore

### candidates
```js
{
  nom: "Kouassi",
  prenom: "Adjoua", 
  whatsapp: "+22507123456",
  photo_url: "https://storage.googleapis.com/...",
  votes_count: 42,
  status: "approved", // pending, approved, rejected
  created_at: "2025-09-06T10:30:00Z"
}
```

### votes
```js
{
  candidate_id: "candidate-doc-id",
  ip_address: "196.43.XXX.XXX",
  vote_date: "2025-09-08",
  created_at: "2025-09-08T14:20:00Z"
}
```

### vote_limits
```js
{
  id: "ip_candidateId_date",
  ip_address: "196.43.XXX.XXX",
  candidate_id: "candidate-doc-id",
  vote_date: "2025-09-08",
  vote_count: 1
}
```

## 🎯 Utilisation

1. **Inscription** : Formulaire modal avec nom, prénom, WhatsApp, photo
2. **Vote** : Clic sur bouton "Voter" avec vérification anti-spam
3. **Limitation** : 1 vote maximum par candidat par jour par IP
4. **Temps Réel** : Compteurs mis à jour instantanément

---

**DINOR - Cuisine Vintage des Années 60** 🍽️✨
