import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { whatsapp } = body

  if (!whatsapp) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Numéro WhatsApp requis'
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
    // 1. Vérifier si le candidat existe
    const { data: candidate, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('whatsapp', whatsapp)
      .single()

    if (error || !candidate) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Aucun candidat trouvé avec ce numéro WhatsApp'
      })
    }

    // 2. Vérifier le statut du candidat
    if (candidate.status === 'rejected') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Votre candidature a été rejetée'
      })
    }

    // 3. Générer un code de connexion temporaire
    const loginCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // 4. Sauvegarder le code de connexion
    const { error: codeError } = await supabase
      .from('login_codes')
      .upsert({
        whatsapp: whatsapp,
        code: loginCode,
        expires_at: expiresAt.toISOString(),
        used: false
      })

    if (codeError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la génération du code'
      })
    }

    // 5. Envoyer le code par WhatsApp
    try {
      await sendWhatsAppLoginCode(whatsapp, loginCode, candidate.prenom)
    } catch (whatsappError) {
      console.error('Erreur envoi WhatsApp:', whatsappError)
      // Ne pas bloquer si WhatsApp échoue
    }

    return {
      success: true,
      message: `Code de connexion envoyé à ${whatsapp}`,
      candidate: {
        id: candidate.id,
        nom: candidate.nom,
        prenom: candidate.prenom,
        whatsapp: candidate.whatsapp,
        status: candidate.status
      },
      expiresIn: '10 minutes'
    }

  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la connexion: ' + error.message
    })
  }
})

// Fonction pour envoyer le code de connexion par WhatsApp
async function sendWhatsAppLoginCode(whatsapp: string, code: string, prenom: string) {
  const config = useRuntimeConfig()
  
  if (config.greenApiId && config.greenApiToken) {
    try {
      const message = `🔐 Bonjour ${prenom} !

Votre code de connexion DINOR est : *${code}*

⏰ Ce code expire dans 10 minutes.

🏆 Concours Photo Rétro DINOR - Cuisine Vintage des Années 60`

      await $fetch(`https://api.green-api.com/waInstance${config.greenApiId}/SendMessage/${config.greenApiToken}`, {
        method: 'POST',
        body: {
          chatId: `${whatsapp}@c.us`,
          message: message
        }
      })

      console.log('✅ Code de connexion WhatsApp envoyé à:', whatsapp)
    } catch (error) {
      console.error('❌ Erreur envoi code WhatsApp:', error)
    }
  }
}
