import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // Utiliser la clé service pour bypasser RLS côté serveur
  const supabase = createClient(
    config.public.supabaseUrl, 
    config.supabaseServiceKey || config.public.supabaseAnonKey
  )

  try {
    const body = await readBody(event)
    const { candidate_id } = body
    
    // Récupérer l'utilisateur authentifié
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentification requise pour voter'
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
    
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    
    // Vérifier si l'utilisateur a déjà voté pour ce candidat aujourd'hui
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('candidate_id', candidate_id)
      .eq('user_id', user.id)
      .eq('vote_date', today)
      .single()
    
    if (existingVote) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Vous avez déjà voté pour ce candidat aujourd\'hui'
      })
    }
    
    // Check if candidate exists and is approved
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, status')
      .eq('id', candidate_id)
      .single()
    
    if (candidateError || !candidate) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Candidat non trouvé'
      })
    }
    
    if (candidate.status !== 'approved') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Candidat non approuvé'
      })
    }
    
    // Insérer le vote (IP optionnelle pour statistiques seulement)
    const ip_address = getHeader(event, 'x-forwarded-for') || 
                      getHeader(event, 'x-real-ip') || 
                      event.node.req.socket.remoteAddress || 
                      '127.0.0.1'
    
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        candidate_id,
        user_id: user.id,
        ip_address, // Gardé pour statistiques mais pas pour rate limiting
        vote_date: today,
        user_agent: getHeader(event, 'user-agent') || 'unknown'
      })
    
    if (voteError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de l\'enregistrement du vote: ' + voteError.message
      })
    }
    
    // Calculer le nouveau nombre de votes depuis la table votes
    const { count: newVoteCount } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('candidate_id', candidate_id)
    
    return { 
      success: true, 
      message: 'Vote enregistré avec succès !',
      new_vote_count: newVoteCount || 1
    }
    
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors du vote: ' + error.message
    })
  }
})