<template>
  <div class="min-h-screen bg-dinor-cream flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg border-2 border-dinor-red-vintage p-8 shadow-lg">
        <h1 class="text-2xl font-retro font-bold text-dinor-brown text-center mb-6">
          🔧 Configuration Admin
        </h1>
        
        <div v-if="!user" class="text-center">
          <p class="text-dinor-brown mb-4">Vous devez être connecté pour configurer les admins</p>
          <button 
            @click="showLoginModal = true"
            class="bg-dinor-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-dinor-orange-light transition-colors"
          >
            Se connecter
          </button>
        </div>
        
        <div v-else>
          <div class="mb-6 p-4 bg-dinor-beige rounded-lg">
            <h3 class="font-semibold text-dinor-brown mb-2">Utilisateur connecté :</h3>
            <p class="text-sm text-dinor-brown-dark">{{ user.email }}</p>
            <p class="text-sm text-dinor-brown-dark">ID: {{ user.id }}</p>
          </div>
          
          <div class="mb-6">
            <h3 class="font-semibold text-dinor-brown mb-2">Statut admin actuel :</h3>
            <div v-if="loading" class="text-center py-4">
              <div class="animate-spin rounded-full h-6 w-6 border-2 border-dinor-orange border-t-transparent mx-auto"></div>
            </div>
            <div v-else class="p-3 rounded-lg" :class="isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              <span class="font-semibold">{{ isAdmin ? '✅ Admin' : '❌ Non admin' }}</span>
            </div>
          </div>
          
          <div class="space-y-4">
            <button 
              v-if="!isAdmin"
              @click="makeAdmin"
              :disabled="loading"
              class="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {{ loading ? '⏳' : '👑' }} Devenir Admin
            </button>
            
            <button 
              v-if="isAdmin"
              @click="removeAdmin"
              :disabled="loading"
              class="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {{ loading ? '⏳' : '🚫' }} Retirer Admin
            </button>
            
            <button 
              v-if="isAdmin"
              @click="goToDashboard"
              class="w-full bg-dinor-orange text-white py-3 rounded-lg font-bold hover:bg-dinor-orange-light transition-colors"
            >
              🏠 Aller au Dashboard
            </button>
          </div>
          
          <div v-if="message" class="mt-4 p-3 rounded-lg" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Login Modal -->
    <AuthLoginModal 
      :show="showLoginModal" 
      @close="showLoginModal = false"
      @success="handleAuthSuccess" 
    />
  </div>
</template>

<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const loading = ref(false)
const isAdmin = ref(false)
const message = ref('')
const messageType = ref('success')
const showLoginModal = ref(false)

// Vérifier le statut admin
const checkAdminStatus = async () => {
  if (!user.value) return
  
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.value.id)
      .single()
    
    if (error) throw error
    
    isAdmin.value = data?.is_admin || false
  } catch (error) {
    console.error('Erreur vérification admin:', error)
    message.value = 'Erreur lors de la vérification du statut admin'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// Devenir admin
const makeAdmin = async () => {
  try {
    loading.value = true
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', user.value.id)
    
    if (error) throw error
    
    isAdmin.value = true
    message.value = 'Vous êtes maintenant admin !'
    messageType.value = 'success'
  } catch (error) {
    console.error('Erreur devenir admin:', error)
    message.value = 'Erreur lors de la promotion admin: ' + error.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// Retirer admin
const removeAdmin = async () => {
  try {
    loading.value = true
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: false })
      .eq('id', user.value.id)
    
    if (error) throw error
    
    isAdmin.value = false
    message.value = 'Statut admin retiré'
    messageType.value = 'success'
  } catch (error) {
    console.error('Erreur retirer admin:', error)
    message.value = 'Erreur lors du retrait admin: ' + error.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// Aller au dashboard
const goToDashboard = () => {
  navigateTo('/admin/dashboard')
}

// Gérer la connexion réussie
const handleAuthSuccess = () => {
  showLoginModal.value = false
  checkAdminStatus()
}

// Surveiller les changements d'utilisateur
watch(user, (newUser) => {
  if (newUser) {
    checkAdminStatus()
  } else {
    isAdmin.value = false
  }
})

// Vérifier au montage
onMounted(() => {
  if (user.value) {
    checkAdminStatus()
  }
})

// SEO
useHead({
  title: 'Configuration Admin - DINOR',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>
