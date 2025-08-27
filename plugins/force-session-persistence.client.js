export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()
  
  if (process.client) {
    // Forcer la persistence en localStorage même en production
    const originalAuth = supabase.auth
    
    // Override pour forcer le localStorage
    Object.defineProperty(supabase.auth, '_storage', {
      get() {
        return {
          getItem: (key) => {
            try {
              return localStorage.getItem(key)
            } catch (e) {
              return null
            }
          },
          setItem: (key, value) => {
            try {
              localStorage.setItem(key, value)
              // Aussi sauver dans sessionStorage comme backup
              sessionStorage.setItem(key, value)
            } catch (e) {
              console.warn('Erreur sauvegarde session:', e)
            }
          },
          removeItem: (key) => {
            try {
              localStorage.removeItem(key)
              sessionStorage.removeItem(key)
            } catch (e) {
              console.warn('Erreur suppression session:', e)
            }
          }
        }
      }
    })
    
    // Vérifier et restaurer la session au chargement
    const checkAndRestoreSession = async () => {
      try {
        // Chercher dans localStorage
        const storedSession = localStorage.getItem(`sb-${supabase.supabaseUrl.split('://')[1].split('.')[0]}-auth-token`)
        
        if (storedSession) {
          console.log('🔄 Session trouvée dans localStorage')
          const sessionData = JSON.parse(storedSession)
          
          if (sessionData.access_token && sessionData.expires_at) {
            const now = Math.floor(Date.now() / 1000)
            
            if (sessionData.expires_at > now) {
              console.log('✅ Session valide, tentative de restauration')
              
              // Forcer la session
              await supabase.auth.setSession({
                access_token: sessionData.access_token,
                refresh_token: sessionData.refresh_token
              })
            } else {
              console.log('⏰ Session expirée, tentative de refresh')
              if (sessionData.refresh_token) {
                await supabase.auth.refreshSession({
                  refresh_token: sessionData.refresh_token
                })
              }
            }
          }
        }
      } catch (error) {
        console.warn('Erreur restauration session:', error)
      }
    }
    
    // Restaurer au chargement
    checkAndRestoreSession()
    
    // Écouter les changements et forcer la sauvegarde
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth change:', event, session?.user?.email)
      
      if (session) {
        // Forcer la sauvegarde dans localStorage
        const storageKey = `sb-${supabase.supabaseUrl.split('://')[1].split('.')[0]}-auth-token`
        const sessionData = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at || Math.floor(Date.now() / 1000) + 3600,
          user: session.user
        }
        
        try {
          localStorage.setItem(storageKey, JSON.stringify(sessionData))
          sessionStorage.setItem(storageKey, JSON.stringify(sessionData))
          console.log('✅ Session sauvée dans storage')
        } catch (e) {
          console.warn('Erreur sauvegarde:', e)
        }
      }
    })
    
    // Vérifier périodiquement la session
    setInterval(() => {
      checkAndRestoreSession()
    }, 2 * 60 * 1000) // Toutes les 2 minutes
  }
})