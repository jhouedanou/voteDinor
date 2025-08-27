<template>
  <div v-if="isDev" class="fixed bottom-4 left-4 bg-blue-100 border-2 border-blue-400 rounded-lg p-4 shadow-lg z-50 max-w-sm">
    <h3 class="font-bold text-blue-800 mb-2">🔧 Debug Auth (DEV)</h3>
    
    <div class="space-y-2">
      <input
        v-model="debugEmail"
        type="email"
        placeholder="Email à tester"
        class="w-full px-2 py-1 text-sm border border-blue-300 rounded"
      />
      <input
        v-model="debugPassword"
        type="password"
        placeholder="Mot de passe"
        class="w-full px-2 py-1 text-sm border border-blue-300 rounded"
      />
      
      <div class="flex flex-col gap-1">
        <button 
          @click="testAuth"
          :disabled="testing"
          class="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
        >
          {{ testing ? 'Test...' : '🔍 Tester Auth' }}
        </button>
        
        <button 
          @click="forceConfirm"
          :disabled="confirming"
          class="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 disabled:opacity-50"
        >
          {{ confirming ? 'Confirmation...' : '✅ Forcer Confirmation' }}
        </button>
        
        <button 
          @click="sendReset"
          :disabled="resetting"
          class="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 disabled:opacity-50"
        >
          {{ resetting ? 'Envoi...' : '🔑 Envoyer Reset' }}
        </button>
      </div>
    </div>
    
    <div v-if="debugResult" class="mt-2 p-2 bg-white rounded text-xs">
      <pre class="whitespace-pre-wrap">{{ debugResult }}</pre>
    </div>
  </div>
</template>

<script setup>
const isDev = process.env.NODE_ENV === 'development'

const debugEmail = ref('jeanluc@bigfiveabidjan')
const debugPassword = ref('houedanou')
const testing = ref(false)
const confirming = ref(false)
const resetting = ref(false)
const debugResult = ref('')

// Tester l'authentification
const testAuth = async () => {
  if (!debugEmail.value || !debugPassword.value) {
    debugResult.value = '❌ Veuillez remplir email et mot de passe'
    return
  }
  
  testing.value = true
  debugResult.value = ''
  
  try {
    const result = await $fetch('/api/simple-auth-test', {
      method: 'POST',
      body: {
        email: debugEmail.value,
        password: debugPassword.value
      }
    })
    
    debugResult.value = JSON.stringify(result, null, 2)
  } catch (error) {
    debugResult.value = `❌ Erreur: ${error.message}`
  } finally {
    testing.value = false
  }
}

// Forcer la confirmation d'email
const forceConfirm = async () => {
  if (!debugEmail.value) {
    debugResult.value = '❌ Veuillez remplir l\'email'
    return
  }
  
  confirming.value = true
  debugResult.value = ''
  
  try {
    const result = await $fetch('/api/force-confirm-email', {
      method: 'POST',
      body: {
        email: debugEmail.value
      }
    })
    
    debugResult.value = JSON.stringify(result, null, 2)
  } catch (error) {
    debugResult.value = `❌ Erreur: ${error.message}`
  } finally {
    confirming.value = false
  }
}

// Envoyer un email de réinitialisation
const sendReset = async () => {
  if (!debugEmail.value) {
    debugResult.value = '❌ Veuillez remplir l\'email'
    return
  }
  
  resetting.value = true
  debugResult.value = ''
  
  try {
    const result = await $fetch('/api/reset-password-debug', {
      method: 'POST',
      body: {
        email: debugEmail.value
      }
    })
    
    debugResult.value = JSON.stringify(result, null, 2)
  } catch (error) {
    debugResult.value = `❌ Erreur: ${error.message}`
  } finally {
    resetting.value = false
  }
}
</script>
