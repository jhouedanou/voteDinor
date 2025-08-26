export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  
  // Vérifier si l'utilisateur est connecté
  if (!user.value) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Vous devez être connecté pour accéder à cette page'
    })
  }
  
  try {
    // Vérifier si l'utilisateur est admin
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.value.id)
      .single()
    
    if (error) {
      console.error('Erreur vérification admin:', error)
      throw createError({
        statusCode: 403,
        statusMessage: 'Erreur de vérification des permissions'
      })
    }
    
    if (!profile?.is_admin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès administrateur requis'
      })
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur de vérification des permissions'
    })
  }
})