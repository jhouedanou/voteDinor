import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Vérifier que c'est en mode développement
  if (process.env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Force confirm email only available in development'
    })
  }

  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email required'
    })
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey || config.public.supabaseAnonKey
  )

  try {
    console.log('🔧 Force confirm email for:', email)
    
    // Utiliser la clé service pour accéder aux fonctions admin
    const supabaseAdmin = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceKey
    )
    
    // 1. Récupérer l'utilisateur avec la clé service
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      return {
        error: 'Failed to list users',
        details: listError.message
      }
    }
    
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return {
        error: 'User not found',
        details: 'User does not exist'
      }
    }
    
    // 2. Forcer la confirmation
    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      email_confirm: true
    })
    
    if (error) {
      console.error('❌ Error confirming email:', error)
      return {
        error: 'Failed to confirm email',
        details: error.message
      }
    }
    
    console.log('✅ Email confirmed successfully for:', email)
    
    return {
      success: true,
      message: 'Email confirmed successfully',
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: new Date().toISOString()
      }
    }
    
  } catch (error) {
    console.error('❌ General error:', error)
    return {
      error: 'General error occurred',
      details: error.message
    }
  }
})
