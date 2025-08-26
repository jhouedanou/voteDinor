import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  
  try {
    // Récupérer l'utilisateur connecté
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token d\'authentification requis'
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

    // Vérifier si l'utilisateur est admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès administrateur requis'
      })
    }

    // Récupérer les paramètres de requête
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 50
    const offset = (page - 1) * limit

    // Récupérer les votes avec informations des candidats
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select(`
        *,
        candidates (
          id,
          nom,
          prenom,
          photo_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (votesError) {
      throw votesError
    }

    // Compter le total des votes
    const { count: totalVotes } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })

    // Statistiques par jour (7 derniers jours)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: weeklyStats } = await supabase
      .from('votes')
      .select('vote_date')
      .gte('created_at', sevenDaysAgo.toISOString())

    // Grouper par jour
    const dailyVotes = {}
    weeklyStats?.forEach(vote => {
      const date = vote.vote_date
      dailyVotes[date] = (dailyVotes[date] || 0) + 1
    })

    // Top candidats
    const { data: topCandidates } = await supabase
      .from('candidates')
      .select('id, nom, prenom, votes_count, photo_url')
      .eq('status', 'approved')
      .order('votes_count', { ascending: false })
      .limit(10)

    // IPs les plus actives
    const { data: ipStats } = await supabase
      .from('votes')
      .select('ip_address')
    
    const ipCounts = {}
    ipStats?.forEach(vote => {
      ipCounts[vote.ip_address] = (ipCounts[vote.ip_address] || 0) + 1
    })

    const topIPs = Object.entries(ipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, votes: count }))

    return {
      success: true,
      votes: votes || [],
      pagination: {
        page,
        limit,
        total: totalVotes || 0,
        pages: Math.ceil((totalVotes || 0) / limit)
      },
      stats: {
        totalVotes: totalVotes || 0,
        dailyVotes,
        topCandidates: topCandidates || [],
        topIPs
      }
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la récupération des votes: ' + error.message
    })
  }
})