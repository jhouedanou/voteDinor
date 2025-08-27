import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Vérifier que c'est en mode développement
  if (process.env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Debug auth only available in development'
    })
  }

  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password required'
    })
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  try {
    console.log('🔍 Debug auth for:', email)
    
    // 1. Tenter directement la connexion pour voir l'erreur exacte
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    
    if (error) {
      console.error('❌ Login error:', error)
      
      // Analyser le type d'erreur
      if (error.message.includes('Invalid login credentials')) {
        return {
          error: 'Invalid login credentials',
          details: error.message,
          possibleCauses: [
            'Email incorrect',
            'Mot de passe incorrect',
            'Compte non confirmé'
          ]
        }
      } else if (error.message.includes('Email not confirmed')) {
        return {
          error: 'Email not confirmed',
          needsConfirmation: true,
          details: error.message
        }
      } else if (error.message.includes('User not found')) {
        return {
          error: 'User not found',
          userExists: false,
          details: error.message
        }
      } else {
        return {
          error: 'Login failed',
          details: error.message
        }
      }
    }
    
    console.log('✅ Login successful:', {
      user_id: data.user.id,
      email: data.user.email,
      email_confirmed_at: data.user.email_confirmed_at,
      session: !!data.session
    })
    
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
        user_metadata: data.user.user_metadata
      },
      session: !!data.session
    }
    
  } catch (error) {
    console.error('❌ General error:', error)
    return {
      error: 'General error occurred',
      details: error.message
    }
  }
})
