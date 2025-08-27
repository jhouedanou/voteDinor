import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Vérifier que c'est en mode développement
  if (process.env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Simple auth test only available in development'
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
    console.log('🔍 Simple auth test for:', email)
    
    // Tenter la connexion et capturer l'erreur exacte
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    
    if (error) {
      console.error('❌ Auth error:', error)
      
      // Analyser l'erreur pour donner des conseils
      let advice = []
      
      if (error.message.includes('Invalid login credentials')) {
        advice = [
          'Vérifiez que l\'email est correct',
          'Vérifiez que le mot de passe est correct',
          'Le compte peut ne pas être confirmé'
        ]
      } else if (error.message.includes('Email not confirmed')) {
        advice = [
          'L\'email n\'est pas confirmé',
          'Vérifiez votre boîte email pour le lien de confirmation',
          'Utilisez le bouton "Forcer Confirmation" pour contourner'
        ]
      } else if (error.message.includes('User not found')) {
        advice = [
          'Le compte n\'existe pas',
          'Créez d\'abord un compte',
          'Vérifiez l\'orthographe de l\'email'
        ]
      } else {
        advice = [
          'Erreur inconnue',
          'Vérifiez la configuration Supabase'
        ]
      }
      
      return {
        success: false,
        error: error.message,
        errorCode: error.status || 'unknown',
        advice: advice,
        timestamp: new Date().toISOString()
      }
    }
    
    // Succès
    console.log('✅ Auth successful for:', email)
    
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
        created_at: data.user.created_at,
        last_sign_in_at: data.user.last_sign_in_at
      },
      session: !!data.session,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return {
      success: false,
      error: 'Unexpected error occurred',
      details: error.message,
      timestamp: new Date().toISOString()
    }
  }
})
