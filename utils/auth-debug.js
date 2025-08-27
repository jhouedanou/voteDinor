// Utilitaire de debug pour l'authentification Supabase
import { createClient } from '@supabase/supabase-js'

export const debugAuth = async (email, password) => {
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  console.log('🔍 Debug authentification pour:', email)
  
  try {
    // 1. Vérifier si l'utilisateur existe
    console.log('1️⃣ Vérification de l\'existence du compte...')
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Erreur lors de la vérification des utilisateurs:', listError)
      return { error: 'Impossible de vérifier les utilisateurs' }
    }
    
    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé dans la base de données')
      return { error: 'Utilisateur non trouvé' }
    }
    
    console.log('✅ Utilisateur trouvé:', {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at
    })
    
    // 2. Vérifier si l'email est confirmé
    if (!user.email_confirmed_at) {
      console.log('⚠️ Email non confirmé')
      return { 
        error: 'Email non confirmé',
        needsConfirmation: true,
        user: user
      }
    }
    
    // 3. Tenter la connexion
    console.log('2️⃣ Tentative de connexion...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    
    if (error) {
      console.error('❌ Erreur de connexion:', error)
      return { error: error.message }
    }
    
    console.log('✅ Connexion réussie:', {
      user_id: data.user.id,
      session: !!data.session
    })
    
    return { success: true, user: data.user, session: data.session }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return { error: error.message }
  }
}

// Fonction pour forcer la confirmation d'un email
export const forceConfirmEmail = async (email) => {
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey || config.public.supabaseAnonKey
  )

  try {
    console.log('🔧 Force confirmation pour:', email)
    
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      throw listError
    }
    
    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }
    
    // Forcer la confirmation
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true
    })
    
    if (error) {
      throw error
    }
    
    console.log('✅ Email confirmé avec succès')
    return { success: true }
    
  } catch (error) {
    console.error('❌ Erreur lors de la confirmation:', error)
    return { error: error.message }
  }
}

// Fonction pour réinitialiser un mot de passe
export const resetPassword = async (email) => {
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  try {
    console.log('🔑 Envoi de réinitialisation pour:', email)
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${config.public.siteUrl}/reset-password`
    })
    
    if (error) {
      throw error
    }
    
    console.log('✅ Email de réinitialisation envoyé')
    return { success: true }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error)
    return { error: error.message }
  }
}
