export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { type, email, name, candidateName } = body
    
    // Validation des données
    if (!email || !type) {
      throw new Error('Email et type sont requis')
    }
    
    // Option pour désactiver temporairement l'envoi d'email
    const disableEmail = process.env.DISABLE_EMAIL === 'true'
    if (disableEmail) {
      console.log('Envoi d\'email désactivé, simulation réussie')
      return {
        success: true,
        message: 'Email simulé (service désactivé)'
      }
    }
    
    const heroToFuEndpoint = 'https://public.herotofu.com/v1/5a33db80-8283-11f0-b600-1fdb6134186f'
    
    let subject = ''
    let message = ''
    
    if (type === 'account_creation') {
      subject = 'Bienvenue au concours photo DINOR !'
      message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #FF8C00, #FFB84D); color: white; border-radius: 15px; overflow: hidden;">
          <div style="background: rgba(139, 69, 19, 0.9); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; color: #FFF8DC;">🎉 Bienvenue ${name} !</h1>
            <p style="margin: 15px 0; font-size: 18px;">Votre compte DINOR a été créé avec succès</p>
          </div>
          
          <div style="background: #FFF8DC; color: #8B4513; padding: 30px;">
            <h2 style="color: #FF8C00; font-size: 22px;">Concours Photo Vintage DINOR</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Félicitations ! Vous pouvez maintenant participer à notre concours photo vintage des années 60.
            </p>
            
            <div style="background: #F5DEB3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #8B4513; margin-top: 0;">🍽️ Que pouvez-vous faire ?</h3>
              <ul style="color: #8B4513; font-size: 14px;">
                <li>✨ Inscrire vos photos vintage de cuisine</li>
                <li>🗳️ Voter pour vos candidats préférés</li>
                <li>📊 Suivre les classements en temps réel</li>
                <li>📱 Partager sur les réseaux sociaux</li>
              </ul>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" 
                 style="background: #FF8C00; color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold;">
                🏠 Aller au concours
              </a>
            </p>
          </div>
          
          <div style="background: #8B4513; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0; color: #FFF8DC;">DINOR - Redécouvrez les saveurs authentiques des années 60</p>
          </div>
        </div>
      `
    } else if (type === 'candidate_registration') {
      subject = 'Nouvelle inscription candidat - Concours DINOR'
      message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF8C00;">📸 Nouvelle inscription au concours</h2>
          <p><strong>Candidat :</strong> ${candidateName}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Statut :</strong> En attente de validation</p>
          
          <div style="background: #FFF8DC; padding: 20px; border-radius: 10px; border-left: 4px solid #FF8C00;">
            <p><strong>Action requise :</strong> Connectez-vous au dashboard admin pour approuver ou rejeter cette candidature.</p>
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/dashboard" 
               style="background: #FF8C00; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
              Aller au dashboard admin
            </a>
          </p>
        </div>
      `
    }
    
    // Envoyer l'email via HeroTofu
    const emailData = {
      to: email,
      subject: subject,
      message: message
    }
    
    console.log('Envoi email HeroTofu:', { type, email, subject })
    
    try {
      const response = await fetch(heroToFuEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailData)
      })
      
      const responseText = await response.text()
      console.log('Réponse HeroTofu:', response.status, responseText)
      
      if (!response.ok) {
        // Log détaillé pour diagnostiquer
        console.error('Erreur HeroTofu détaillée:', {
          status: response.status,
          statusText: response.statusText,
          responseText,
          emailData
        })
        
        // Si c'est une erreur 422, c'est probablement un problème de format
        if (response.status === 422) {
          throw new Error(`Format d'email invalide pour HeroTofu: ${responseText}`)
        }
        
        throw new Error(`HeroTofu error: ${response.status} ${response.statusText} - ${responseText}`)
      }
    } catch (fetchError: any) {
      console.error('Erreur fetch HeroTofu:', fetchError)
      throw new Error(`Erreur réseau HeroTofu: ${fetchError.message || 'Erreur inconnue'}`)
    }
    
    return {
      success: true,
      message: 'Email envoyé avec succès'
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur envoi email: ${error.message || 'Erreur inconnue'}`
    })
  }
})