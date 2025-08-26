<template>
  <div class="min-h-screen bg-dinor-cream">
    <!-- Header Admin -->
    <header class="bg-dinor-brown shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <nuxt-link to="/" class="text-2xl font-retro font-bold text-dinor-cream hover:text-dinor-orange transition-colors">
            DINOR
          </nuxt-link>
          <span class="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase">
            Admin
          </span>
        </div>
        <AuthUserMenu @openLogin="showLoginModal = true" />
      </div>
    </header>

    <!-- Navigation Admin -->
    <nav class="bg-dinor-beige shadow-sm border-b border-dinor-olive">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex space-x-8">
          <button 
            @click="activeTab = 'overview'"
            :class="activeTab === 'overview' ? 'border-dinor-orange text-dinor-orange' : 'border-transparent text-dinor-brown hover:text-dinor-orange'"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
          >
            📊 Vue d'ensemble
          </button>
          <button 
            @click="activeTab = 'votes'"
            :class="activeTab === 'votes' ? 'border-dinor-orange text-dinor-orange' : 'border-transparent text-dinor-brown hover:text-dinor-orange'"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
          >
            🗳️ Gestion des votes
          </button>
          <button 
            @click="activeTab = 'candidates'"
            :class="activeTab === 'candidates' ? 'border-dinor-orange text-dinor-orange' : 'border-transparent text-dinor-brown hover:text-dinor-orange'"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
          >
            👥 Candidats
          </button>
          <button 
            @click="activeTab = 'analytics'"
            :class="activeTab === 'analytics' ? 'border-dinor-orange text-dinor-orange' : 'border-transparent text-dinor-brown hover:text-dinor-orange'"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
          >
            📈 Analytiques
          </button>
        </div>
      </div>
    </nav>

    <!-- Contenu Principal -->
    <main class="max-w-7xl mx-auto py-8 px-4">
      
      <!-- Vue d'ensemble -->
      <div v-if="activeTab === 'overview'">
        <h1 class="text-3xl font-bold text-dinor-brown mb-8">📊 Tableau de bord Admin</h1>
        
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
                <div class="text-2xl font-bold text-gray-900">{{ adminStats.totalCandidates }}</div>
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
                <div class="text-2xl font-bold text-gray-900">{{ adminStats.approvedCandidates }}</div>
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
                <div class="text-2xl font-bold text-gray-900">{{ adminStats.totalVotes }}</div>
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
                <div class="text-2xl font-bold text-gray-900">{{ adminStats.todayVotes }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          <!-- Votes récents -->
          <div class="bg-white rounded-lg border-2 border-dinor-red-vintage shadow-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-dinor-brown">🕒 Votes récents</h3>
            </div>
            <div class="p-6">
              <div v-if="recentVotes.length === 0" class="text-center text-gray-500 py-4">
                Aucun vote récent
              </div>
              <div v-else class="space-y-3">
                <div v-for="vote in recentVotes.slice(0, 5)" :key="vote.id" class="flex items-center justify-between p-2 border-l-4 border-dinor-orange bg-gray-50">
                  <div class="flex items-center">
                    <div class="text-sm">
                      <span class="font-medium">{{ vote.candidates?.prenom }} {{ vote.candidates?.nom }}</span>
                      <div class="text-gray-500">IP: {{ maskIP(vote.ip_address) }}</div>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatDateTime(vote.created_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gestion des votes -->
      <div v-if="activeTab === 'votes'">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-dinor-brown">🗳️ Gestion des votes</h1>
          <button @click="refreshVotes" :disabled="loading" class="bg-dinor-orange text-white px-4 py-2 rounded-lg hover:bg-dinor-orange-light disabled:opacity-50">
            {{ loading ? '⏳' : '🔄' }} Actualiser
          </button>
        </div>

        <!-- Filtres -->
        <div class="bg-white rounded-lg border-2 border-dinor-red-vintage p-4 mb-6 shadow-lg">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-dinor-brown mb-2">Date</label>
              <input v-model="filters.date" type="date" class="w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-dinor-brown mb-2">Candidat</label>
              <select v-model="filters.candidateId" class="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">Tous les candidats</option>
                <option v-for="candidate in allCandidates" :key="candidate.id" :value="candidate.id">
                  {{ candidate.prenom }} {{ candidate.nom }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-dinor-brown mb-2">IP Address</label>
              <input v-model="filters.ip" type="text" placeholder="192.168..." class="w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            <div class="flex items-end">
              <button @click="applyFilters" class="bg-dinor-brown text-white px-4 py-2 rounded-md hover:bg-dinor-brown-dark">
                🔍 Filtrer
              </button>
            </div>
          </div>
        </div>

        <!-- Table des votes -->
        <div class="bg-white rounded-lg border-2 border-dinor-red-vintage shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-dinor">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Candidat</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">IP Address</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User Agent</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="vote in votes" :key="vote.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDateTime(vote.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img v-if="vote.candidates?.photo_url" :src="vote.candidates.photo_url" :alt="vote.candidates?.prenom" class="w-8 h-8 rounded-full object-cover mr-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ vote.candidates?.prenom }} {{ vote.candidates?.nom }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {{ maskIP(vote.ip_address) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {{ vote.user_agent || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button @click="deleteVote(vote.id)" class="text-red-600 hover:text-red-900">
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="mt-6 flex justify-center">
          <nav class="flex space-x-2">
            <button 
              v-for="page in Array.from({length: pagination.pages}, (_, i) => i + 1)" 
              :key="page"
              @click="currentPage = page; loadVotes()"
              :class="page === currentPage ? 'bg-dinor-orange text-white' : 'bg-white text-dinor-brown border-dinor-olive'"
              class="px-3 py-2 border rounded-md hover:bg-dinor-beige"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </main>

    <!-- Login Modal -->
    <AuthLoginModal 
      :show="showLoginModal" 
      @close="showLoginModal = false"
      @success="handleAuthSuccess" 
    />
  </div>
</template>

<script setup>
// Middleware de sécurité admin
definePageMeta({
  middleware: 'admin'
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Reactive data
const activeTab = ref('overview')
const showLoginModal = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const pendingCandidates = ref([])
const allCandidates = ref([])

const adminStats = ref({
  totalCandidates: 0,
  approvedCandidates: 0,
  totalVotes: 0,
  todayVotes: 0
})

const votes = ref([])
const recentVotes = ref([])

const pagination = ref({
  page: 1,
  limit: 50,
  total: 0,
  pages: 1
})

const filters = ref({
  date: '',
  candidateId: '',
  ip: ''
})

// Methods
const handleAuthSuccess = (message) => {
  // Handle successful authentication
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('fr-FR')
}

const maskIP = (ip) => {
  if (!ip) return 'N/A'
  const parts = ip.split('.')
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.*${parts[3].slice(-1)}`
  }
  return ip.slice(0, 8) + '***'
}

const loadAdminStats = async () => {
  try {
    // Charger les statistiques depuis les APIs
    adminStats.value = {
      totalCandidates: 12,
      approvedCandidates: 8,
      totalVotes: 234,
      todayVotes: 23
    }
  } catch (error) {
    console.error('Erreur chargement stats admin:', error)
  }
}

const loadPendingCandidates = async () => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    pendingCandidates.value = data || []
  } catch (error) {
    console.error('Erreur chargement candidats en attente:', error)
  }
}

const loadAllCandidates = async () => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    allCandidates.value = data || []
  } catch (error) {
    console.error('Erreur chargement tous les candidats:', error)
  }
}

const loadVotes = async () => {
  try {
    loading.value = true
    
    // Simuler des données de votes
    votes.value = [
      {
        id: '1',
        created_at: '2025-01-20T14:30:00Z',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        candidates: {
          prenom: 'Adjoua',
          nom: 'Kouassi',
          photo_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
        }
      },
      {
        id: '2',
        created_at: '2025-01-20T14:25:00Z',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        candidates: {
          prenom: 'Mamadou',
          nom: 'Traore',
          photo_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
        }
      }
    ]
    
    recentVotes.value = votes.value.slice(0, 5)
  } catch (error) {
    console.error('Erreur chargement votes:', error)
  } finally {
    loading.value = false
  }
}

const refreshVotes = () => {
  loadVotes()
}

const applyFilters = () => {
  // Implémenter les filtres
  loadVotes()
}

const approveCandidate = async (candidateId) => {
  try {
    // Trouver le candidat
    const candidate = pendingCandidates.value.find(c => c.id === candidateId)
    if (!candidate) {
      throw new Error('Candidat non trouvé')
    }
    
    // Mettre à jour le statut dans Supabase
    const { error } = await supabase
      .from('candidates')
      .update({ status: 'approved' })
      .eq('id', candidateId)
    
    if (error) throw error
    
    // Envoyer notification d'approbation
    try {
      await $fetch('/api/notify-approval', {
        method: 'POST',
        body: {
          candidateId: candidateId,
          candidateName: `${candidate.prenom} ${candidate.nom}`,
          candidateEmail: candidate.email,
          action: 'approved'
        }
      })
    } catch (emailError) {
      console.error('Erreur notification d\'approbation:', emailError)
      // Ne pas bloquer l'approbation si l'email échoue
    }
    
    // Recharger les données
    await loadAdminStats()
    await loadPendingCandidates()
    
    // Message de succès
    alert(`Candidat ${candidate.prenom} ${candidate.nom} approuvé avec succès !`)
    
  } catch (error) {
    console.error('Erreur approbation candidat:', error)
    alert('Erreur lors de l\'approbation: ' + error.message)
  }
}

const rejectCandidate = async (candidateId) => {
  try {
    // Trouver le candidat
    const candidate = pendingCandidates.value.find(c => c.id === candidateId)
    if (!candidate) {
      throw new Error('Candidat non trouvé')
    }
    
    // Mettre à jour le statut dans Supabase
    const { error } = await supabase
      .from('candidates')
      .update({ status: 'rejected' })
      .eq('id', candidateId)
    
    if (error) throw error
    
    // Envoyer notification de rejet
    try {
      await $fetch('/api/notify-approval', {
        method: 'POST',
        body: {
          candidateId: candidateId,
          candidateName: `${candidate.prenom} ${candidate.nom}`,
          candidateEmail: candidate.email,
          action: 'rejected'
        }
      })
    } catch (emailError) {
      console.error('Erreur notification de rejet:', emailError)
      // Ne pas bloquer le rejet si l'email échoue
    }
    
    // Recharger les données
    await loadAdminStats()
    await loadPendingCandidates()
    
    // Message de succès
    alert(`Candidat ${candidate.prenom} ${candidate.nom} rejeté.`)
    
  } catch (error) {
    console.error('Erreur rejet candidat:', error)
    alert('Erreur lors du rejet: ' + error.message)
  }
}

const deleteVote = async (voteId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce vote ?')) {
    // Implémenter la suppression
    console.log('Supprimer vote:', voteId)
  }
}

// Lifecycle
onMounted(() => {
  loadAdminStats()
  loadVotes()
  loadPendingCandidates()
  loadAllCandidates()
})

// SEO
useHead({
  title: 'Admin Dashboard - Concours Photo Rétro DINOR',
  meta: [
    { name: 'description', content: 'Interface d\'administration pour gérer le concours photo DINOR' }
  ]
})
</script>

<style scoped>
.card-retro {
  background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
}
</style>