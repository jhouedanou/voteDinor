import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl, 
    config.supabaseServiceKey || config.public.supabaseAnonKey
  )
  
  try {
    // Récupérer les candidats approuvés
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    // Calculer les votes réels depuis la table votes
    const candidatesWithRealVotes = await Promise.all(
      (candidates || []).map(async (candidate) => {
        const { count, error: voteError } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', candidate.id)
        
        if (voteError) {
          console.error(`Erreur calcul votes candidat ${candidate.id}:`, voteError)
          return { ...candidate, votes_count: 0 }
        }
        
        return { ...candidate, votes_count: count || 0 }
      })
    )
    
    // Trier par nombre de votes décroissant
    candidatesWithRealVotes.sort((a, b) => b.votes_count - a.votes_count)
    
    return candidatesWithRealVotes
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du chargement des candidats: ' + error.message
    })
  }
})