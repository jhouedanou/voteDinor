<template>
  <div class="min-h-screen bg-dinor-cream flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-dinor-orange border-t-transparent mx-auto mb-4"></div>
      <h2 class="text-xl font-retro text-dinor-brown">Finalisation de la connexion...</h2>
      <p class="text-dinor-brown-dark mt-2">Vous allez être redirigé dans quelques instants.</p>
    </div>
  </div>
</template>

<script setup>
// Cette page gère le retour de l'OAuth Google
const supabase = useSupabaseClient()
const router = useRouter()

onMounted(async () => {
  // Attendre un peu pour que l'authentification soit finalisée
  setTimeout(() => {
    router.push('/')
  }, 2000)
})
</script>