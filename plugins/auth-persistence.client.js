export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  // Forcer la récupération de la session au démarrage
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.warn('Erreur récupération session:', error.message)
    }
    
    if (data?.session) {
      console.log('✅ Session récupérée:', data.session.user.email)
    } else {
      console.log('ℹ️ Aucune session active')
    }
  } catch (error) {
    console.error('Erreur init auth:', error)
  }
  
  // Écouter les changements d'état d'auth
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔄 Auth state change:', event)
    
    if (event === 'SIGNED_IN' && session) {
      console.log('✅ Utilisateur connecté:', session.user.email)
      
      // Vérifier/créer le profil utilisateur
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (error && error.code === 'PGRST116') {
          // Créer le profil s'il n'existe pas
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || '',
              email: session.user.email,
              avatar_url: session.user.user_metadata?.avatar_url || '',
              is_admin: false
            })
          
          if (insertError) {
            console.error('Erreur création profil:', insertError)
          } else {
            console.log('✅ Profil créé')
          }
        }
      } catch (profileError) {
        console.error('Erreur gestion profil:', profileError)
      }
    } else if (event === 'SIGNED_OUT') {
      console.log('👋 Utilisateur déconnecté')
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('🔄 Token rafraîchi')
    }
  })
  
  // Rafraîchir automatiquement la session toutes les 5 minutes
  if (process.client) {
    setInterval(async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (data?.session && !error) {
          console.log('🔄 Session vérifiée')
        }
      } catch (error) {
        console.warn('Erreur vérification session périodique:', error)
      }
    }, 5 * 60 * 1000) // 5 minutes
  }
})