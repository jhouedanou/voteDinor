export default defineNuxtPlugin(() => {
  // Vérifier que les variables d'environnement sont bien chargées
  const config = useRuntimeConfig()
  
  console.log('🔧 Supabase Config Check:')
  console.log('- SUPABASE_URL:', config.public.supabaseUrl ? '✅ Défini' : '❌ Manquant')
  console.log('- SUPABASE_ANON_KEY:', config.public.supabaseAnonKey ? '✅ Défini' : '❌ Manquant')
  
  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
    console.error('❌ Variables Supabase manquantes!')
    console.log('Variables disponibles:', Object.keys(config.public))
  }
})