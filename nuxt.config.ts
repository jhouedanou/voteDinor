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
    key: process.env.SUPABASE_ANON_KEY,
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 365, // 1 an
      sameSite: 'lax',
      secure: true
    }
  },
  app: {
    head: {
      title: 'Concours Photo Rétro DINOR',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Participez au concours photo vintage DINOR - Cuisine des années 60' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://vote-dinor.vercel.app/' },
        { property: 'og:title', content: 'Concours Photo Rétro DINOR' },
        { property: 'og:description', content: 'Participez au concours photo vintage DINOR - Cuisine des années 60' },
        { property: 'og:image', content: 'https://vote-dinor.vercel.app/og-image' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Logo DINOR - Concours Photo Rétro' },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://vote-dinor.vercel.app/' },
        { name: 'twitter:title', content: 'Concours Photo Rétro DINOR' },
        { name: 'twitter:description', content: 'Participez au concours photo vintage DINOR - Cuisine des années 60' },
        { name: 'twitter:image', content: 'https://vote-dinor.vercel.app/og-image' },
        { name: 'twitter:image:alt', content: 'Logo DINOR - Concours Photo Rétro' },
        
        // Autres métadonnées
        { name: 'theme-color', content: '#D2691E' },
        { name: 'msapplication-TileColor', content: '#D2691E' }
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
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://vote-dinor.vercel.app'
    }
  }
})
