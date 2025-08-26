<template>
  <div class="min-h-screen bg-dinor-cream">
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
          <button 
            @click="openRegistration" 
            class="btn-retro px-8 py-4 text-lg font-bold rounded-full bg-white text-dinor-orange hover:bg-dinor-beige transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🎯 Participer
          </button>
          <button 
            @click="scrollToGallery" 
            class="btn-retro-secondary px-8 py-4 text-lg font-bold rounded-full border-2 border-white text-white hover:bg-white hover:text-dinor-orange transition-all duration-300 transform hover:scale-105"
          >
            ❤️ Voter
          </button>
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
                <p class="text-dinor-brown">Cliquez pour ajouter votre photo</p>
              </div>
              <div v-else class="space-y-4">
                <img :src="photoPreview" alt="Aperçu photo" class="w-32 h-32 object-cover rounded-lg mx-auto">
                <button @click="$refs.photoInput.click()" type="button" class="text-dinor-orange hover:text-dinor-brown">
                  Changer la photo
                </button>
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
              <button 
                v-if="!hasVotedToday(candidate.id)"
                @click="vote(candidate.id)" 
                :disabled="loading"
                class="btn-vote w-full bg-gradient-dinor text-white py-2 rounded-full font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {{ loading ? 'Vote...' : 'Voter' }}
              </button>
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

// Reactive data
const showRegistrationModal = ref(false)
const candidates = ref([])
const loading = ref(false)
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
    form.value.photo = file
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
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
    
    // Validate Ivorian phone number
    if (!form.value.whatsapp.startsWith('+225')) {
      showToast('Numéro WhatsApp ivoirien requis (+225)', 'error')
      return
    }

    // TODO: Implement photo upload and form submission
    showToast('Inscription réussie ! Votre candidature sera validée sous 24h.', 'success')
    closeModal()
  } catch (error) {
    showToast('Erreur lors de l\'inscription: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const vote = async (candidateId) => {
  if (hasVotedToday(candidateId)) {
    showToast('Vous avez déjà voté pour ce candidat aujourd\'hui !', 'error')
    return
  }

  try {
    loading.value = true
    
    // TODO: Implement vote submission with reCAPTCHA
    userVotesToday.value.add(candidateId)
    
    // Update candidate votes count locally
    const candidate = candidates.value.find(c => c.id === candidateId)
    if (candidate) {
      candidate.votes_count++
    }
    
    showToast('Vote enregistré !', 'success')
  } catch (error) {
    showToast('Erreur lors du vote: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const hasVotedToday = (candidateId) => {
  return userVotesToday.value.has(candidateId)
}

const loadCandidates = async () => {
  try {
    // TODO: Load from Firebase
    // Mock data for now
    candidates.value = [
      {
        id: '1',
        nom: 'Kouassi',
        prenom: 'Adjoua',
        photo_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        votes_count: 42
      },
      {
        id: '2',
        nom: 'Traore',
        prenom: 'Mamadou',
        photo_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        votes_count: 35
      }
    ]
  } catch (error) {
    console.error('Erreur chargement candidats:', error)
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