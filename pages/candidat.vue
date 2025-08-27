<template>
  <div class="min-h-screen bg-dinor-cream">
    <!-- Header avec navigation -->
    <header class="bg-dinor-brown shadow-lg">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <nuxt-link to="/" class="text-2xl font-retro font-bold text-dinor-cream hover:text-dinor-orange transition-colors">
            DINOR
          </nuxt-link>
          <span class="px-3 py-1 bg-dinor-orange text-white text-xs font-bold rounded-full">
            Espace Candidat
          </span>
        </div>
        <AuthUserMenu @openLogin="showVoterLogin = true" @openCandidateLogin="showCandidateLogin = true" />
      </div>
    </header>

    <div class="py-8">
      <div class="max-w-4xl mx-auto px-4">
        <!-- En-tête -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-retro text-dinor-brown mb-2">📸 Espace Candidat</h1>
          <p class="text-dinor-brown-dark">Partagez votre photo vintage DINOR</p>
        </div>

        <!-- Section de connexion -->
        <div v-if="!user" class="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-dinor-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">📸</span>
            </div>
            <h2 class="text-xl font-retro text-dinor-brown mb-4">Connexion requise</h2>
            <p class="text-dinor-brown-dark mb-6">Vous devez être connecté en tant que candidat pour poster une photo.</p>
            <button 
              @click="showCandidateLogin = true"
              class="bg-dinor-orange text-white px-6 py-3 rounded-lg hover:bg-dinor-orange-light transition-colors"
            >
              🗳️ Se connecter en tant que candidat
            </button>
          </div>
        </div>

        <!-- Dashboard candidat -->
        <div v-else>
          <!-- Informations utilisateur -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div class="flex items-center space-x-4">
              <img 
                :src="user.user_metadata?.avatar_url || '/default-avatar.png'" 
                :alt="user.user_metadata?.full_name || 'Avatar'"
                class="w-16 h-16 rounded-full object-cover border-4 border-dinor-beige"
              />
              <div>
                <h2 class="text-xl font-retro text-dinor-brown">{{ user.user_metadata?.full_name || user.email }}</h2>
                <p class="text-dinor-brown-dark">{{ user.email }}</p>
                <p class="text-sm text-gray-500">Candidat DINOR</p>
              </div>
            </div>
          </div>

          <!-- Formulaire de soumission de photo -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 class="text-xl font-retro text-dinor-brown mb-4">📤 Poster une nouvelle photo</h3>
            
            <form @submit.prevent="submitPhoto" class="space-y-4">
              <!-- Informations personnelles -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="prenom" class="block text-sm font-medium text-dinor-brown mb-2">
                    Prénom *
                  </label>
                  <input
                    id="prenom"
                    v-model="form.prenom"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dinor-orange focus:border-transparent"
                    placeholder="Votre prénom"
                  />
                </div>
                
                <div>
                  <label for="nom" class="block text-sm font-medium text-dinor-brown mb-2">
                    Nom *
                  </label>
                  <input
                    id="nom"
                    v-model="form.nom"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dinor-orange focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <label for="whatsapp" class="block text-sm font-medium text-dinor-brown mb-2">
                  WhatsApp (format ivoirien) *
                </label>
                <input
                  id="whatsapp"
                  v-model="form.whatsapp"
                  type="tel"
                  required
                  pattern="^\+225[0-9]{8}$"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dinor-orange focus:border-transparent"
                  placeholder="+22501234567"
                />
                <p class="text-xs text-gray-500 mt-1">Format requis : +225 suivi de 8 chiffres</p>
              </div>

              <!-- Upload de photo -->
              <div>
                <label class="block text-sm font-medium text-dinor-brown mb-2">
                  Photo vintage DINOR *
                </label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-dinor-orange transition-colors">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  
                  <div v-if="!selectedFile" @click="$refs.fileInput.click()" class="cursor-pointer">
                    <div class="w-16 h-16 bg-dinor-beige rounded-full flex items-center justify-center mx-auto mb-4">
                      <span class="text-2xl">📷</span>
                    </div>
                    <p class="text-dinor-brown font-medium">Cliquez pour sélectionner une photo</p>
                    <p class="text-sm text-gray-500 mt-1">Formats acceptés : JPG, PNG, GIF (max 5MB)</p>
                  </div>
                  
                  <div v-else class="space-y-4">
                    <img 
                      :src="previewUrl" 
                      alt="Aperçu" 
                      class="max-w-full h-64 object-cover rounded-lg mx-auto"
                    />
                    <div class="flex justify-center space-x-2">
                      <button
                        type="button"
                        @click="removeFile"
                        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        ❌ Supprimer
                      </button>
                      <button
                        type="button"
                        @click="$refs.fileInput.click()"
                        class="bg-dinor-orange text-white px-4 py-2 rounded-lg hover:bg-dinor-orange-light transition-colors"
                      >
                        📷 Changer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bouton de soumission -->
              <div class="flex justify-center pt-4">
                <button
                  type="submit"
                  :disabled="submitting || !selectedFile"
                  class="bg-dinor-orange text-white px-8 py-3 rounded-lg hover:bg-dinor-orange-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <span v-if="submitting" class="flex items-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Envoi en cours...
                  </span>
                  <span v-else>🚀 Soumettre ma candidature</span>
                </button>
              </div>
            </form>

            <!-- Messages -->
            <div v-if="message" class="mt-4 p-4 rounded-lg" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ message }}
            </div>
          </div>

          <!-- Mes candidatures -->
          <div v-if="myCandidates.length > 0" class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-retro text-dinor-brown mb-4">📋 Mes candidatures</h3>
            <div class="space-y-4">
              <div 
                v-for="candidate in myCandidates" 
                :key="candidate.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center space-x-4">
                  <img 
                    :src="candidate.photo_url" 
                    :alt="`${candidate.prenom} ${candidate.nom}`"
                    class="w-16 h-16 object-cover rounded-lg"
                  />
                  <div class="flex-1">
                    <h4 class="font-semibold text-dinor-brown">{{ candidate.prenom }} {{ candidate.nom }}</h4>
                    <p class="text-sm text-gray-600">{{ candidate.whatsapp }}</p>
                    <div class="flex items-center space-x-4 mt-2">
                      <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(candidate.status)">
                        {{ getStatusText(candidate.status) }}
                      </span>
                      <span class="text-sm text-gray-500">🗳️ {{ candidate.votes_count }} votes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modals d'authentification -->
    <AuthCandidateLoginModal 
      :show="showCandidateLogin" 
      @close="showCandidateLogin = false"
      @success="handleAuthSuccess" 
    />
    <AuthVoterLoginModal 
      :show="showVoterLogin" 
      @close="showVoterLogin = false"
      @success="handleAuthSuccess" 
    />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// État réactif pour les modals
const showCandidateLogin = ref(false)
const showVoterLogin = ref(false)

// État réactif pour le formulaire
const submitting = ref(false)
const selectedFile = ref(null)
const previewUrl = ref('')
const message = ref('')
const messageType = ref('success')
const myCandidates = ref([])

// Formulaire
const form = ref({
  prenom: '',
  nom: '',
  whatsapp: ''
})

// Gérer la sélection de fichier
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Vérifier la taille (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    message.value = 'Le fichier est trop volumineux (max 5MB)'
    messageType.value = 'error'
    return
  }

  // Vérifier le type
  if (!file.type.startsWith('image/')) {
    message.value = 'Veuillez sélectionner une image'
    messageType.value = 'error'
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  message.value = ''
}

// Supprimer le fichier sélectionné
const removeFile = () => {
  selectedFile.value = null
  previewUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Soumettre la photo
const submitPhoto = async () => {
  if (!selectedFile.value) {
    message.value = 'Veuillez sélectionner une photo'
    messageType.value = 'error'
    return
  }

  submitting.value = true
  message.value = ''

  try {
    // Convertir l'image en base64
    const reader = new FileReader()
    reader.onload = async (e) => {
      const photo_data = e.target.result

      // Envoyer la candidature
      const response = await $fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: {
          nom: form.value.nom,
          prenom: form.value.prenom,
          whatsapp: form.value.whatsapp,
          photo_data
        }
      })

      if (response.success) {
        message.value = response.message
        messageType.value = 'success'
        
        // Réinitialiser le formulaire
        form.value = { prenom: '', nom: '', whatsapp: '' }
        removeFile()
        
        // Recharger les candidatures
        loadMyCandidates()
      }
    }
    reader.readAsDataURL(selectedFile.value)

  } catch (error) {
    console.error('Erreur soumission:', error)
    message.value = error.data?.statusMessage || 'Erreur lors de la soumission'
    messageType.value = 'error'
  } finally {
    submitting.value = false
  }
}

// Charger mes candidatures
const loadMyCandidates = async () => {
  if (!user.value) return

  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('email', user.value.email)
      .order('created_at', { ascending: false })

    if (error) throw error
    myCandidates.value = data || []
  } catch (error) {
    console.error('Erreur chargement candidatures:', error)
  }
}

// Obtenir la classe CSS du statut
const getStatusClass = (status) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'rejected': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Obtenir le texte du statut
const getStatusText = (status) => {
  switch (status) {
    case 'approved': return '✅ Approuvé'
    case 'pending': return '⏳ En attente'
    case 'rejected': return '❌ Rejeté'
    default: return '❓ Inconnu'
  }
}

// Gérer le succès d'authentification
const handleAuthSuccess = (message) => {
  // Recharger les candidatures après connexion
  if (user.value) {
    loadMyCandidates()
  }
}

// Charger les données au montage
onMounted(() => {
  if (user.value) {
    loadMyCandidates()
  }
})

// Surveiller les changements d'utilisateur
watch(user, (newUser) => {
  if (newUser) {
    loadMyCandidates()
  } else {
    myCandidates.value = []
  }
})
</script>
