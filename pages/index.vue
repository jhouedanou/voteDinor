<template>
  <div class="min-h-screen bg-dinor-cream">
    <!-- Header avec authentification -->
    <header class="bg-dinor-brown shadow-lg">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-retro font-bold text-dinor-cream">DINOR</h1>
          <!-- Bouton déconnexion visible pour utilisateurs connectés -->
          <button 
            v-if="user" 
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-1"
            title="Se déconnecter"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Déconnexion
          </button>
        </div>
        <AuthUserMenu @openLogin="showLoginModal = true" />
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero bg-gradient-dinor text-white py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="retro-title text-5xl md:text-7xl font-retro font-bold mb-4 text-shadow-lg">
          Concours Photo Rétro DINOR
        </h1>
        <h2 class="vintage-subtitle text-2xl md:text-3xl font-vintage mb-6 text-dinor-cream">
          Cuisine Vintage des Années 60
        </h2>
        <p class="description text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Participez ou votez pour vos photos préférées ! Redécouvrez l'art culinaire d'antan avec DINOR.
        </p>
        <div class="cta-buttons flex flex-col sm:flex-row gap-4 justify-center">
          <!-- Bouton Participer - désactivé si déjà candidat -->
          <button 
            @click="handleParticipate" 
            :disabled="isUserCandidate"
            :class="isUserCandidate ? 
              'btn-retro px-8 py-4 text-lg font-bold rounded-full bg-gray-400 text-gray-600 cursor-not-allowed opacity-60' :
              'btn-retro px-8 py-4 text-lg font-bold rounded-full bg-white text-dinor-orange hover:bg-dinor-beige transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'"
          >
            {{ isUserCandidate ? '✅ Déjà candidat' : '🎯 Participer' }}
          </button>
          
          <!-- Bouton Voter - désactivé si candidat -->
          <button 
            @click="scrollToGallery" 
            :disabled="isUserCandidate"
            :class="isUserCandidate ? 
              'btn-retro-secondary px-8 py-4 text-lg font-bold rounded-full border-2 border-gray-400 text-gray-400 cursor-not-allowed opacity-60' :
              'btn-retro-secondary px-8 py-4 text-lg font-bold rounded-full border-2 border-white text-white hover:bg-white hover:text-dinor-orange transition-all duration-300 transform hover:scale-105'"
          >
            {{ isUserCandidate ? '🚫 Interdit' : '❤️ Voter' }}
          </button>
          <nuxt-link 
            to="/classements" 
            class="btn-retro-secondary px-8 py-4 text-lg font-bold rounded-full border-2 border-white text-white hover:bg-white hover:text-dinor-orange transition-all duration-300 transform hover:scale-105 text-center"
          >
            🏆 Classements
          </nuxt-link>
        </div>
      </div>
    </section>

    <!-- Registration Modal -->
    <div v-if="showRegistrationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="card-retro bg-dinor-cream border-2 border-dinor-red-vintage rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <form @submit.prevent="submitRegistration" class="registration-form">
          <h3 class="text-2xl font-retro font-bold mb-6 text-dinor-brown text-center">Inscription Candidat</h3>
          
          <div class="space-y-4">
            <input 
              v-model="form.nom"
              type="text" 
              class="input-retro w-full bg-dinor-beige border-2 border-dinor-olive rounded-lg px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange focus:ring-2 focus:ring-dinor-orange focus:ring-opacity-20" 
              placeholder="Nom" 
              required
            >
            <input 
              v-model="form.prenom"
              type="text" 
              class="input-retro w-full bg-dinor-beige border-2 border-dinor-olive rounded-lg px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange focus:ring-2 focus:ring-dinor-orange focus:ring-opacity-20" 
              placeholder="Prénom" 
              required
            >
            <input 
              v-model="form.whatsapp"
              type="tel" 
              class="input-retro w-full bg-dinor-beige border-2 border-dinor-olive rounded-lg px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange focus:ring-2 focus:ring-dinor-orange focus:ring-opacity-20" 
              placeholder="+225 XX XX XX XX" 
              required
            >
            
            <div class="photo-upload border-2 border-dashed border-dinor-olive rounded-lg p-6 text-center">
              <input 
                @change="handlePhotoSelect"
                type="file" 
                ref="photoInput"
                accept="image/*" 
                required 
                class="hidden"
              >
              <div v-if="!photoPreview" @click="$refs.photoInput.click()" class="cursor-pointer">
                <div class="text-4xl mb-2">📸</div>
                <p class="text-dinor-brown font-medium">Cliquez pour ajouter votre photo</p>
                <p class="text-sm text-dinor-brown mt-2">
                  <span class="bg-dinor-beige px-2 py-1 rounded">📏 Maximum 2MB</span>
                </p>
                <p class="text-xs text-dinor-brown mt-1 opacity-75">
                  Formats acceptés : JPG, PNG, GIF
                </p>
              </div>
              <div v-else class="space-y-4">
                <div class="relative">
                  <img :src="photoPreview" alt="Aperçu photo" class="w-32 h-32 object-cover rounded-lg mx-auto">
                  <div class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {{ form.photo ? (form.photo.size / 1024 / 1024).toFixed(1) + 'MB' : '' }}
                  </div>
                </div>
                <button @click="$refs.photoInput.click()" type="button" class="text-dinor-orange hover:text-dinor-brown">
                  Changer la photo
                </button>
                <p class="text-xs text-dinor-brown opacity-75">
                  ✓ Image conforme (max 2MB)
                </p>
              </div>
            </div>
          </div>
          
          <div class="recaptcha-info mt-4 p-3 bg-dinor-beige rounded-lg text-center text-sm text-dinor-brown">
            🛡️ Protection anti-spam activée
          </div>
          
          <div class="flex gap-4 mt-6">
            <button 
              type="submit" 
              :disabled="loading"
              class="btn-retro flex-1 bg-gradient-dinor text-white py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {{ loading ? 'Inscription...' : "S'inscrire" }}
            </button>
            <button 
              @click="closeModal" 
              type="button" 
              class="btn-cancel flex-1 bg-dinor-brown text-white py-3 rounded-full font-bold hover:bg-dinor-brown-dark transition-all duration-300"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Candidates Gallery -->
    <section id="gallery" class="candidates-gallery py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-4xl font-retro font-bold text-center mb-4 text-dinor-brown">
          Votez pour vos photos préférées
        </h2>
        <p class="vote-rules text-center text-lg text-dinor-brown mb-12">
          ⏰ 1 vote par candidat par jour maximum
        </p>
        
        <div class="candidates-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="candidate in candidates" 
            :key="candidate.id"
            class="candidate-card card-retro bg-white border-2 border-dinor-red-vintage rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <img 
              :src="candidate.photo_url" 
              :alt="`Photo de ${candidate.prenom} ${candidate.nom}`" 
              class="candidate-photo w-full h-48 object-cover"
            >
            <div class="candidate-info p-4">
              <h4 class="candidate-name text-lg font-bold text-dinor-brown mb-2">
                {{ candidate.prenom }} {{ candidate.nom.charAt(0) }}.
              </h4>
              <p class="candidate-votes text-dinor-red-vintage font-semibold mb-3">
                ❤️ {{ candidate.votes_count }} votes
              </p>
              
              <!-- Partage social pour utilisateurs connectés -->
              <div v-if="user" class="mb-3">
                <SocialShare :candidate="candidate" />
              </div>
              
              <!-- Si utilisateur non connecté -->
              <button 
                v-if="!user"
                @click="showLoginModal = true" 
                class="btn-vote w-full bg-dinor-beige text-dinor-brown py-2 rounded-full font-bold hover:bg-dinor-cream transition-all duration-300"
              >
                🔒 Se connecter pour voter
              </button>
              
              <!-- Si utilisateur est candidat -->
              <div v-else-if="isUserCandidate" class="text-center py-2 text-dinor-olive font-semibold">
                🚫 Vous ne pouvez pas voter (vous êtes candidat)
              </div>
              
              <!-- Si utilisateur connecté mais n'a pas encore voté -->
              <button 
                v-else-if="!hasVotedToday(candidate.id)"
                @click="vote(candidate.id)" 
                :disabled="loadingVotes.has(candidate.id)"
                class="btn-vote w-full bg-gradient-dinor text-white py-2 rounded-full font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {{ loadingVotes.has(candidate.id) ? 'Vote...' : 'Voter' }}
              </button>
              
              <!-- Si déjà voté aujourd'hui -->
              <div v-else class="voted-today text-center py-2 text-dinor-olive font-semibold">
                ✅ Voté aujourd'hui
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="candidates.length === 0" class="text-center py-16">
          <div class="text-6xl mb-4">📷</div>
          <h3 class="text-2xl font-retro text-dinor-brown mb-2">Aucun candidat pour le moment</h3>
          <p class="text-dinor-brown">Soyez le premier à participer !</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dinor-brown text-dinor-cream py-8 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-2xl font-retro font-bold mb-2">DINOR - Cuisine Vintage</h3>
        <p class="text-dinor-beige">Redécouvrez les saveurs authentiques des années 60</p>
        <div class="mt-4 text-sm text-dinor-beige">
          © 2025 Concours Photo DINOR - Flashback Gourmand
        </div>
      </div>
    </footer>

    <!-- Login Modal -->
    <AuthLoginModal 
      :show="showLoginModal" 
      @close="showLoginModal = false"
      @success="handleAuthSuccess" 
    />

    <!-- Success/Error Toast -->
    <div v-if="toast.show" :class="toastClass" class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div class="flex items-center">
        <span class="mr-2">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Composables Supabase
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Fonction de déconnexion
const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await navigateTo('/')
    showToast('Déconnexion réussie', 'success')
  } catch (error) {
    showToast('Erreur lors de la déconnexion: ' + error.message, 'error')
  }
}

// Reactive data
const showRegistrationModal = ref(false)
const showLoginModal = ref(false)
const candidates = ref([])
const loading = ref(false)
const loadingVotes = ref(new Set()) // Pour tracker les votes en cours par candidat
const photoPreview = ref(null)
const userVotesToday = ref(new Set())

const form = ref({
  nom: '',
  prenom: '',
  whatsapp: '',
  photo: null
})

const toast = ref({
  show: false,
  type: 'success',
  message: ''
})

// Computed
const toastClass = computed(() => ({
  'bg-green-500 text-white': toast.value.type === 'success',
  'bg-red-500 text-white': toast.value.type === 'error'
}))

// Methods
const handleParticipate = () => {
  if (!user.value) {
    showLoginModal.value = true
    return
  }
  
  if (isUserCandidate.value) {
    showToast('Vous êtes déjà candidat au concours !', 'error')
    return
  }
  
  showRegistrationModal.value = true
}

const handleAuthSuccess = (message) => {
  showToast(message, 'success')
}

const openRegistration = () => {
  showRegistrationModal.value = true
}

const closeModal = () => {
  showRegistrationModal.value = false
  form.value = { nom: '', prenom: '', whatsapp: '', photo: null }
  photoPreview.value = null
}

const scrollToGallery = () => {
  document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })
}

const handlePhotoSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Vérifier la taille (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB en bytes
    if (file.size > maxSize) {
      showToast('L\'image ne doit pas dépasser 2MB. Taille actuelle: ' + (file.size / 1024 / 1024).toFixed(1) + 'MB', 'error')
      // Reset l'input
      event.target.value = ''
      return
    }
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      showToast('Seules les images sont acceptées (JPG, PNG, GIF)', 'error')
      event.target.value = ''
      return
    }
    
    form.value.photo = file
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    
    // Afficher la taille de l'image sélectionnée
    const sizeInMB = (file.size / 1024 / 1024).toFixed(1)
    showToast(`Image sélectionnée (${sizeInMB}MB) ✓`, 'success')
  }
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

const submitRegistration = async () => {
  try {
    loading.value = true
    
    // Vérifications
    if (!user.value) {
      showToast('Vous devez être connecté pour participer', 'error')
      return
    }
    
    if (!form.value.photo) {
      showToast('Veuillez sélectionner une photo', 'error')
      return
    }
    
    // Validate Ivorian phone number
    if (!form.value.whatsapp.startsWith('+225')) {
      showToast('Numéro WhatsApp ivoirien requis (+225)', 'error')
      return
    }
    
    // Convertir la photo en base64 pour l'API
    const reader = new FileReader()
    const photoBase64 = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(form.value.photo)
    })
    
    // Récupérer le token de session
    const supabase = useSupabaseClient()
    const { data: session } = await supabase.auth.getSession()
    
    // Envoyer l'inscription avec la photo
    const response = await $fetch('/api/candidates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.session?.access_token}`
      },
      body: {
        nom: form.value.nom,
        prenom: form.value.prenom,
        whatsapp: form.value.whatsapp,
        photo_data: photoBase64
      }
    })
    
    if (response.success) {
      // Envoyer email de notification d'inscription candidat
      try {
        await $fetch('/api/send-email', {
          method: 'POST',
          body: {
            type: 'candidate_registration',
            email: 'admin@dinor.ci', // Email admin pour notification
            candidateName: `${form.value.prenom} ${form.value.nom}`
          }
        })
      } catch (emailError) {
        console.error('Erreur envoi email admin:', emailError)
      }
      
      // Recharger les candidats pour mettre à jour l'interface
      await loadCandidates()
      
      // Rediriger vers la page de remerciement
      showToast('Inscription soumise avec succès !', 'success')
      closeModal()
      await navigateTo('/merci')
    }
    
  } catch (error) {
    showToast('Erreur lors de l\'inscription: ' + (error.data?.message || error.message), 'error')
  } finally {
    loading.value = false
  }
}

const vote = async (candidateId) => {
  // Vérifier si l'utilisateur est connecté
  if (!user.value) {
    showLoginModal.value = true
    showToast('Vous devez être connecté pour voter', 'error')
    return
  }

  if (hasVotedToday(candidateId)) {
    showToast('Vous avez déjà voté pour ce candidat aujourd\'hui !', 'error')
    return
  }

  try {
    // Marquer ce candidat comme en cours de vote
    loadingVotes.value.add(candidateId)
    
    // Appeler l'API de vote avec l'auth token
    const supabase = useSupabaseClient()
    const { data: session } = await supabase.auth.getSession()
    
    const response = await $fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.session?.access_token}`
      },
      body: {
        candidate_id: candidateId
      }
    })
    
    if (response.success) {
      // Marquer comme voté localement
      userVotesToday.value.add(candidateId)
      
      // Mettre à jour le compteur local
      const candidate = candidates.value.find(c => c.id === candidateId)
      if (candidate) {
        candidate.votes_count++
      }
      
      showToast(response.message || 'Vote enregistré avec succès !', 'success')
    }
  } catch (error) {
    showToast('Erreur lors du vote: ' + (error.data?.message || error.message), 'error')
  } finally {
    // Retirer ce candidat du loading
    loadingVotes.value.delete(candidateId)
  }
}

const hasVotedToday = (candidateId) => {
  return userVotesToday.value.has(candidateId)
}

// Vérifier si l'utilisateur connecté est déjà candidat
const isUserCandidate = computed(() => {
  if (!user.value) return false
  
  return candidates.value.some(candidate => {
    // Vérifier par email s'il est défini
    return candidate.email === user.value.email ||
           // Ou par nom complet si disponible
           (user.value.user_metadata?.full_name && 
            `${candidate.prenom} ${candidate.nom}`.toLowerCase() === 
            user.value.user_metadata.full_name.toLowerCase())
  })
})

const loadCandidates = async () => {
  try {
    // Charger depuis l'API
    const response = await $fetch('/api/candidates')
    candidates.value = response || []
    
    // Si aucun candidat, afficher des données de test
    if (candidates.value.length === 0) {
      candidates.value = [
        {
          id: '1',
          nom: 'Kouassi',
          prenom: 'Adjoua',
          photo_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
          votes_count: 42,
          status: 'approved'
        },
        {
          id: '2',
          nom: 'Traore',
          prenom: 'Mamadou',
          photo_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          votes_count: 35,
          status: 'approved'
        },
        {
          id: '3',
          nom: 'Diallo',
          prenom: 'Fatou',
          photo_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
          votes_count: 28,
          status: 'approved'
        }
      ]
    }
  } catch (error) {
    console.error('Erreur chargement candidats:', error)
    // Afficher des données de test en cas d'erreur
    candidates.value = [
      {
        id: '1',
        nom: 'Kouassi',
        prenom: 'Adjoua',
        photo_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        votes_count: 42,
        status: 'approved'
      },
      {
        id: '2',
        nom: 'Traore',
        prenom: 'Mamadou',
        photo_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        votes_count: 35,
        status: 'approved'
      }
    ]
  }
}

const checkVotesToday = async () => {
  try {
    // TODO: Check votes from localStorage or API based on IP
    const savedVotes = localStorage.getItem('votes_today')
    if (savedVotes) {
      userVotesToday.value = new Set(JSON.parse(savedVotes))
    }
  } catch (error) {
    console.error('Erreur vérification votes:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await loadCandidates()
  await checkVotesToday()
})

// Watch for votes changes to save to localStorage
watch(userVotesToday, (newVotes) => {
  localStorage.setItem('votes_today', JSON.stringify([...newVotes]))
}, { deep: true })
</script>

<style scoped>
.text-shadow-lg {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.card-retro {
  background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
}

.btn-retro:hover {
  transform: translateY(-2px);
}

.candidate-card:hover {
  transform: translateY(-4px);
}
</style>