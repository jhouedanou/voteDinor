import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // Utiliser la clé service pour bypasser RLS
  const supabase = createClient(
    config.public.supabaseUrl, 
    config.supabaseServiceKey || config.public.supabaseAnonKey
  )

  try {
    // Récupérer l'utilisateur authentifié
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentification requise'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token invalide'
      })
    }

    const body = await readBody(event)
    const { nom, prenom, whatsapp, photo_data } = body
    
    // Validate Ivorian phone number
    if (!whatsapp.startsWith('+225')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Numéro WhatsApp ivoirien requis'
      })
    }
    
    // Upload photo to Supabase Storage
    let photo_url = ''
    let photo_filename = ''
    
    if (photo_data) {
      try {
        // Essayer d'abord Supabase Storage
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
          console.warn('Supabase Storage non configuré, utilisation fallback')
          photo_url = photo_data // Temporaire, pas recommandé en prod
          photo_filename = `temp_${Date.now()}`
        }
      } catch (uploadError) {
        console.error('Erreur upload:', uploadError)
        // En cas d'erreur, stocker temporairement en base64
        photo_url = photo_data
        photo_filename = `fallback_${Date.now()}`
      }
    }
    
    // Vérifier si l'utilisateur est déjà candidat
    const { data: existingCandidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', user.email)
      .single()
    
    if (existingCandidate) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Vous êtes déjà inscrit au concours'
      })
    }

    // Save candidate to Supabase
    const { data: candidate, error } = await supabase
      .from('candidates')
      .insert({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: user.email,
        whatsapp: whatsapp.trim(),
        photo_url,
        description: `Candidat ${prenom} ${nom}`,
        votes_count: 0,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return { 
      success: true, 
      id: candidate.id,
      message: 'Inscription réussie ! Votre candidature sera validée sous 24h.'
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de l\'inscription: ' + error.message
    })
  }
})