// Script pour nettoyer les tokens corrompus
export const clearAuthTokens = () => {
  if (typeof window !== 'undefined') {
    // Supprimer tous les tokens Supabase
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key)
      }
    })
    
    // Supprimer les cookies Supabase
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      if (name.startsWith('sb-')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      }
    })
    
    console.log('🧹 Tokens Supabase nettoyés')
    window.location.reload()
  }
}