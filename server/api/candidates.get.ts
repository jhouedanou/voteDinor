import { supabase } from '~/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('status', 'approved')
      .order('votes_count', { ascending: false })
    
    if (error) {
      throw error
    }
    
    return candidates || []
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du chargement des candidats: ' + error.message
    })
  }
})