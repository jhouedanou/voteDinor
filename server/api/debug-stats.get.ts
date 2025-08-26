import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  
  try {
    // Compter les candidats
    const { count: candidatesCount } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
    
    // Compter les votes
    const { count: votesCount } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
    
    // Récupérer quelques candidats
    const { data: candidates } = await supabase
      .from('candidates')
      .select('id, nom, prenom, votes_count, status')
      .limit(5)
    
    // Récupérer quelques votes
    const { data: votes } = await supabase
      .from('votes')
      .select('id, candidate_id, vote_date, created_at')
      .limit(5)
    
    return {
      success: true,
      debug: {
        candidatesCount,
        votesCount,
        candidates,
        votes,
        supabaseUrl: config.public.supabaseUrl ? 'configuré' : 'non configuré',
        supabaseKey: config.public.supabaseAnonKey ? 'configuré' : 'non configuré'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})