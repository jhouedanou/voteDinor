<template>
  <div class="min-h-screen bg-dinor-cream">
    <!-- Header avec authentification -->
    <header class="bg-dinor-brown shadow-lg">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-retro font-bold text-dinor-cream">DINOR</h1>
        </div>
        <AuthUserMenu @openLogin="showVoterLogin = true" @openCandidateLogin="showCandidateLogin = true" />
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
              'px-8 py-4 text-lg font-bold bg-gray-400 text-gray-600 cursor-not-allowed opacity-60' :
              'px-8 py-4 text-lg font-bold bg-white text-dinor-orange hover:bg-dinor-beige transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'"
            style="border-radius: 8px;"
          >
            {{ isUserCandidate ? '✅ Déjà candidat' : '🎯 Participer' }}
          </button>
          
          <!-- Bouton Voter - désactivé si candidat -->
          <button 
            @click="scrollToGallery" 
            :disabled="isUserCandidate"
            :class="isUserCandidate ? 
              'px-8 py-4 text-lg font-bold border-2 border-gray-400 text-gray-400 cursor-not-allowed opacity-60' :
              'px-8 py-4 text-lg font-bold border-2 border-white text-white hover:bg-white hover:text-dinor-orange transition-all duration-300 transform hover:scale-105'"
            style="border-radius: 8px;"
          >
            {{ isUserCandidate ? '🚫 Interdit' : '❤️ Voter' }}
          </button>
          <nuxt-link 
            to="/classements" 
            class="px-8 py-4 text-lg font-bold border-2 border-white text-white hover:bg-white hover:text-dinor-orange transition-all duration-300 transform hover:scale-105 text-center"
            style="border-radius: 8px;"
          >
            🏆 Classements
          </nuxt-link>
        </div>
      </div>
    </section>

    <!-- Registration Modal -->
    <div v-if="showRegistrationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="card-retro bg-dinor-cream border-2 border-dinor-red-vintage p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" style="border-radius: 12px;">
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
              class="btn-retro flex-1 bg-gradient-dinor text-white py-3 font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              style="border-radius: 8px;"
            >
              {{ loading ? 'Inscription...' : "S'inscrire" }}
            </button>
            <button 
              @click="closeModal" 
              type="button" 
              class="btn-cancel flex-1 bg-dinor-brown text-white py-3 font-bold hover:bg-dinor-brown-dark transition-all duration-300"
              style="border-radius: 8px;"
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
          🔒 1 vote par candidat par jour par compte connecté
        </p>
        
        <div class="candidates-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="candidate in candidates" 
            :key="candidate.id"
            class="candidate-card card-retro bg-white border-2 border-dinor-red-vintage overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            style="border-radius: 8px;"
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
                @click="showVoterLogin = true" 
                class="w-full bg-dinor-beige text-dinor-brown py-2 font-bold hover:bg-dinor-cream transition-all duration-300"
                style="border-radius: 6px;"
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
                class="w-full bg-gradient-dinor text-white py-2 font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                style="border-radius: 6px;"
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
        
        <!-- Legal Links -->
        <div class="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <nuxt-link 
            to="/privacy-policy" 
            class="text-dinor-beige hover:text-dinor-orange transition-colors duration-200"
          >
            🔒 Politique de Confidentialité
          </nuxt-link>
          <nuxt-link 
            to="/terms-of-service" 
            class="text-dinor-beige hover:text-dinor-orange transition-colors duration-200"
          >
            📜 Conditions Générales
          </nuxt-link>
          <nuxt-link 
            to="/delete-account" 
            class="text-dinor-beige hover:text-red-400 transition-colors duration-200"
          >
            🗑️ Supprimer mon compte
          </nuxt-link>
        </div>
        
        <div class="mt-4 text-sm text-dinor-beige">
          © 2025 Concours Photo DINOR - Flashback Gourmand
        </div>
      </div>
    </footer>

    <!-- Candidate Login Modal -->
    <AuthCandidateLoginModal 
      :show="showCandidateLogin" 
      @close="showCandidateLogin = false"
      @success="handleAuthSuccess" 
    />

    <!-- Voter Login Modal -->
    <AuthVoterLoginModal 
      :show="showVoterLogin" 
      @close="showVoterLogin = false"
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



// Reactive data
const showRegistrationModal = ref(false)
const showCandidateLogin = ref(false)
const showVoterLogin = ref(false)
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
    showCandidateLogin.value = true
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
    showVoterLogin.value = true
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
    // Si utilisateur connecté, récupérer ses votes depuis l'API
    if (user.value) {
      const supabase = useSupabaseClient()
      const { data: session } = await supabase.auth.getSession()
      
      if (session?.session?.access_token) {
        const response = await $fetch('/api/user-votes', {
          headers: {
            'Authorization': `Bearer ${session.session.access_token}`
          }
        })
        
        if (response.votes) {
          userVotesToday.value = new Set(response.votes)
        }
      }
    } else {
      // Si pas connecté, vider les votes
      userVotesToday.value = new Set()
    }
  } catch (error) {
    console.error('Erreur vérification votes utilisateur:', error)
    userVotesToday.value = new Set()
  }
}

// Lifecycle
onMounted(async () => {
  await loadCandidates()
  await checkVotesToday()
})

// Recharger les votes quand l'utilisateur change (connexion/déconnexion)
watch(user, async (newUser) => {
  await checkVotesToday()
}, { immediate: false })
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