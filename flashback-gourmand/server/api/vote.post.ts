import { supabase } from '~/plugins/supabase.client'

// reCAPTCHA verification function
async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    throw new Error('reCAPTCHA secret key not configured')
  }
  
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${token}`
  })
  
  const data = await response.json()
  return data.success && data.score > 0.5
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { candidate_id, recaptcha_token } = body
    
    // Get client IP
    const ip_address = getClientIP(event) || '127.0.0.1'
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    
    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptcha_token)
    if (!recaptchaValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Vérification anti-spam échouée'
      })
    }
    
    // Check rate limiting (1 vote/candidate/day/IP)
    const vote_limit_id = `${ip_address}_${candidate_id}_${today}`
    const { data: existingVote } = await supabase
      .from('vote_limits')
      .select('id')
      .eq('id', vote_limit_id)
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
      .select('id, status, votes_count')
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
    
    // Execute transaction-like operations
    try {
      // 1. Insert vote record
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          candidate_id,
          ip_address,
          vote_date: today,
          user_agent: getHeader(event, 'user-agent') || 'unknown'
        })
      
      if (voteError) throw voteError
      
      // 2. Insert vote limit record
      const { error: limitError } = await supabase
        .from('vote_limits')
        .insert({
          id: vote_limit_id,
          ip_address,
          candidate_id,
          vote_date: today,
          vote_count: 1
        })
      
      if (limitError) throw limitError
      
      // 3. Increment candidate vote count
      const { error: updateError } = await supabase
        .from('candidates')
        .update({ votes_count: candidate.votes_count + 1 })
        .eq('id', candidate_id)
      
      if (updateError) throw updateError
      
      return { 
        success: true, 
        message: 'Vote enregistré !' 
      }
    } catch (transactionError) {
      // In a real app, you'd want to implement rollback logic here
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de l\'enregistrement du vote: ' + transactionError.message
      })
    }
    
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors du vote: ' + error.message
    })
  }
})