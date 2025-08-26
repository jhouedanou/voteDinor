import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
    
    const { email } = await readBody(event)
    
    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email requis'
      })
    }
    
    // Option pour désactiver temporairement l'envoi d'email
    const disableEmail = process.env.DISABLE_EMAIL === 'true'
    if (disableEmail) {
      console.log('Reset password simulé pour:', email)
      return {
        success: true,
        message: 'Email de réinitialisation simulé (service désactivé)'
      }
    }
    
    // Utiliser la fonction native de Supabase pour la réinitialisation
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`
    })
    
    if (error) {
      console.error('Erreur reset password Supabase:', error)
      // Ne pas révéler l'erreur pour des raisons de sécurité
      return {
        success: true,
        message: 'Si votre email est dans notre base, vous recevrez un lien de réinitialisation.'
      }
    }
    
    console.log('Reset password envoyé avec succès pour:', email)
    
    return {
      success: true,
      message: 'Un email de réinitialisation a été envoyé à votre adresse.'
    }
    
  } catch (error: any) {
    console.error('Erreur reset password:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'envoi de l\'email de réinitialisation'
    })
  }
})
