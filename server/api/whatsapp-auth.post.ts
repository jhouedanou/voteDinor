import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { nom, prenom, whatsapp, photo_data } = body

  if (!nom || !prenom || !whatsapp) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nom, prénom et WhatsApp requis'
    })
  }

  // Valider le format WhatsApp ivoirien
  if (!whatsapp.startsWith('+225') || whatsapp.length !== 12) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Format WhatsApp invalide. Utilisez: +22501234567'
    })
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey || config.public.supabaseAnonKey
  )

  try {
    // 1. Vérifier si le candidat existe déjà
    const { data: existingCandidate } = await supabase
      .from('candidates')
      .select('*')
      .eq('whatsapp', whatsapp)
      .single()

    if (existingCandidate) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Ce numéro WhatsApp est déjà inscrit'
      })
    }

    // 2. Upload de la photo si fournie
    let photo_url = ''
    let photo_filename = ''
    
    if (photo_data) {
      try {
        if (config.supabaseStorageEndpoint && config.supabaseStorageAccessKey) {
          const uploadResponse = await $fetch('/api/upload-photo-supabase', {
            method: 'POST',
            body: {
              photo_data,
              filename: `${prenom}_${nom}_${Date.now()}`
            }
          })
          
          if (uploadResponse.success) {
            photo_url = uploadResponse.url
            photo_filename = uploadResponse.filename
          }
        } else {
          // Fallback : Stocker en base64 temporairement
          photo_url = photo_data
          photo_filename = `temp_${Date.now()}`
        }
      } catch (uploadError) {
        console.error('Erreur upload:', uploadError)
        photo_url = photo_data
        photo_filename = `fallback_${Date.now()}`
      }
    }

    // 3. Créer le candidat
    const { data: candidate, error } = await supabase
      .from('candidates')
      .insert({
        nom: nom.trim(),
        prenom: prenom.trim(),
        whatsapp: whatsapp.trim(),
        photo_url,
        description: `Candidat ${prenom} ${nom}`,
        votes_count: 0,
        status: 'pending',
        auth_method: 'whatsapp',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // 4. Envoyer un message WhatsApp de confirmation (optionnel)
    try {
      await sendWhatsAppConfirmation(whatsapp, prenom, nom)
    } catch (whatsappError) {
      console.error('Erreur envoi WhatsApp:', whatsappError)
      // Ne pas bloquer l'inscription si WhatsApp échoue
    }

    return {
      success: true,
      id: candidate.id,
      message: 'Inscription réussie ! Votre candidature sera validée sous 24h.',
      candidate: {
        id: candidate.id,
        nom: candidate.nom,
        prenom: candidate.prenom,
        whatsapp: candidate.whatsapp,
        status: candidate.status
      }
    }

  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de l\'inscription: ' + error.message
    })
  }
})

// Fonction pour envoyer un message WhatsApp de confirmation
async function sendWhatsAppConfirmation(whatsapp: string, prenom: string, nom: string) {
  const config = useRuntimeConfig()
  
  // Si Green API est configuré
  if (config.greenApiId && config.greenApiToken) {
    try {
      const message = `🎉 Bonjour ${prenom} ${nom} !

Votre inscription au Concours Photo Rétro DINOR a été reçue avec succès !

📸 Prochaines étapes :
• Votre candidature sera validée sous 24h
• Vous recevrez une notification WhatsApp
• Vous pourrez alors poster vos photos vintage

🏆 Restez connecté pour plus d'informations !

DINOR - Cuisine Vintage des Années 60`

      await $fetch(`https://api.green-api.com/waInstance${config.greenApiId}/SendMessage/${config.greenApiToken}`, {
        method: 'POST',
        body: {
          chatId: `${whatsapp}@c.us`,
          message: message
        }
      })

      console.log('✅ Message WhatsApp envoyé à:', whatsapp)
    } catch (error) {
      console.error('❌ Erreur envoi WhatsApp:', error)
    }
  }
}
