import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl, 
    config.supabaseServiceKey || config.public.supabaseAnonKey
  )

  try {
    // Récupérer l'utilisateur authentifié
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      return { votes: [] }
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return { votes: [] }
    }
    
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    
    // Récupérer tous les votes de l'utilisateur pour aujourd'hui
    const { data: votes, error } = await supabase
      .from('votes')
      .select('candidate_id')
      .eq('user_id', user.id)
      .eq('vote_date', today)
    
    if (error) {
      console.error('Erreur récupération votes utilisateur:', error)
      return { votes: [] }
    }
    
    return { 
      votes: votes.map(vote => vote.candidate_id),
      user_id: user.id 
    }
    
  } catch (error) {
    console.error('Erreur API user-votes:', error)
    return { votes: [] }
  }
})