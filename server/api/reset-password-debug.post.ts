import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Vérifier que c'est en mode développement
  if (process.env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Reset password debug only available in development'
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
    config.public.supabaseAnonKey
  )

  try {
    console.log('🔑 Send reset password for:', email)
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${config.public.siteUrl}/reset-password`
    })
    
    if (error) {
      console.error('❌ Error sending reset password:', error)
      return {
        error: 'Failed to send reset password email',
        details: error.message
      }
    }
    
    console.log('✅ Reset password email sent successfully to:', email)
    
    return {
      success: true,
      message: 'Reset password email sent successfully',
      email: email
    }
    
  } catch (error) {
    console.error('❌ General error:', error)
    return {
      error: 'General error occurred',
      details: error.message
    }
  }
})
