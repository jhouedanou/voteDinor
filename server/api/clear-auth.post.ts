import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Only in development
  if (process.env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Endpoint disponible uniquement en développement'
    })
  }

  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl, 
    config.supabaseServiceKey || config.public.supabaseAnonKey
  )

  try {
    // Force sign out all sessions
    await supabase.auth.signOut()
    
    return { 
      success: true, 
      message: 'Sessions nettoyées côté serveur' 
    }
    
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    }
  }
})