<template>
  <div class="min-h-screen bg-gradient-dinor">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-2xl mx-auto">
        <div class="card-retro bg-dinor-cream border-4 border-dinor-red-vintage rounded-3xl p-8 shadow-2xl">
          
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-retro font-bold text-dinor-brown mb-4">🗑️ Suppression de Compte</h1>
            <p class="text-dinor-brown text-lg">Demande de suppression de votre compte DINOR</p>
          </div>

          <!-- Warning Alert -->
          <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-semibold text-red-800">⚠️ Attention - Action Irréversible</h3>
                <p class="text-red-700 mt-2">
                  La suppression de votre compte est définitive et ne peut pas être annulée. Toutes vos données, photos et votes seront définitivement supprimés.
                </p>
              </div>
            </div>
          </div>

          <!-- What will be deleted -->
          <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg mb-8">
            <h3 class="text-lg font-semibold text-yellow-800 mb-3">📋 Ce qui sera supprimé :</h3>
            <ul class="text-yellow-700 space-y-2 list-disc list-inside">
              <li>Votre compte utilisateur et profil</li>
              <li>Toutes vos photos soumises au concours</li>
              <li>Vos votes et participations</li>
              <li>Vos données personnelles</li>
              <li>Votre historique d'activité</li>
            </ul>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitDeletionRequest" class="space-y-6">
            
            <!-- Email confirmation -->
            <div>
              <label for="email" class="block text-sm font-semibold text-dinor-brown mb-2">
                📧 Email de confirmation
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border-2 border-dinor-olive rounded-lg focus:ring-2 focus:ring-dinor-orange focus:border-transparent bg-white text-dinor-brown"
                placeholder="Votre adresse email"
              />
              <p class="text-sm text-dinor-olive mt-1">
                Nous enverrons un email de confirmation à cette adresse
              </p>
            </div>

            <!-- Reason for deletion -->
            <div>
              <label for="reason" class="block text-sm font-semibold text-dinor-brown mb-2">
                🤔 Raison de la suppression (optionnel)
              </label>
              <select
                id="reason"
                v-model="form.reason"
                class="w-full px-4 py-3 border-2 border-dinor-olive rounded-lg focus:ring-2 focus:ring-dinor-orange focus:border-transparent bg-white text-dinor-brown"
              >
                <option value="">Sélectionnez une raison</option>
                <option value="privacy">Protection de la vie privée</option>
                <option value="no-longer-interested">Plus intéressé par le concours</option>
                <option value="technical-issues">Problèmes techniques</option>
                <option value="duplicate-account">Compte en double</option>
                <option value="other">Autre raison</option>
              </select>
            </div>

            <!-- Additional comments -->
            <div>
              <label for="comments" class="block text-sm font-semibold text-dinor-brown mb-2">
                💬 Commentaires supplémentaires (optionnel)
              </label>
              <textarea
                id="comments"
                v-model="form.comments"
                rows="4"
                class="w-full px-4 py-3 border-2 border-dinor-olive rounded-lg focus:ring-2 focus:ring-dinor-orange focus:border-transparent bg-white text-dinor-brown resize-none"
                placeholder="Dites-nous pourquoi vous souhaitez supprimer votre compte..."
              ></textarea>
            </div>

            <!-- Confirmation checkbox -->
            <div class="bg-red-50 p-4 rounded-lg">
              <label class="flex items-start space-x-3">
                <input
                  v-model="form.confirmation"
                  type="checkbox"
                  required
                  class="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-red-300 rounded"
                />
                <span class="text-sm text-red-800">
                  <strong>Je confirme que je souhaite supprimer définitivement mon compte DINOR.</strong>
                  <br>
                  Je comprends que cette action est irréversible et que toutes mes données seront perdues.
                </span>
              </label>
            </div>

            <!-- Submit buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Envoi en cours...' : '🗑️ Demander la suppression' }}
              </button>
              
              <nuxt-link
                to="/"
                class="flex-1 bg-dinor-olive hover:bg-dinor-olive/80 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center"
              >
                🏠 Retour à l'accueil
              </nuxt-link>
            </div>
          </form>

          <!-- Success message -->
          <div v-if="showSuccess" class="mt-8 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-semibold text-green-800">✅ Demande envoyée avec succès</h3>
                <p class="text-green-700 mt-2">
                  Nous avons reçu votre demande de suppression de compte. Vous recevrez un email de confirmation dans les prochaines minutes. 
                  Votre compte sera supprimé dans les 30 jours suivant votre confirmation.
                </p>
              </div>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="mt-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-semibold text-red-800">❌ Erreur</h3>
                <p class="text-red-700 mt-2">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Contact info -->
          <div class="mt-8 pt-6 border-t-2 border-dinor-olive">
            <div class="text-center">
              <p class="text-dinor-brown mb-2">
                <strong>Besoin d'aide ?</strong>
              </p>
              <p class="text-dinor-olive text-sm">
                Contactez-nous à <a href="mailto:contact@dinor-concours.com" class="text-dinor-orange hover:underline">contact@dinor-concours.com</a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Suppression de Compte - DINOR',
  description: 'Demande de suppression de compte pour le concours photo DINOR Flashback Gourmand.'
})

// Reactive form data
const form = ref({
  email: '',
  reason: '',
  comments: '',
  confirmation: false
})

// State management
const isSubmitting = ref(false)
const showSuccess = ref(false)
const error = ref('')

// Submit deletion request
const submitDeletionRequest = async () => {
  if (!form.value.confirmation) {
    error.value = 'Vous devez confirmer la suppression de votre compte.'
    return
  }

  if (!form.value.email) {
    error.value = 'Veuillez saisir votre adresse email.'
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    // Simulate API call - replace with actual implementation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Here you would typically send the data to your backend
    // const response = await $fetch('/api/delete-account-request', {
    //   method: 'POST',
    //   body: form.value
    // })

    showSuccess.value = true
    form.value = {
      email: '',
      reason: '',
      comments: '',
      confirmation: false
    }
  } catch (err) {
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
    console.error('Error submitting deletion request:', err)
  } finally {
    isSubmitting.value = false
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

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #D97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}
</style>
