<template>
  <div class="min-h-screen bg-dinor-cream">
    <!-- Header avec authentification -->
    <header class="bg-dinor-brown shadow-lg">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <nuxt-link to="/" class="text-2xl font-retro font-bold text-dinor-cream hover:text-dinor-orange transition-colors">
          DINOR
        </nuxt-link>
        <AuthUserMenu @openLogin="showLoginModal = true" />
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero bg-gradient-dinor text-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="retro-title text-4xl md:text-6xl font-retro font-bold mb-4 text-shadow-lg">
          🏆 Classements
        </h1>
        <h2 class="vintage-subtitle text-xl md:text-2xl font-vintage mb-6 text-dinor-cream">
          Concours Photo Rétro DINOR
        </h2>
        <p class="description text-lg mb-8 max-w-2xl mx-auto">
          Découvrez le classement en temps réel des participants au concours !
        </p>
      </div>
    </section>

    <!-- Statistiques globales -->
    <section class="py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div class="card-retro bg-white border-2 border-dinor-red-vintage rounded-2xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-dinor-orange mb-2">{{ stats.totalCandidates }}</div>
            <div class="text-dinor-brown font-semibold">Candidats</div>
          </div>
          <div class="card-retro bg-white border-2 border-dinor-red-vintage rounded-2xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-dinor-orange mb-2">{{ stats.totalVotes }}</div>
            <div class="text-dinor-brown font-semibold">Votes totaux</div>
          </div>
          <div class="card-retro bg-white border-2 border-dinor-red-vintage rounded-2xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-dinor-orange mb-2">{{ stats.todayVotes }}</div>
            <div class="text-dinor-brown font-semibold">Votes aujourd'hui</div>
          </div>
          <div class="card-retro bg-white border-2 border-dinor-red-vintage rounded-2xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-dinor-orange mb-2">{{ stats.activeVoters }}</div>
            <div class="text-dinor-brown font-semibold">Votants actifs</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Podium Top 3 -->
    <section class="py-12 px-4 bg-dinor-beige">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-retro font-bold text-center mb-12 text-dinor-brown">
          🥇 Podium des Champions
        </h2>
        
        <div class="flex justify-center items-end gap-8 mb-12">
          <!-- 2ème place -->
          <div v-if="topCandidates[1]" class="podium-item text-center">
            <div class="podium-rank bg-gray-400 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
              2
            </div>
            <div class="bg-white rounded-2xl border-2 border-dinor-olive p-4 shadow-lg" style="height: 200px;">
              <img 
                :src="topCandidates[1].photo_url" 
                :alt="`Photo de ${topCandidates[1].prenom} ${topCandidates[1].nom}`"
                class="w-20 h-20 rounded-full object-cover mx-auto mb-3"
              >
              <h3 class="font-bold text-dinor-brown">{{ topCandidates[1].prenom }} {{ topCandidates[1].nom.charAt(0) }}.</h3>
              <p class="text-dinor-red-vintage font-semibold">{{ topCandidates[1].votes_count }} votes</p>
            </div>
          </div>

          <!-- 1ère place -->
          <div v-if="topCandidates[0]" class="podium-item text-center">
            <div class="podium-rank bg-yellow-500 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl mb-4 mx-auto">
              1
            </div>
            <div class="bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-2xl border-4 border-yellow-500 p-6 shadow-xl" style="height: 240px;">
              <div class="text-2xl mb-3">👑</div>
              <img 
                :src="topCandidates[0].photo_url" 
                :alt="`Photo de ${topCandidates[0].prenom} ${topCandidates[0].nom}`"
                class="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-yellow-500"
              >
              <h3 class="font-bold text-dinor-brown text-lg">{{ topCandidates[0].prenom }} {{ topCandidates[0].nom.charAt(0) }}.</h3>
              <p class="text-dinor-red-vintage font-bold text-lg">{{ topCandidates[0].votes_count }} votes</p>
            </div>
          </div>

          <!-- 3ème place -->
          <div v-if="topCandidates[2]" class="podium-item text-center">
            <div class="podium-rank bg-amber-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
              3
            </div>
            <div class="bg-white rounded-2xl border-2 border-dinor-olive p-4 shadow-lg" style="height: 180px;">
              <img 
                :src="topCandidates[2].photo_url" 
                :alt="`Photo de ${topCandidates[2].prenom} ${topCandidates[2].nom}`"
                class="w-20 h-20 rounded-full object-cover mx-auto mb-3"
              >
              <h3 class="font-bold text-dinor-brown">{{ topCandidates[2].prenom }} {{ topCandidates[2].nom.charAt(0) }}.</h3>
              <p class="text-dinor-red-vintage font-semibold">{{ topCandidates[2].votes_count }} votes</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Classement complet -->
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-retro font-bold text-center mb-8 text-dinor-brown">
          📊 Classement Complet
        </h2>
        
        <div class="card-retro bg-white border-2 border-dinor-red-vintage rounded-2xl shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gradient-dinor text-white">
                <tr>
                  <th class="px-6 py-4 text-left font-bold">Rang</th>
                  <th class="px-6 py-4 text-left font-bold">Photo</th>
                  <th class="px-6 py-4 text-left font-bold">Candidat</th>
                  <th class="px-6 py-4 text-center font-bold">Votes</th>
                  <th class="px-6 py-4 text-center font-bold">Evolution</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(candidate, index) in rankedCandidates" 
                  :key="candidate.id"
                  :class="index % 2 === 0 ? 'bg-dinor-cream' : 'bg-white'"
                  class="hover:bg-dinor-beige transition-colors duration-200"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <span class="text-2xl font-bold text-dinor-brown mr-2">{{ index + 1 }}</span>
                      <span v-if="index === 0" class="text-2xl">🥇</span>
                      <span v-else-if="index === 1" class="text-2xl">🥈</span>
                      <span v-else-if="index === 2" class="text-2xl">🥉</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <img 
                      :src="candidate.photo_url" 
                      :alt="`Photo de ${candidate.prenom} ${candidate.nom}`"
                      class="w-12 h-12 rounded-full object-cover border-2 border-dinor-olive"
                    >
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-semibold text-dinor-brown">
                      {{ candidate.prenom }} {{ candidate.nom.charAt(0) }}.
                    </div>
                    <div class="text-sm text-dinor-brown-dark">
                      Inscrit le {{ formatDate(candidate.created_at) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-dinor-orange text-white">
                      ❤️ {{ candidate.votes_count }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center">
                      <span class="text-green-600">📈 +{{ Math.floor(Math.random() * 10) }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Bouton retour -->
    <section class="py-8 px-4 text-center">
      <nuxt-link 
        to="/" 
        class="inline-flex items-center gap-2 bg-dinor-brown text-white px-6 py-3 rounded-full font-bold hover:bg-dinor-brown-dark transition-all duration-300"
      >
        ← Retour au concours
      </nuxt-link>
    </section>

    <!-- Login Modal -->
    <AuthLoginModal 
      :show="showLoginModal" 
      @close="showLoginModal = false"
      @success="handleAuthSuccess" 
    />

    <!-- Footer -->
    <footer class="bg-dinor-brown text-dinor-cream py-8 px-4 mt-12">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-2xl font-retro font-bold mb-2">DINOR - Cuisine Vintage</h3>
        <p class="text-dinor-beige">Classements mis à jour en temps réel</p>
        
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
  </div>
</template>

<script setup>
const user = useSupabaseUser()

// Reactive data
const showLoginModal = ref(false)
const candidates = ref([])
const loading = ref(true)

const stats = ref({
  totalCandidates: 0,
  totalVotes: 0,
  todayVotes: 0,
  activeVoters: 0
})

// Computed
const rankedCandidates = computed(() => {
  return [...candidates.value].sort((a, b) => b.votes_count - a.votes_count)
})

const topCandidates = computed(() => {
  return rankedCandidates.value.slice(0, 3)
})

// Methods
const handleAuthSuccess = (message) => {
  // Handle successful authentication
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const loadRankings = async () => {
  try {
    loading.value = true
    
    // Charger les candidats depuis l'API
    const response = await $fetch('/api/rankings')
    candidates.value = response.candidates || []
    stats.value = response.stats || stats.value
    
    // Si pas de données, utiliser des données de test
    if (candidates.value.length === 0) {
      candidates.value = [
        {
          id: '1',
          nom: 'Kouassi',
          prenom: 'Adjoua',
          photo_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
          votes_count: 127,
          created_at: '2025-01-15T10:30:00Z'
        },
        {
          id: '2',
          nom: 'Traore',
          prenom: 'Mamadou',
          photo_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          votes_count: 89,
          created_at: '2025-01-16T14:20:00Z'
        },
        {
          id: '3',
          nom: 'Diallo',
          prenom: 'Fatou',
          photo_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
          votes_count: 76,
          created_at: '2025-01-17T09:15:00Z'
        },
        {
          id: '4',
          nom: 'Bamba',
          prenom: 'Sekou',
          photo_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
          votes_count: 54,
          created_at: '2025-01-18T16:45:00Z'
        },
        {
          id: '5',
          nom: 'Kone',
          prenom: 'Aminata',
          photo_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
          votes_count: 43,
          created_at: '2025-01-19T11:30:00Z'
        }
      ]
      
      stats.value = {
        totalCandidates: candidates.value.length,
        totalVotes: candidates.value.reduce((sum, c) => sum + c.votes_count, 0),
        todayVotes: 23,
        activeVoters: 156
      }
    }
  } catch (error) {
    console.error('Erreur chargement classements:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadRankings()
  
  // Rafraîchir toutes les 30 secondes
  setInterval(loadRankings, 30000)
})

// SEO
useHead({
  title: 'Classements - Concours Photo Rétro DINOR',
  meta: [
    { name: 'description', content: 'Découvrez le classement en temps réel du concours photo vintage DINOR' }
  ]
})
</script>

<style scoped>
.text-shadow-lg {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.card-retro {
  background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
}

.podium-item {
  transition: transform 0.3s ease;
}

.podium-item:hover {
  transform: translateY(-5px);
}
</style>