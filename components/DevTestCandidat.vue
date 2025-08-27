<template>
  <div v-if="isDev" class="fixed bottom-4 right-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 shadow-lg z-50">
    <h3 class="font-bold text-yellow-800 mb-2">🧪 Test Candidat (DEV)</h3>
    <div class="space-y-2">
      <button 
        @click="createTestCandidate"
        :disabled="creating"
        class="w-full bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
      >
        {{ creating ? 'Création...' : 'Créer candidat test' }}
      </button>
      <button 
        @click="loginTestCandidate"
        :disabled="logging"
        class="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
      >
        {{ logging ? 'Connexion...' : 'Se connecter' }}
      </button>
      <button 
        @click="clearTestData"
        class="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
      >
        🗑️ Nettoyer
      </button>
    </div>
    <div v-if="message" class="mt-2 text-xs" :class="messageType === 'success' ? 'text-green-700' : 'text-red-700'">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const isDev = process.env.NODE_ENV === 'development'

const creating = ref(false)
const logging = ref(false)
const message = ref('')
const messageType = ref('success')

// Créer un candidat de test
const createTestCandidate = async () => {
  creating.value = true
  message.value = ''
  
  try {
    const testEmail = `test.candidat.${Date.now()}@example.com`
    const testPassword = 'test123456'
    
    const { error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'Candidat',
          full_name: 'Test Candidat',
          user_type: 'candidate'
        }
      }
    })
    
    if (error) throw error
    
    // Sauvegarder les credentials de test
    localStorage.setItem('testCandidateEmail', testEmail)
    localStorage.setItem('testCandidatePassword', testPassword)
    
    message.value = `✅ Candidat créé : ${testEmail}`
    messageType.value = 'success'
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Erreur création candidat test:', error)
    message.value = `❌ Erreur : ${error.message}`
    messageType.value = 'error'
  } finally {
    creating.value = false
  }
}

// Se connecter avec le candidat de test
const loginTestCandidate = async () => {
  logging.value = true
  message.value = ''
  
  try {
    const testEmail = localStorage.getItem('testCandidateEmail')
    const testPassword = localStorage.getItem('testCandidatePassword')
    
    if (!testEmail || !testPassword) {
      throw new Error('Aucun candidat de test trouvé. Créez-en un d\'abord.')
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })
    
    if (error) throw error
    
    message.value = '✅ Connexion réussie !'
    messageType.value = 'success'
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Erreur connexion candidat test:', error)
    message.value = `❌ Erreur : ${error.message}`
    messageType.value = 'error'
  } finally {
    logging.value = false
  }
}

// Nettoyer les données de test
const clearTestData = () => {
  localStorage.removeItem('testCandidateEmail')
  localStorage.removeItem('testCandidatePassword')
  message.value = '🧹 Données de test nettoyées'
  messageType.value = 'success'
  
  setTimeout(() => {
    message.value = ''
  }, 2000)
}
</script>
