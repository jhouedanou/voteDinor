<template>
  <div class="min-h-screen bg-dinor-cream py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-retro text-dinor-brown mb-2">Mon Profil</h1>
        <p class="text-dinor-brown-dark">Gérez vos informations personnelles</p>
      </div>

      <!-- Contenu principal -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-dinor-orange border-t-transparent mx-auto mb-4"></div>
          <p class="text-dinor-brown">Chargement du profil...</p>
        </div>

        <div v-else-if="!user" class="text-center py-8">
          <p class="text-dinor-brown mb-4">Vous devez être connecté pour accéder à votre profil.</p>
          <nuxt-link 
            to="/" 
            class="bg-dinor-orange text-white px-6 py-3 rounded-lg hover:bg-dinor-orange-light transition-colors"
          >
            Retour à l'accueil
          </nuxt-link>
        </div>

        <div v-else class="space-y-6">
          <!-- Avatar et informations de base -->
          <div class="flex items-center space-x-6">
            <div class="relative">
              <img 
                :src="profile?.avatar_url || '/default-avatar.png'" 
                :alt="profile?.full_name || 'Avatar'"
                class="w-24 h-24 rounded-full object-cover border-4 border-dinor-beige"
                @error="handleImageError"
              />
              <div class="absolute -bottom-2 -right-2 bg-dinor-orange text-white rounded-full p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h2 class="text-2xl font-retro text-dinor-brown">{{ profile?.full_name || 'Utilisateur' }}</h2>
              <p class="text-dinor-brown-dark">{{ user.email }}</p>
              <p class="text-sm text-gray-500">
                Membre depuis {{ formatDate(user.created_at) }}
              </p>
            </div>
          </div>

          <!-- Formulaire de modification -->
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="fullName" class="block text-sm font-medium text-dinor-brown mb-2">
                  Nom complet
                </label>
                <input
                  id="fullName"
                  v-model="form.full_name"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dinor-orange focus:border-transparent"
                  placeholder="Votre nom complet"
                />
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-dinor-brown mb-2">
                  Email
                </label>
                <input
                  id="email"
                  :value="user.email"
                  type="email"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p class="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
              </div>
            </div>

            <div>
              <label for="avatarUrl" class="block text-sm font-medium text-dinor-brown mb-2">
                URL de l'avatar
              </label>
              <input
                id="avatarUrl"
                v-model="form.avatar_url"
                type="url"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dinor-orange focus:border-transparent"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 bg-dinor-orange text-white px-6 py-3 rounded-lg hover:bg-dinor-orange-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="saving" class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Sauvegarde...
                </span>
                <span v-else>💾 Sauvegarder les modifications</span>
              </button>
              
              <nuxt-link
                to="/"
                class="flex-1 bg-dinor-beige text-dinor-brown px-6 py-3 rounded-lg hover:bg-dinor-cream transition-colors text-center"
              >
                🏠 Retour à l'accueil
              </nuxt-link>
            </div>
          </form>

          <!-- Messages de succès/erreur -->
          <div v-if="message" class="mt-4 p-4 rounded-lg" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ message }}
          </div>
        </div>
      </div>

      <!-- Section actions -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-retro text-dinor-brown mb-4">Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <nuxt-link
            to="/delete-account"
            class="block p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <div class="flex items-center">
              <span class="text-red-600 text-2xl mr-3">🗑️</span>
              <div>
                <h4 class="font-semibold text-red-600">Supprimer mon compte</h4>
                <p class="text-sm text-gray-600">Action irréversible</p>
              </div>
            </div>
          </nuxt-link>
          
          <button
            @click="handleLogout"
            class="block w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center">
              <span class="text-gray-600 text-2xl mr-3">🚪</span>
              <div>
                <h4 class="font-semibold text-gray-700">Se déconnecter</h4>
                <p class="text-sm text-gray-600">Fermer la session</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

// État réactif
const loading = ref(true)
const saving = ref(false)
const profile = ref(null)
const message = ref('')
const messageType = ref('success')

// Formulaire
const form = ref({
  full_name: '',
  avatar_url: ''
})

// Charger le profil utilisateur
const loadProfile = async () => {
  if (!user.value) {
    loading.value = false
    return
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (error) {
      console.error('Erreur chargement profil:', error)
      message.value = 'Erreur lors du chargement du profil'
      messageType.value = 'error'
    } else {
      profile.value = data
      form.value = {
        full_name: data?.full_name || '',
        avatar_url: data?.avatar_url || ''
      }
    }
  } catch (error) {
    console.error('Erreur:', error)
    message.value = 'Erreur lors du chargement du profil'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// Mettre à jour le profil
const updateProfile = async () => {
  if (!user.value) return

  saving.value = true
  message.value = ''

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.value.id,
        full_name: form.value.full_name,
        avatar_url: form.value.avatar_url,
        email: user.value.email,
        updated_at: new Date().toISOString()
      })

    if (error) {
      throw error
    }

    // Recharger le profil
    await loadProfile()
    
    message.value = 'Profil mis à jour avec succès !'
    messageType.value = 'success'
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    console.error('Erreur mise à jour profil:', error)
    message.value = 'Erreur lors de la mise à jour du profil'
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}

// Gérer les erreurs d'image
const handleImageError = (event) => {
  event.target.src = '/default-avatar.png'
}

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Déconnexion
const handleLogout = async () => {
  try {
    await supabase.auth.signOut()
    router.push('/')
  } catch (error) {
    console.error('Erreur déconnexion:', error)
  }
}

// Charger le profil au montage
onMounted(() => {
  loadProfile()
})

// Surveiller les changements d'utilisateur
watch(user, (newUser) => {
  if (newUser) {
    loadProfile()
  } else {
    profile.value = null
    loading.value = false
  }
})
</script>
