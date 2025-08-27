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
const route = useRoute()

onMounted(async () => {
  try {
    // Traiter les paramètres d'authentification
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Erreur lors de la récupération de la session:', error)
      // Rediriger vers l'accueil en cas d'erreur
      router.push('/')
      return
    }
    
    if (data?.session) {
      console.log('Session créée avec succès:', data.session.user.email)
      
      // Vérifier/créer le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single()
      
      if (profileError && profileError.code === 'PGRST116') {
        // Créer le profil s'il n'existe pas
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.session.user.id,
            full_name: data.session.user.user_metadata?.full_name || '',
            email: data.session.user.email,
            avatar_url: data.session.user.user_metadata?.avatar_url || '',
            is_admin: false
          })
        
        if (insertError) {
          console.error('Erreur création profil:', insertError)
        }
      }
      
      // Redirection réussie après 1 seconde
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      console.log('Aucune session trouvée, redirection...')
      router.push('/')
    }
  } catch (error) {
    console.error('Erreur dans callback:', error)
    router.push('/')
  }
})
</script>