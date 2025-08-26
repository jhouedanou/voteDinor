// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@vueuse/nuxt'
  ],
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  },
  app: {
    head: {
      title: 'Concours Photo Rétro DINOR',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Participez au concours photo vintage DINOR - Cuisine des années 60' }
      ],
      script: [
        {
          src: 'https://www.google.com/recaptcha/api.js?render=explicit',
          async: true,
          defer: true
        }
      ]
    }
  },
  nitro: {
    preset: 'vercel-edge'
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
    }
  }
})
