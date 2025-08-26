// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
      title: 'Concours Photo Rétro DINOR',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Participez au concours photo vintage DINOR - Cuisine des années 60' }
      ]
    }
  },
  nitro: {
    preset: 'vercel-edge'
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
    }
  }
})
