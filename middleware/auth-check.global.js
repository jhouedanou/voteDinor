export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  // Seulement côté client et pas pour les routes API
  if (process.client && !to.path.startsWith('/api/')) {
    try {
      // Forcer la vérification de session
      const { data: sessionData, error } = await supabase.auth.getSession()
      
      if (!error && sessionData?.session) {
        console.log('✅ Session middleware OK:', sessionData.session.user.email)
      } else if (!user.value) {
        console.log('ℹ️ Pas de session active')
      }
    } catch (error) {
      console.warn('Erreur middleware auth:', error)
    }
  }
})