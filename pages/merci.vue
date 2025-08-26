<template>
  <div class="min-h-screen bg-gradient-dinor flex items-center justify-center p-4">
    <div class="max-w-2xl mx-auto text-center">
      <!-- Carte principale -->
      <div class="card-retro bg-dinor-cream border-4 border-dinor-red-vintage rounded-3xl p-12 shadow-2xl">
        <!-- Icône de réussite -->
        <div class="mb-8">
          <div class="w-32 h-32 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        <!-- Titre principal -->
        <h1 class="text-5xl font-retro font-bold text-dinor-brown mb-4">
          Merci !
        </h1>
        
        <!-- Message de remerciement -->
        <div class="text-xl text-dinor-brown mb-8 space-y-4">
          <p class="font-semibold">
            🎉 Votre inscription au concours photo DINOR a été soumise avec succès !
          </p>
          
          <div class="bg-dinor-beige rounded-lg p-6 text-left">
            <h3 class="font-bold text-dinor-red-vintage mb-3">📋 Prochaines étapes :</h3>
            <ul class="space-y-2 text-dinor-brown">
              <li class="flex items-start gap-2">
                <span class="text-dinor-orange font-bold">1.</span>
                <span>Notre équipe va examiner votre candidature</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-dinor-orange font-bold">2.</span>
                <span>Vous recevrez un email de confirmation sous 24-48h</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-dinor-orange font-bold">3.</span>
                <span>Une fois approuvée, votre photo sera visible publiquement</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-dinor-orange font-bold">4.</span>
                <span>Le vote du public commencera immédiatement</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Informations de contact -->
        <div class="bg-dinor-olive bg-opacity-10 rounded-lg p-4 mb-8">
          <p class="text-sm text-dinor-brown">
            <strong>📧 Conseil :</strong> Vérifiez votre boîte mail (et les spams) pour ne rien manquer !
          </p>
        </div>

        <!-- Boutons d'action -->
        <div class="space-y-4">
          <button 
            @click="$router.push('/')"
            class="btn-retro w-full bg-gradient-dinor text-white py-4 px-8 rounded-full font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            🏠 Retour à l'accueil
          </button>
          
          <button 
            @click="$router.push('/classements')"
            class="btn-retro-secondary w-full bg-dinor-beige text-dinor-brown py-4 px-8 rounded-full font-bold border-2 border-dinor-olive hover:bg-dinor-cream transition-all duration-300"
          >
            🏆 Voir les classements
          </button>
        </div>

        <!-- Message d'encouragement -->
        <div class="mt-8 pt-6 border-t-2 border-dinor-beige">
          <p class="text-dinor-brown font-medium text-lg">
            ✨ Bonne chance pour le concours ! ✨
          </p>
          <p class="text-sm text-dinor-brown mt-2">
            Partagez le concours avec vos amis pour maximiser vos votes !
          </p>
        </div>
      </div>

      <!-- Footer décoratif -->
      <div class="mt-8 text-dinor-cream text-opacity-80">
        <p class="text-sm">
          🍽️ DINOR - Redécouvrez les saveurs authentiques des années 60
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Configuration de la page
definePageMeta({
  title: 'Merci pour votre inscription - Concours DINOR',
  description: 'Votre inscription au concours photo vintage DINOR a été soumise avec succès.'
})

// SEO
useHead({
  title: 'Merci ! - Concours Photo DINOR',
  meta: [
    { name: 'description', content: 'Inscription au concours photo vintage DINOR soumise avec succès' },
    { name: 'robots', content: 'noindex, nofollow' } // Page privée
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

.btn-retro {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.btn-retro:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.btn-retro-secondary:hover {
  transform: translateY(-2px);
}
</style>