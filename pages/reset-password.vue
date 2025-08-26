<template>
  <div class="min-h-screen bg-gradient-dinor flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="card-retro bg-dinor-cream border-4 border-dinor-red-vintage rounded-3xl p-8 shadow-2xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-retro font-bold text-dinor-brown">🔐 Nouveau mot de passe</h1>
          <p class="text-dinor-brown mt-2">Créez votre nouveau mot de passe</p>
        </div>
        
        <!-- Formulaire -->
        <form @submit.prevent="handlePasswordReset" v-if="!success">
          <div class="space-y-4">
            <div>
              <input
                v-model="newPassword"
                type="password"
                placeholder="Nouveau mot de passe"
                required
                minlength="6"
                class="w-full p-4 border-2 border-dinor-olive rounded-lg focus:border-dinor-orange focus:outline-none bg-dinor-beige text-dinor-brown"
              />
            </div>
            
            <div>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirmer le mot de passe"
                required
                minlength="6"
                class="w-full p-4 border-2 border-dinor-olive rounded-lg focus:border-dinor-orange focus:outline-none bg-dinor-beige text-dinor-brown"
              />
            </div>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full mt-6 bg-gradient-dinor text-white py-4 rounded-full font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {{ loading ? 'Mise à jour...' : '🔄 Mettre à jour le mot de passe' }}
          </button>
        </form>
        
        <!-- Message de succès -->
        <div v-if="success" class="text-center">
          <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-dinor-brown mb-4">✅ Mot de passe mis à jour !</h2>
          <p class="text-dinor-brown mb-6">Votre nouveau mot de passe a été enregistré avec succès.</p>
          <button
            @click="$router.push('/')"
            class="bg-gradient-dinor text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300"
          >
            🏠 Retour à l'accueil
          </button>
        </div>
        
        <!-- Messages d'erreur -->
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {{ errorMessage }}
        </div>
        
        <!-- Lien retour -->
        <div class="text-center mt-6">
          <nuxt-link to="/" class="text-dinor-orange hover:text-dinor-brown transition-colors duration-200">
            ← Retour à l'accueil
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Réinitialisation mot de passe - DINOR',
  description: 'Créez votre nouveau mot de passe pour accéder à votre compte DINOR'
})

const route = useRoute()
const supabase = useSupabaseClient()

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const success = ref(false)
const errorMessage = ref('')

const email = route.query.email
const token = route.query.token

// Vérifier si les paramètres sont présents
onMounted(() => {
  if (!email || !token) {
    errorMessage.value = 'Lien de réinitialisation invalide ou expiré.'
  }
})

const handlePasswordReset = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    // Vérifications côté client
    if (newPassword.value.length < 6) {
      errorMessage.value = 'Le mot de passe doit contenir au moins 6 caractères'
      return
    }
    
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'Les mots de passe ne correspondent pas'
      return
    }
    
    // Dans un vrai système, vous vérifieriez le token côté serveur
    // Pour cette démonstration, nous utilisons directement Supabase
    
    // Mettre à jour le mot de passe via Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    })
    
    if (error) {
      errorMessage.value = 'Erreur lors de la mise à jour : ' + error.message
      return
    }
    
    success.value = true
    
  } catch (error) {
    errorMessage.value = 'Erreur technique. Veuillez réessayer.'
    console.error('Erreur reset password:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card-retro {
  background: linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%);
  box-shadow: 
    0 20px 40px rgba(139, 69, 19, 0.1),
    0 15px 25px rgba(184, 134, 11, 0.1);
}
</style>