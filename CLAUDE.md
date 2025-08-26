# Brief Technique - Landing Page Concours Photo DINOR

## Vue d'ensemble du projet

### Concept Simplifié
Landing page unique permettant aux utilisateurs de :
- **S'inscrire** comme candidat au concours photo
- **Voter** pour les candidats (1 vote par candidat par jour maximum)
- Utilisation de **reCAPTCHA** pour sécuriser inscriptions et votes
- Design **vintage années 50-60** avec palette DINOR

### Fonctionnalités Principales
- **Inscription candidats** : Formulaire avec photo upload
- **Galerie de vote** : Grid des candidats avec boutons vote
- **Rate limiting** : 1 vote par candidat par jour par IP
- **Sécurité** : reCAPTCHA v3 sur inscription et vote
- **Temps réel** : Mise à jour compteurs votes instantanée

## Architecture Technique

### Stack Technologique
- **Frontend** : HTML/CSS/JavaScript Vanilla ou Nuxt.js 3
- **Backend** : API Routes Nuxt.js ou Node.js Express
- **Base de données** : Firebase Firestore
- **Storage** : Firebase Storage (photos candidats)
- **Auth** : Pas de connexion utilisateur - tracking par IP
- **Security** : Google reCAPTCHA v3
- **Déploiement** : Vercel/Netlify

### Structure Simplifiée

```
project/
├── index.html (ou pages/index.vue)
├── api/
│   ├── candidates.js (GET/POST)
│   ├── vote.js (POST)
│   └── upload.js (POST)
├── assets/
│   ├── css/dinor-style.css
│   └── js/main.js
├── firebase/
│   ├── config.js
│   └── firestore.rules
└── components/
    ├── CandidateCard.js
    ├── VoteModal.js
    └── RegistrationForm.js
```

## Base de Données Firebase

### Collections Firestore
```javascript
// Collection: candidates
{
  id: "auto-generated",
  nom: "Kouassi",
  prenom: "Adjoua", 
  whatsapp: "+22507123456",
  photo_url: "https://storage.googleapis.com/...",
  photo_filename: "candidate_123.jpg",
  votes_count: 42,
  status: "approved", // pending, approved, rejected
  created_at: "2025-09-06T10:30:00Z"
}

// Collection: votes (tracking par IP)
{
  id: "auto-generated",
  candidate_id: "candidate-doc-id",
  ip_address: "196.43.XXX.XXX",
  user_agent: "Mozilla/5.0...",
  vote_date: "2025-09-08", // Format YYYY-MM-DD pour rate limiting quotidien
  created_at: "2025-09-08T14:20:00Z"
}

// Collection: vote_limits (rate limiting par IP/candidat/jour)
{
  id: "ip_candidateId_date", // Ex: "196.43.1.1_abc123_2025-09-08"
  ip_address: "196.43.XXX.XXX",
  candidate_id: "candidate-doc-id",
  vote_date: "2025-09-08",
  vote_count: 1, // Max 1 par jour
  created_at: "2025-09-08T14:20:00Z"
}
```

## Interface Utilisateur

### Page Unique - Sections

#### 1. Hero Section
```html
<!-- Design rétro DINOR avec palette vintage -->
<section class="hero bg-gradient-primary">
  <h1 class="retro-title">Concours Photo Rétro DINOR</h1>
  <h2 class="vintage-subtitle">Cuisine Vintage des Années 60</h2>
  <p class="description">Participez ou votez pour vos photos préférées !</p>
  <div class="cta-buttons">
    <button class="btn-retro" onclick="openRegistration()">Participer</button>
    <button class="btn-retro-secondary" onclick="scrollToGallery()">Voter</button>
  </div>
</section>
```

#### 2. Formulaire d'Inscription (Modal)
```html
<div id="registrationModal" class="modal">
  <form id="candidateForm" class="registration-form card-retro">
    <h3>Inscription Candidat</h3>
    
    <input type="text" class="input-retro" id="nom" placeholder="Nom" required>
    <input type="text" class="input-retro" id="prenom" placeholder="Prénom" required>
    <input type="tel" class="input-retro" id="whatsapp" placeholder="+225 XX XX XX XX" required>
    
    <div class="photo-upload">
      <input type="file" id="photo" accept="image/*" required>
      <div class="photo-preview"></div>
    </div>
    
    <!-- reCAPTCHA v3 intégré -->
    <div class="recaptcha-info">🛡️ Protection anti-spam activée</div>
    
    <button type="submit" class="btn-retro">S'inscrire</button>
    <button type="button" class="btn-cancel" onclick="closeModal()">Annuler</button>
  </form>
</div>
```

#### 3. Galerie de Vote
```html
<section id="gallery" class="candidates-gallery">
  <h2 class="section-title">Votez pour vos photos préférées</h2>
  <p class="vote-rules">⏰ 1 vote par candidat par jour maximum</p>
  
  <div class="candidates-grid">
    <!-- Généré dynamiquement -->
    <div class="candidate-card card-retro">
      <img src="candidate-photo.jpg" alt="Photo candidat" class="candidate-photo">
      <div class="candidate-info">
        <h4 class="candidate-name">Adjoua K.</h4>
        <p class="candidate-votes">❤️ 42 votes</p>
        <button class="btn-vote" onclick="vote('candidateId')">Voter</button>
        <!-- ou -->
        <div class="voted-today">✅ Voté aujourd'hui</div>
      </div>
    </div>
  </div>
</section>
```

## API Endpoints

### 1. API Candidats
```javascript
// GET /api/candidates - Liste candidats approuvés
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await db.collection('candidates')
      .where('status', '==', 'approved')
      .orderBy('votes_count', 'desc')
      .get();
    
    res.json(candidates.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/candidates - Nouvelle inscription
app.post('/api/candidates', async (req, res) => {
  try {
    // 1. Vérifier reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(req.body.recaptcha_token);
    if (!recaptchaValid) {
      return res.status(400).json({ error: 'Vérification anti-spam échouée' });
    }
    
    // 2. Valider numéro ivoirien
    if (!req.body.whatsapp.startsWith('+225')) {
      return res.status(400).json({ error: 'Numéro WhatsApp ivoirien requis' });
    }
    
    // 3. Sauvegarder candidat
    const candidate = await db.collection('candidates').add({
      nom: req.body.nom,
      prenom: req.body.prenom,
      whatsapp: req.body.whatsapp,
      photo_url: req.body.photo_url,
      votes_count: 0,
      status: 'pending',
      created_at: new Date()
    });
    
    res.json({ success: true, id: candidate.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. API Vote
```javascript
// POST /api/vote - Enregistrer vote
app.post('/api/vote', async (req, res) => {
  try {
    const { candidate_id, recaptcha_token } = req.body;
    const ip_address = req.ip;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // 1. Vérifier reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptcha_token);
    if (!recaptchaValid) {
      return res.status(400).json({ error: 'Vérification anti-spam échouée' });
    }
    
    // 2. Vérifier rate limiting (1 vote/candidat/jour/IP)
    const vote_limit_id = `${ip_address}_${candidate_id}_${today}`;
    const existingVote = await db.collection('vote_limits').doc(vote_limit_id).get();
    
    if (existingVote.exists) {
      return res.status(429).json({ error: 'Vous avez déjà voté pour ce candidat aujourd\'hui' });
    }
    
    // 3. Enregistrer vote
    await db.runTransaction(async (transaction) => {
      // Incrémenter compteur candidat
      const candidateRef = db.collection('candidates').doc(candidate_id);
      const candidate = await transaction.get(candidateRef);
      transaction.update(candidateRef, {
        votes_count: candidate.data().votes_count + 1
      });
      
      // Enregistrer vote
      const voteRef = db.collection('votes').doc();
      transaction.set(voteRef, {
        candidate_id,
        ip_address,
        vote_date: today,
        user_agent: req.get('User-Agent'),
        created_at: new Date()
      });
      
      // Rate limiting
      const limitRef = db.collection('vote_limits').doc(vote_limit_id);
      transaction.set(limitRef, {
        ip_address,
        candidate_id,
        vote_date: today,
        vote_count: 1,
        created_at: new Date()
      });
    });
    
    res.json({ success: true, message: 'Vote enregistré !' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Sécurité & Configuration

### 1. Google reCAPTCHA v3
```javascript
// Configuration reCAPTCHA
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

async function verifyRecaptcha(token) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
  });
  
  const data = await response.json();
  return data.success && data.score > 0.5; // Score minimum pour validation
}

// Frontend - Intégration reCAPTCHA
function executeRecaptcha(action) {
  return new Promise((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha.execute('SITE_KEY', { action }).then(resolve);
    });
  });
}
```

### 2. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Candidats - lecture publique des approuvés
    match /candidates/{candidateId} {
      allow read: if resource.data.status == 'approved';
      allow create: if true; // Via API avec reCAPTCHA
      allow update: if false; // Pas de modifications directes
    }
    
    // Votes - lecture interdite, écriture via API
    match /votes/{voteId} {
      allow read, write: if false;
    }
    
    // Rate limiting - gestion serveur uniquement
    match /vote_limits/{limitId} {
      allow read, write: if false;
    }
  }
}
```

## Style CSS avec Palette DINOR

### Configuration CSS Principal
```css
/* Import palette DINOR générée */
:root {
  --dinor-orange: #FF8C00;
  --dinor-orange-light: #FFB84D;
  --dinor-cream: #FFF8DC;
  --dinor-brown: #8B4513;
  --dinor-brown-dark: #2C1810;
  --dinor-beige: #F5DEB3;
  --dinor-red-vintage: #CD853F;
  --dinor-olive: #808000;
}

/* Gradients */
.bg-gradient-primary {
  background: linear-gradient(135deg, var(--dinor-orange) 0%, var(--dinor-orange-light) 100%);
}

.bg-gradient-brown {
  background: linear-gradient(45deg, var(--dinor-brown) 0%, var(--dinor-red-vintage) 100%);
}

/* Classes utilitaires */
.btn-retro {
  background: linear-gradient(45deg, var(--dinor-orange), var(--dinor-orange-light));
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255,140,0,0.3);
}

.btn-retro:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255,140,0,0.4);
}

.card-retro {
  background: linear-gradient(135deg, var(--dinor-cream), var(--dinor-beige));
  border: 2px solid var(--dinor-red-vintage);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(139,69,19,0.2);
}

.input-retro {
  background: var(--dinor-cream);
  border: 2px solid var(--dinor-beige);
  border-radius: 10px;
  padding: 15px;
  font-size: 1em;
  width: 100%;
  transition: border-color 0.3s ease;
}

.input-retro:focus {
  outline: none;
  border-color: var(--dinor-orange);
  box-shadow: 0 0 10px rgba(255,140,0,0.2);
}

/* Responsive design */
.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

.candidate-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}
```

## JavaScript Principal

### Fonctions Principales
```javascript
// État global
let candidates = [];
let userVotesToday = new Set(); // Track votes IP aujourd'hui

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
  await loadCandidates();
  await checkVotesToday();
  setupEventListeners();
});

// Charger candidats
async function loadCandidates() {
  try {
    const response = await fetch('/api/candidates');
    candidates = await response.json();
    renderCandidates();
  } catch (error) {
    console.error('Erreur chargement candidats:', error);
  }
}

// Inscription candidat
async function submitRegistration(event) {
  event.preventDefault();
  
  try {
    // Obtenir token reCAPTCHA
    const recaptcha_token = await executeRecaptcha('registration');
    
    // Upload photo
    const photoFile = document.getElementById('photo').files[0];
    const photo_url = await uploadPhoto(photoFile);
    
    // Soumettre inscription
    const response = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        whatsapp: document.getElementById('whatsapp').value,
        photo_url,
        recaptcha_token
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('✅ Inscription réussie ! Votre candidature sera validée sous 24h.');
      closeModal();
      document.getElementById('candidateForm').reset();
    } else {
      alert('❌ Erreur: ' + result.error);
    }
  } catch (error) {
    alert('❌ Erreur lors de l\'inscription: ' + error.message);
  }
}

// Vote pour candidat
async function vote(candidate_id) {
  try {
    // Vérifier si déjà voté aujourd'hui
    if (userVotesToday.has(candidate_id)) {
      alert('⏰ Vous avez déjà voté pour ce candidat aujourd\'hui !');
      return;
    }
    
    // Obtenir token reCAPTCHA
    const recaptcha_token = await executeRecaptcha('vote');
    
    // Envoyer vote
    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate_id,
        recaptcha_token
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('✅ Vote enregistré !');
      userVotesToday.add(candidate_id);
      await loadCandidates(); // Recharger pour voir nouveau compteur
      updateVoteButtons();
    } else {
      alert('❌ Erreur: ' + result.error);
    }
  } catch (error) {
    alert('❌ Erreur lors du vote: ' + error.message);
  }
}
```

## Variables d'environnement

```bash
# Firebase
FIREBASE_PROJECT_ID=concours-dinor-ci
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# reCAPTCHA
RECAPTCHA_SECRET_KEY=...
RECAPTCHA_SITE_KEY=... # Pour le frontend

# Sécurité
ALLOWED_COUNTRIES=CI
```

## Déploiement

### Étapes Vercel
```bash
# 1. Build et déploiement
npm run build
vercel --prod

# 2. Configurer variables d'environnement sur Vercel
# 3. Configurer domaine personnalisé
# 4. Tester reCAPTCHA en production
```

Ce brief simplifié permet de créer rapidement une landing page fonctionnelle avec inscription, vote, et sécurité reCAPTCHA, le tout dans l'esprit vintage DINOR ! 🎨✨