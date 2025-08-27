<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-dinor-cream border-2 border-dinor-red-vintage p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl" style="border-radius: 8px;">
      
      <!-- En-tête candidat -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-dinor-brown mb-2">📸 Espace Candidat</h2>
        <p class="text-dinor-brown text-sm">Partagez votre photo vintage DINOR</p>
      </div>

      <!-- Onglets -->
      <div class="flex mb-6 bg-dinor-beige p-1" style="border-radius: 4px;">
        <button 
          @click="activeTab = 'login'"
          :class="activeTab === 'login' ? 'bg-dinor-orange text-white' : 'text-dinor-brown'"
          class="flex-1 py-2 px-4 font-semibold transition-all duration-300"
          style="border-radius: 4px;"
        >
          Connexion
        </button>
        <button 
          @click="activeTab = 'register'"
          :class="activeTab === 'register' ? 'bg-dinor-orange text-white' : 'text-dinor-brown'"
          class="flex-1 py-2 px-4 font-semibold transition-all duration-300"
          style="border-radius: 4px;"
        >
          Inscription
        </button>
      </div>

      <!-- Connexion sociale candidats -->
      <div class="space-y-3 mb-6">
        <button 
          @click="signInWithGoogle"
          :disabled="loading"
          class="w-full bg-white border-2 border-dinor-olive text-dinor-brown py-3 px-4 font-semibold hover:bg-dinor-beige transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
          style="border-radius: 6px;"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ loading ? 'Connexion...' : 'Continuer avec Google' }}
        </button>
      </div>

      <div class="mb-4 flex items-center">
        <div class="flex-grow border-t border-dinor-beige"></div>
        <span class="px-4 text-sm text-dinor-brown">ou</span>
        <div class="flex-grow border-t border-dinor-beige"></div>
      </div>

      <!-- Formulaire de connexion candidat -->
      <form v-if="activeTab === 'login'" @submit.prevent="signInWithEmail" class="space-y-4">
        <h3 class="text-xl font-bold mb-4 text-dinor-brown text-center">Connexion Candidat</h3>
        
        <div>
          <input 
            v-model="loginForm.email"
            type="email" 
            class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
            style="border-radius: 6px;"
            placeholder="Email" 
            required
          >
        </div>
        
        <div>
          <input 
            v-model="loginForm.password"
            type="password" 
            class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
            style="border-radius: 6px;"
            placeholder="Mot de passe" 
            required
          >
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-gradient-to-r from-dinor-orange to-dinor-orange-light text-white py-3 font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          style="border-radius: 6px;"
        >
          {{ loading ? 'Connexion...' : 'Me connecter' }}
        </button>
      </form>

      <!-- Formulaire d'inscription candidat -->
      <form v-else @submit.prevent="signUpWithEmail" class="space-y-4">
        <h3 class="text-xl font-bold mb-4 text-dinor-brown text-center">Inscription Candidat</h3>
        
        <div>
          <input 
            v-model="registerForm.firstName"
            type="text" 
            class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
            style="border-radius: 6px;"
            placeholder="Prénom" 
            required
          >
        </div>
        
        <div>
          <input 
            v-model="registerForm.lastName"
            type="text" 
            class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
            style="border-radius: 6px;"
            placeholder="Nom" 
            required
          >
        </div>
        
        <div>
          <input 
            v-model="registerForm.email"
            type="email" 
            class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
            style="border-radius: 6px;"
            placeholder="Email" 
            required
          >
        </div>
        
        <div>
          <input 
            v-model="registerForm.password"
            type="password" 
            class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
            style="border-radius: 6px;"
            placeholder="Mot de passe (min 6 caractères)" 
            minlength="6"
            required
          >
        </div>
        
        <div>
          <input 
            v-model="registerForm.confirmPassword"
            type="password" 
            class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
            style="border-radius: 6px;"
            placeholder="Confirmer le mot de passe" 
            required
          >
        </div>
        
        <!-- reCAPTCHA -->
        <div 
          v-if="!isDev"
          ref="recaptchaElement" 
          class="flex justify-center"
        ></div>
        
        <!-- Checkbox de développement pour remplacer reCAPTCHA -->
        <div v-if="isDev" class="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <input
            id="devCheckbox"
            v-model="devCheckbox"
            type="checkbox"
            class="w-4 h-4 text-dinor-orange border-gray-300 rounded focus:ring-dinor-orange"
          />
          <label for="devCheckbox" class="text-sm text-yellow-800">
            ✅ Mode développement : J'accepte les conditions (reCAPTCHA désactivé)
          </label>
        </div>
        
        <button 
          type="submit" 
          :disabled="loading || (!recaptchaToken && !isDev) || (isDev && !devCheckbox)"
          class="w-full bg-gradient-to-r from-dinor-orange to-dinor-orange-light text-white py-3 font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          style="border-radius: 6px;"
        >
          {{ loading ? 'Inscription...' : "Devenir candidat" }}
        </button>
        
        <p class="text-xs text-dinor-brown text-center mt-2">
          En vous inscrivant, vous pourrez poster vos photos vintage DINOR
        </p>
      </form>

      <!-- Bouton fermer -->
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-dinor-brown hover:text-dinor-orange transition-colors duration-300"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Messages d'erreur -->
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm" style="border-radius: 6px;">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'success'])

const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const activeTab = ref('login')
const loading = ref(false)
const errorMessage = ref('')
const recaptchaToken = ref('')
const recaptchaElement = ref(null)
const recaptchaWidgetId = ref(null)
const devCheckbox = ref(false)
const isDev = process.env.NODE_ENV === 'development'

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Connexion avec Google
const signInWithGoogle = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${config.public.siteUrl}/auth/callback`
      }
    })
    
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

// Connexion par email
const signInWithEmail = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.value.email,
      password: loginForm.value.password
    })
    
    if (error) throw error
    
    emit('success', 'Connexion candidat réussie ! Vous pouvez maintenant poster vos photos.')
    emit('close')
    
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

// Inscription par email
const signUpWithEmail = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas')
    }
    
    // Vérifier reCAPTCHA ou checkbox de développement
    if (!isDev) {
      if (!recaptchaToken.value) {
        throw new Error('Veuillez compléter le reCAPTCHA')
      }
      
      // Vérifier le reCAPTCHA
      const recaptchaResponse = await $fetch('/api/verify-recaptcha', {
        method: 'POST',
        body: { token: recaptchaToken.value }
      })
      
      if (!recaptchaResponse.success) {
        throw new Error('Vérification reCAPTCHA échouée')
      }
    } else {
      if (!devCheckbox.value) {
        throw new Error('Veuillez accepter les conditions en mode développement')
      }
      console.log('🔧 Mode développement : reCAPTCHA contourné')
    }
    
    const { error } = await supabase.auth.signUp({
      email: registerForm.value.email,
      password: registerForm.value.password,
      options: {
        emailRedirectTo: `${config.public.siteUrl}/auth/callback`,
        data: {
          first_name: registerForm.value.firstName,
          last_name: registerForm.value.lastName,
          full_name: `${registerForm.value.firstName} ${registerForm.value.lastName}`,
          user_type: 'candidate'
        }
      }
    })
    
    if (error) throw error
    
    // Envoyer email de bienvenue candidat
    try {
      await $fetch('/api/send-email', {
        method: 'POST',
        body: {
          type: 'candidate_welcome',
          email: registerForm.value.email,
          name: `${registerForm.value.firstName} ${registerForm.value.lastName}`
        }
      })
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError)
    }
    
    emit('success', 'Inscription candidat réussie ! Vous pouvez maintenant poster vos photos vintage.')
    emit('close')
    
  } catch (error) {
    errorMessage.value = error.message
    if (window.grecaptcha && recaptchaWidgetId.value !== null) {
      window.grecaptcha.reset(recaptchaWidgetId.value)
    }
    recaptchaToken.value = ''
  } finally {
    loading.value = false
  }
}

// Initialiser reCAPTCHA
const initRecaptcha = () => {
  if (window.grecaptcha && recaptchaElement.value) {
    recaptchaWidgetId.value = window.grecaptcha.render(recaptchaElement.value, {
      sitekey: config.public.recaptchaSiteKey,
      callback: (token) => {
        recaptchaToken.value = token
      },
      'expired-callback': () => {
        recaptchaToken.value = ''
      }
    })
  }
}

// Charger reCAPTCHA (seulement en production)
watch([() => props.show, activeTab], ([newShow, newTab]) => {
  if (newShow && newTab === 'register' && !isDev) {
    nextTick(() => {
      if (window.grecaptcha?.render) {
        initRecaptcha()
      } else {
        const checkRecaptcha = setInterval(() => {
          if (window.grecaptcha?.render) {
            clearInterval(checkRecaptcha)
            initRecaptcha()
          }
        }, 100)
      }
    })
  }
})

// Reset form when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    errorMessage.value = ''
    recaptchaToken.value = ''
    devCheckbox.value = false
    loginForm.value = { email: '', password: '' }
    registerForm.value = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }
  }
})
</script>