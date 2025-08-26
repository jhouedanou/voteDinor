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
    
    // Vérifier si l'email existe dans la base
    const { data: user } = await supabase.auth.admin.getUserByEmail(email)
    
    if (!user) {
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      return {
        success: true,
        message: 'Si votre email est dans notre base, vous recevrez un lien de réinitialisation.'
      }
    }
    
    // Générer un token de réinitialisation
    const resetToken = crypto.randomUUID()
    const resetExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    
    // Stocker le token (dans un vrai système, vous stockeriez cela en base)
    // Pour cette démonstration, nous allons utiliser un simple système avec HeroTofu
    
    // Créer le lien de réinitialisation
    const resetLink = `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
    
    // Préparer l'email de réinitialisation
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #FF8C00, #FFB84D); color: white; border-radius: 15px; overflow: hidden;">
        <div style="background: rgba(139, 69, 19, 0.9); padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; color: #FFF8DC;">🔐 Réinitialisation mot de passe</h1>
          <p style="margin: 15px 0; font-size: 18px;">Concours Photo DINOR</p>
        </div>
        
        <div style="background: #FFF8DC; color: #8B4513; padding: 30px;">
          <p style="font-size: 16px; line-height: 1.6;">
            Bonjour,<br><br>
            Vous avez demandé la réinitialisation de votre mot de passe pour votre compte DINOR.
          </p>
          
          <div style="background: #F5DEB3; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #FF8C00;">🔑 Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #FF8C00; color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block;">
              🔄 Réinitialiser mon mot de passe
            </a>
          </div>
          
          <div style="background: #FFE4B5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #8B4513;">
              ⏰ <strong>Ce lien expire dans 30 minutes.</strong><br>
              Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>
          </div>
          
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
            <a href="${resetLink}" style="color: #FF8C00; word-break: break-all;">${resetLink}</a>
          </p>
        </div>
        
        <div style="background: #8B4513; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0; color: #FFF8DC;">DINOR - Redécouvrez les saveurs authentiques des années 60</p>
        </div>
      </div>
    `
    
    // Envoyer l'email via HeroTofu
    const heroToFuEndpoint = 'https://public.herotofu.com/v1/5a33db80-8283-11f0-b600-1fdb6134186f'
    
    const response = await fetch(heroToFuEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: email,
        subject: '🔐 Réinitialisation de votre mot de passe DINOR',
        message: emailContent
      })
    })
    
    if (!response.ok) {
      throw new Error(`HeroTofu error: ${response.statusText}`)
    }
    
    // Stocker temporairement le token (dans un vrai système, utilisez Redis ou la base)
    console.log('Token de réinitialisation généré:', { email, token: resetToken, expiry: resetExpiry })
    
    return {
      success: true,
      message: 'Un email de réinitialisation a été envoyé à votre adresse.'
    }
    
  } catch (error) {
    console.error('Erreur reset password:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'envoi de l\'email de réinitialisation'
    })
  }
})