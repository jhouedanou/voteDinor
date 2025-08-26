<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="card-retro bg-dinor-cream border-2 border-dinor-red-vintage rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      
      <!-- Onglets -->
      <div class="flex mb-6 bg-dinor-beige rounded-lg p-1">
        <button 
          @click="activeTab = 'login'"
          :class="activeTab === 'login' ? 'bg-dinor-orange text-white' : 'text-dinor-brown'"
          class="flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300"
        >
          Connexion
        </button>
        <button 
          @click="activeTab = 'register'"
          :class="activeTab === 'register' ? 'bg-dinor-orange text-white' : 'text-dinor-brown'"
          class="flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300"
        >
          Inscription
        </button>
      </div>

      <!-- Connexion avec Google -->
      <div class="mb-6">
        <button 
          @click="signInWithGoogle"
          :disabled="loading"
          class="w-full bg-white border-2 border-dinor-olive text-dinor-brown py-3 px-4 rounded-lg font-semibold hover:bg-dinor-beige transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
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

      <!-- Formulaire de connexion -->
      <form v-if="activeTab === 'login'" @submit.prevent="signInWithEmail" class="space-y-4">
        <h3 class="text-2xl font-retro font-bold mb-6 text-dinor-brown text-center">Connexion</h3>
        
        <div>
          <input 
            v-model="loginForm.email"
            type="email" 
            class="input-retro w-full bg-dinor-beige border-2 border-dinor-olive rounded-lg px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange focus:ring-2 focus:ring-dinor-orange focus:ring-opacity-20" 
            placeholder="Email" 
            required
          >
        </div>
        
        <div>
          <input 
            v-model="loginForm.password"
            type="password" 
            class="input-retro w-full bg-dinor-beige border-2 border-dinor-olive rounded-lg px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange focus:ring-2 focus:ring-dinor-orange focus:ring-opacity-20" 
            placeholder="Mot de passe" 
            required
          >
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-gradient-dinor text-white py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <!-- Formulaire d'inscription -->
      <form v-else @submit.prevent="signUpWithEmail" class="space-y-4">
        <h3 class="text-2xl font-retro font-bold mb-6 text-dinor-brown text-center">Inscription</h3>
        
        <div>
          <input 
            v-model="registerForm.firstName"
            type="text" 
            class="input-retro w-full bg-dinor-beige border-2 border-dinor-olive rounded-lg px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange focus:ring-2 focus:ring-dinor-orange focus:ring-opacity-20" 
            placeholder="Prénom" 
            required
          >
        </div>
        
        <div>
          <input 
            v-model="registerForm.lastName"
            type="text" 
            class="input-retro w-full bg-dinor-beige border-2 border-dinor-olive rounded-lg px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange focus:ring-2 focus:ring-dinor-orange focus:ring-opacity-20" 
            placeholder="Nom" 
            required
          >
        </div>
        
        <div>
          <input 
            v-model="registerForm.email"
            type="email" 
            class="input-retro w-full bg-dinor-beige border-2 border-dinor-olive rounded-lg px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange focus:ring-2 focus:ring-dinor-orange focus:ring-opacity-20" 
            placeholder="Email" 
            required
          >
        </div>
        
        <div>
          <input 
            v-model="registerForm.password"
            type="password" 
            class="input-retro w-full bg-dinor-beige border-2 border-dinor-olive rounded-lg px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange focus:ring-2 focus:ring-dinor-orange focus:ring-opacity-20" 
            placeholder="Mot de passe (min 6 caractères)" 
            minlength="6"
            required
          >
        </div>
        
        <div>
          <input 
            v-model="registerForm.confirmPassword"
            type="password" 
            class="input-retro w-full bg-dinor-beige border-2 border-dinor-olive rounded-lg px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange focus:ring-2 focus:ring-dinor-orange focus:ring-opacity-20" 
            placeholder="Confirmer le mot de passe" 
            required
          >
        </div>
        
        <!-- reCAPTCHA -->
        <div 
          ref="recaptchaElement" 
          class="flex justify-center"
        ></div>
        
        <button 
          type="submit" 
          :disabled="loading || !recaptchaToken"
          class="w-full bg-gradient-dinor text-white py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {{ loading ? 'Inscription...' : "S'inscrire" }}
        </button>
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
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
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
const user = useSupabaseUser()

const activeTab = ref('login')
const loading = ref(false)
const errorMessage = ref('')
const recaptchaToken = ref('')
const recaptchaElement = ref(null)
const recaptchaWidgetId = ref(null)

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
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) throw error
    
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
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.value.email,
      password: loginForm.value.password
    })
    
    if (error) throw error
    
    emit('success', 'Connexion réussie !')
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
    
    if (!recaptchaToken.value) {
      throw new Error('Veuillez compléter le reCAPTCHA')
    }
    
    // Vérifier le reCAPTCHA côté serveur
    const recaptchaResponse = await $fetch('/api/verify-recaptcha', {
      method: 'POST',
      body: { token: recaptchaToken.value }
    })
    
    if (!recaptchaResponse.success) {
      throw new Error('Vérification reCAPTCHA échouée')
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: registerForm.value.email,
      password: registerForm.value.password,
      options: {
        emailRedirectTo: undefined, // Désactive la confirmation par email
        data: {
          first_name: registerForm.value.firstName,
          last_name: registerForm.value.lastName,
          full_name: `${registerForm.value.firstName} ${registerForm.value.lastName}`
        }
      }
    })
    
    if (error) throw error
    
    emit('success', 'Inscription réussie ! Vous pouvez maintenant vous connecter.')
    emit('close')
    
  } catch (error) {
    errorMessage.value = error.message
    // Reset reCAPTCHA on error
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
    const config = useRuntimeConfig()
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

// Charger reCAPTCHA quand le modal s'ouvre sur l'inscription
watch([() => props.show, activeTab], ([newShow, newTab]) => {
  if (newShow && newTab === 'register') {
    nextTick(() => {
      if (window.grecaptcha && window.grecaptcha.render) {
        initRecaptcha()
      } else {
        // Attendre que reCAPTCHA soit chargé
        const checkRecaptcha = setInterval(() => {
          if (window.grecaptcha && window.grecaptcha.render) {
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
    loginForm.value = { email: '', password: '' }
    registerForm.value = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }
  }
})
</script>