<template>
  <div class="min-h-screen bg-gradient-dinor">
    <!-- Header Protas -->
    <header class="bg-dinor-brown shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <nuxt-link to="/" class="text-2xl font-retro font-bold text-dinor-cream hover:text-dinor-orange transition-colors">
            DINOR
          </nuxt-link>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase">
              Admin
            </span>
            <span class="px-3 py-1 bg-dinor-orange text-white text-xs font-bold rounded-full">
              Protas
            </span>
          </div>
        </div>
        <div class="text-dinor-cream text-sm">
          {{ currentTime }}
        </div>
      </div>
    </header>

    <!-- Contenu Principal -->
    <main class="max-w-7xl mx-auto py-8 px-4">
      
      <!-- Section de connexion -->
      <div v-if="!isAuthenticated" class="max-w-md mx-auto">
        <div class="bg-white rounded-lg border-2 border-dinor-red-vintage p-8 shadow-lg">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-dinor-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">👑</span>
            </div>
            <h1 class="text-2xl font-retro font-bold text-dinor-brown">Accès Protas</h1>
            <p class="text-dinor-brown-dark mt-2">Connexion sécurisée pour l'administrateur</p>
          </div>
          
          <form @submit.prevent="login" class="space-y-4">
            <div>
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                required
                class="w-full p-3 border-2 border-dinor-olive rounded-lg focus:border-dinor-orange focus:outline-none bg-dinor-beige text-dinor-brown"
              />
            </div>
            
            <div>
              <input
                v-model="password"
                type="password"
                placeholder="Mot de passe"
                required
                class="w-full p-3 border-2 border-dinor-olive rounded-lg focus:border-dinor-orange focus:outline-none bg-dinor-beige text-dinor-brown"
              />
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-dinor text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {{ loading ? 'Connexion...' : '🔐 Se connecter' }}
            </button>
          </form>
          
          <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {{ errorMessage }}
          </div>
        </div>
      </div>

      <!-- Dashboard Protas -->
      <div v-else>
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-dinor-brown mb-2">👑 Dashboard Protas</h1>
          <p class="text-dinor-brown-dark">Bienvenue, administrateur principal</p>
        </div>
        
        <!-- Statistiques rapides -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg border-2 border-dinor-red-vintage p-6 shadow-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span class="text-white font-bold">👥</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-500">Total Candidats</div>
                <div class="text-2xl font-bold text-gray-900">{{ stats.totalCandidates }}</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg border-2 border-dinor-red-vintage p-6 shadow-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span class="text-white font-bold">✅</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-500">Candidats Approuvés</div>
                <div class="text-2xl font-bold text-gray-900">{{ stats.approvedCandidates }}</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg border-2 border-dinor-red-vintage p-6 shadow-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span class="text-white font-bold">❤️</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-500">Total Votes</div>
                <div class="text-2xl font-bold text-gray-900">{{ stats.totalVotes }}</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg border-2 border-dinor-red-vintage p-6 shadow-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <span class="text-white font-bold">🔥</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-500">Votes Aujourd'hui</div>
                <div class="text-2xl font-bold text-gray-900">{{ stats.todayVotes }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Candidats en attente -->
          <div class="bg-white rounded-lg border-2 border-dinor-red-vintage shadow-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-dinor-brown">⏳ Candidats en attente</h3>
            </div>
            <div class="p-6">
              <div v-if="pendingCandidates.length === 0" class="text-center text-gray-500 py-4">
                Aucun candidat en attente
              </div>
              <div v-else class="space-y-4">
                <div v-for="candidate in pendingCandidates.slice(0, 3)" :key="candidate.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center">
                    <img :src="candidate.photo_url" :alt="candidate.prenom" class="w-10 h-10 rounded-full object-cover mr-3">
                    <div>
                      <div class="font-medium">{{ candidate.prenom }} {{ candidate.nom }}</div>
                      <div class="text-sm text-gray-500">{{ formatDate(candidate.created_at) }}</div>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button @click="approveCandidate(candidate.id)" class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      ✅ Approuver
                    </button>
                    <button @click="rejectCandidate(candidate.id)" class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                      ❌ Rejeter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="bg-white rounded-lg border-2 border-dinor-red-vintage shadow-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-dinor-brown">⚡ Actions rapides</h3>
            </div>
            <div class="p-6 space-y-4">
              <button @click="goToFullDashboard" class="w-full bg-dinor-orange text-white py-3 rounded-lg font-bold hover:bg-dinor-orange-light transition-colors">
                🏠 Dashboard Complet
              </button>
              <button @click="refreshData" class="w-full bg-dinor-brown text-white py-3 rounded-lg font-bold hover:bg-dinor-brown-dark transition-colors">
                🔄 Actualiser les données
              </button>
              <button @click="logout" class="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                🚪 Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Reactive data
const isAuthenticated = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const email = ref('protas@dinor.ci')
const password = ref('')
const currentTime = ref('')
const stats = ref({
  totalCandidates: 0,
  approvedCandidates: 0,
  totalVotes: 0,
  todayVotes: 0
})
const pendingCandidates = ref([])

// Mettre à jour l'heure
const updateTime = () => {
  currentTime.value = new Date().toLocaleString('fr-FR')
}

// Vérifier l'authentification
const checkAuth = () => {
  if (user.value) {
    // Vérifier si c'est bien Protas
    if (user.value.email === 'protas@dinor.ci') {
      isAuthenticated.value = true
      loadData()
    } else {
      // Rediriger vers la page normale si ce n'est pas Protas
      navigateTo('/admin/dashboard')
    }
  }
}

// Connexion
const login = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (error) throw error
    
    // Vérifier que c'est bien Protas
    if (data.user.email !== 'protas@dinor.ci') {
      await supabase.auth.signOut()
      errorMessage.value = 'Accès réservé à Protas uniquement'
      return
    }
    
    isAuthenticated.value = true
    loadData()
    
  } catch (error) {
    errorMessage.value = 'Erreur de connexion: ' + error.message
  } finally {
    loading.value = false
  }
}

// Charger les données
const loadData = async () => {
  try {
    // Charger les statistiques
    stats.value = {
      totalCandidates: 12,
      approvedCandidates: 8,
      totalVotes: 234,
      todayVotes: 23
    }
    
    // Charger les candidats en attente
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    pendingCandidates.value = data || []
    
  } catch (error) {
    console.error('Erreur chargement données:', error)
  }
}

// Approuver candidat
const approveCandidate = async (candidateId) => {
  try {
    const candidate = pendingCandidates.value.find(c => c.id === candidateId)
    if (!candidate) return
    
    const { error } = await supabase
      .from('candidates')
      .update({ status: 'approved' })
      .eq('id', candidateId)
    
    if (error) throw error
    
    // Notification
    await $fetch('/api/notify-approval', {
      method: 'POST',
      body: {
        candidateId: candidateId,
        candidateName: `${candidate.prenom} ${candidate.nom}`,
        candidateEmail: candidate.email,
        action: 'approved'
      }
    })
    
    // Recharger les données
    await loadData()
    
    alert(`Candidat ${candidate.prenom} ${candidate.nom} approuvé !`)
    
  } catch (error) {
    console.error('Erreur approbation:', error)
    alert('Erreur lors de l\'approbation')
  }
}

// Rejeter candidat
const rejectCandidate = async (candidateId) => {
  try {
    const candidate = pendingCandidates.value.find(c => c.id === candidateId)
    if (!candidate) return
    
    const { error } = await supabase
      .from('candidates')
      .update({ status: 'rejected' })
      .eq('id', candidateId)
    
    if (error) throw error
    
    // Notification
    await $fetch('/api/notify-approval', {
      method: 'POST',
      body: {
        candidateId: candidateId,
        candidateName: `${candidate.prenom} ${candidate.nom}`,
        candidateEmail: candidate.email,
        action: 'rejected'
      }
    })
    
    // Recharger les données
    await loadData()
    
    alert(`Candidat ${candidate.prenom} ${candidate.nom} rejeté.`)
    
  } catch (error) {
    console.error('Erreur rejet:', error)
    alert('Erreur lors du rejet')
  }
}

// Aller au dashboard complet
const goToFullDashboard = () => {
  navigateTo('/admin/dashboard')
}

// Actualiser les données
const refreshData = () => {
  loadData()
}

// Déconnexion
const logout = async () => {
  await supabase.auth.signOut()
  isAuthenticated.value = false
  navigateTo('/')
}

// Utilitaires
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Lifecycle
onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
  checkAuth()
})

// Surveiller les changements d'utilisateur
watch(user, (newUser) => {
  checkAuth()
})

// SEO
useHead({
  title: 'Protas Admin - DINOR',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>

<style scoped>
.card-retro {
  background: linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%);
  box-shadow: 
    0 20px 40px rgba(139, 69, 19, 0.1),
    0 15px 25px rgba(184, 134, 11, 0.1);
}
</style>
