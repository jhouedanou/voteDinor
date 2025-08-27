import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { whatsapp, code } = body

  if (!whatsapp || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'WhatsApp et code requis'
    })
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey || config.public.supabaseAnonKey
  )

  try {
    // 1. Vérifier le code de connexion
    const { data: loginCode, error: codeError } = await supabase
      .from('login_codes')
      .select('*')
      .eq('whatsapp', whatsapp)
      .eq('code', code)
      .eq('used', false)
      .single()

    if (codeError || !loginCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Code invalide ou expiré'
      })
    }

    // 2. Vérifier si le code a expiré
    if (new Date(loginCode.expires_at) < new Date()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Code expiré'
      })
    }

    // 3. Récupérer les informations du candidat
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('*')
      .eq('whatsapp', whatsapp)
      .single()

    if (candidateError || !candidate) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Candidat non trouvé'
      })
    }

    // 4. Marquer le code comme utilisé
    await supabase
      .from('login_codes')
      .update({ used: true })
      .eq('id', loginCode.id)

    // 5. Créer une session temporaire (simulation)
    const sessionToken = generateSessionToken(candidate.id)
    
    // 6. Sauvegarder la session
    const { error: sessionError } = await supabase
      .from('whatsapp_sessions')
      .upsert({
        candidate_id: candidate.id,
        session_token: sessionToken,
        whatsapp: whatsapp,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
      })

    if (sessionError) {
      console.error('Erreur sauvegarde session:', sessionError)
    }

    return {
      success: true,
      message: 'Connexion réussie !',
      sessionToken: sessionToken,
      candidate: {
        id: candidate.id,
        nom: candidate.nom,
        prenom: candidate.prenom,
        whatsapp: candidate.whatsapp,
        status: candidate.status,
        photo_url: candidate.photo_url
      },
      expiresIn: '24 heures'
    }

  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la vérification: ' + error.message
    })
  }
})

// Fonction pour générer un token de session
function generateSessionToken(candidateId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  return `dinor_${candidateId}_${timestamp}_${random}`
}
