export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { candidateId, candidateName, candidateEmail, action } = body // action: 'approved' ou 'rejected'
    
    // Validation des données
    if (!candidateId || !candidateName || !candidateEmail || !action) {
      throw new Error('Données manquantes pour la notification')
    }
    
    // Option pour désactiver temporairement l'envoi d'email
    const disableEmail = process.env.DISABLE_EMAIL === 'true'
    if (disableEmail) {
      console.log('Notification d\'approbation simulée:', { candidateName, action })
      return {
        success: true,
        message: 'Notification simulée (service désactivé)'
      }
    }
    
    const heroToFuEndpoint = 'https://public.herotofu.com/v1/5a33db80-8283-11f0-b600-1fdb6134186f'
    
    let subject = ''
    let message = ''
    
    if (action === 'approved') {
      subject = '🎉 Votre candidature DINOR a été approuvée !'
      message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #FF8C00, #FFB84D); color: white; border-radius: 15px; overflow: hidden;">
          <div style="background: rgba(139, 69, 19, 0.9); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; color: #FFF8DC;">🎉 Félicitations ${candidateName} !</h1>
            <p style="margin: 15px 0; font-size: 18px;">Votre candidature au concours DINOR a été approuvée</p>
          </div>
          
          <div style="background: #FFF8DC; color: #8B4513; padding: 30px;">
            <h2 style="color: #FF8C00; font-size: 22px;">Votre photo est maintenant en ligne !</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Votre photo vintage de cuisine est maintenant visible sur le site et peut recevoir des votes.
            </p>
            
            <div style="background: #F5DEB3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #8B4513; margin-top: 0;">📊 Prochaines étapes</h3>
              <ul style="color: #8B4513; font-size: 14px;">
                <li>✨ Partagez votre candidature sur les réseaux sociaux</li>
                <li>🗳️ Encouragez vos amis à voter pour vous</li>
                <li>📈 Suivez votre progression dans les classements</li>
                <li>🏆 Tentez de remporter le concours !</li>
              </ul>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/classements" 
                 style="background: #FF8C00; color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold;">
                🏆 Voir les classements
              </a>
            </p>
          </div>
          
          <div style="background: #8B4513; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0; color: #FFF8DC;">DINOR - Redécouvrez les saveurs authentiques des années 60</p>
          </div>
        </div>
      `
    } else if (action === 'rejected') {
      subject = 'Information sur votre candidature DINOR'
      message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #FF8C00, #FFB84D); color: white; border-radius: 15px; overflow: hidden;">
          <div style="background: rgba(139, 69, 19, 0.9); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; color: #FFF8DC;">Bonjour ${candidateName}</h1>
            <p style="margin: 15px 0; font-size: 18px;">Concernant votre candidature au concours DINOR</p>
          </div>
          
          <div style="background: #FFF8DC; color: #8B4513; padding: 30px;">
            <h2 style="color: #FF8C00; font-size: 22px;">Votre candidature nécessite des ajustements</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Après examen de votre candidature, nous avons constaté qu'elle ne respecte pas certains critères du concours.
            </p>
            
            <div style="background: #F5DEB3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #8B4513; margin-top: 0;">📋 Critères du concours</h3>
              <ul style="color: #8B4513; font-size: 14px;">
                <li>📸 Photo de cuisine vintage des années 60</li>
                <li>🍳 Équipements ou ustensiles d'époque</li>
                <li>🎨 Ambiance rétro authentique</li>
                <li>📱 Qualité d'image suffisante</li>
              </ul>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" 
                 style="background: #FF8C00; color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold;">
                🔄 Nouvelle candidature
              </a>
            </p>
          </div>
          
          <div style="background: #8B4513; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0; color: #FFF8DC;">DINOR - Redécouvrez les saveurs authentiques des années 60</p>
          </div>
        </div>
      `
    }
    
    // Envoyer l'email via HeroTofu
    const emailData = {
      to: candidateEmail,
      subject: subject,
      message: message
    }
    
    console.log('Notification d\'approbation HeroTofu:', { candidateName, action, candidateEmail })
    
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
      console.log('Réponse HeroTofu notification:', response.status, responseText)
      
      if (!response.ok) {
        console.error('Erreur HeroTofu notification:', {
          status: response.status,
          statusText: response.statusText,
          responseText,
          emailData
        })
        
        if (response.status === 422) {
          throw new Error(`Format d'email invalide pour HeroTofu: ${responseText}`)
        }
        
        throw new Error(`HeroTofu error: ${response.status} ${response.statusText} - ${responseText}`)
      }
    } catch (fetchError: any) {
      console.error('Erreur fetch HeroTofu notification:', fetchError)
      throw new Error(`Erreur réseau HeroTofu: ${fetchError.message || 'Erreur inconnue'}`)
    }
    
    return {
      success: true,
      message: `Notification ${action} envoyée avec succès`
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur notification: ${error.message || 'Erreur inconnue'}`
    })
  }
})
