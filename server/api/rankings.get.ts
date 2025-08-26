import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  
  try {
    // Récupérer tous les candidats approuvés, triés par votes
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*')
      .eq('status', 'approved')
      .order('votes_count', { ascending: false })
    
    if (candidatesError) {
      throw candidatesError
    }

    // Calculer les statistiques
    const totalCandidates = candidates?.length || 0
    const totalVotes = candidates?.reduce((sum, candidate) => sum + (candidate.votes_count || 0), 0) || 0

    // Statistiques des votes d'aujourd'hui
    const today = new Date().toISOString().split('T')[0]
    const { count: todayVotes } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_date', today)

    // Nombre de votants actifs (IPs uniques qui ont voté)
    const { data: uniqueVoters } = await supabase
      .from('votes')
      .select('ip_address')
      .eq('vote_date', today)
    
    const activeVoters = new Set(uniqueVoters?.map(v => v.ip_address)).size || 0

    const stats = {
      totalCandidates,
      totalVotes,
      todayVotes: todayVotes || 0,
      activeVoters
    }

    return {
      success: true,
      candidates: candidates || [],
      stats
    }
  } catch (error) {
    console.error('Erreur API rankings:', error)
    
    // Retourner des données de test en cas d'erreur
    return {
      success: false,
      candidates: [],
      stats: {
        totalCandidates: 0,
        totalVotes: 0,
        todayVotes: 0,
        activeVoters: 0
      },
      error: error.message
    }
  }
})