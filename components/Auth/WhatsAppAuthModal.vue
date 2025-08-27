<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-dinor-cream border-2 border-dinor-red-vintage p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl" style="border-radius: 8px;">
      
      <!-- En-tête -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">📱</span>
        </div>
        <h2 class="text-2xl font-bold text-dinor-brown mb-2">Connexion WhatsApp</h2>
        <p class="text-dinor-brown text-sm">Simple et sécurisé</p>
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

      <!-- Connexion WhatsApp -->
      <div v-if="activeTab === 'login'">
        <div v-if="!codeSent" class="space-y-4">
          <h3 class="text-xl font-bold mb-4 text-dinor-brown text-center">Se connecter</h3>
          
          <div>
            <label class="block text-sm font-medium text-dinor-brown mb-2">
              Numéro WhatsApp *
            </label>
            <input 
              v-model="loginForm.whatsapp"
              type="tel" 
              class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
              style="border-radius: 6px;"
              placeholder="+22501234567" 
              required
            >
            <p class="text-xs text-gray-500 mt-1">Format : +225 suivi de 8 chiffres</p>
          </div>
          
          <button 
            @click="sendLoginCode"
            :disabled="loading || !loginForm.whatsapp"
            class="w-full bg-green-500 text-white py-3 font-bold hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
            style="border-radius: 6px;"
          >
            {{ loading ? 'Envoi...' : '📱 Envoyer le code' }}
          </button>
        </div>

        <div v-else class="space-y-4">
          <h3 class="text-xl font-bold mb-4 text-dinor-brown text-center">Code de connexion</h3>
          
          <div class="text-center mb-4">
            <p class="text-dinor-brown-dark">Code envoyé à {{ loginForm.whatsapp }}</p>
            <p class="text-sm text-gray-500">Vérifiez votre WhatsApp</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-dinor-brown mb-2">
              Code à 6 chiffres *
            </label>
            <input 
              v-model="loginForm.code"
              type="text" 
              maxlength="6"
              class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange text-center text-2xl font-bold" 
              style="border-radius: 6px;"
              placeholder="123456" 
              required
            >
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="verifyCode"
              :disabled="loading || loginForm.code.length !== 6"
              class="flex-1 bg-green-500 text-white py-3 font-bold hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
              style="border-radius: 6px;"
            >
              {{ loading ? 'Vérification...' : '✅ Vérifier' }}
            </button>
            <button 
              @click="codeSent = false"
              class="px-4 py-3 bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300"
              style="border-radius: 6px;"
            >
              ← Retour
            </button>
          </div>
        </div>
      </div>

      <!-- Inscription WhatsApp -->
      <div v-else class="space-y-4">
        <h3 class="text-xl font-bold mb-4 text-dinor-brown text-center">S'inscrire</h3>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <input 
              v-model="registerForm.prenom"
              type="text" 
              class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
              style="border-radius: 6px;"
              placeholder="Prénom" 
              required
            >
          </div>
          <div>
            <input 
              v-model="registerForm.nom"
              type="text" 
              class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
              style="border-radius: 6px;"
              placeholder="Nom" 
              required
            >
          </div>
        </div>
        
        <div>
          <input 
            v-model="registerForm.whatsapp"
            type="tel" 
            class="w-full bg-dinor-beige border-2 border-dinor-olive px-4 py-3 text-dinor-brown-dark focus:outline-none focus:border-dinor-orange" 
            style="border-radius: 6px;"
            placeholder="+22501234567" 
            required
          >
          <p class="text-xs text-gray-500 mt-1">Format : +225 suivi de 8 chiffres</p>
        </div>

        <!-- Upload de photo -->
        <div>
          <label class="block text-sm font-medium text-dinor-brown mb-2">
            Photo vintage DINOR (optionnel)
          </label>
          <div class="border-2 border-dashed border-dinor-olive rounded-lg p-4 text-center">
            <input 
              @change="handlePhotoSelect"
              type="file" 
              ref="photoInput"
              accept="image/*" 
              class="hidden"
            >
            <div v-if="!photoPreview" @click="$refs.photoInput.click()" class="cursor-pointer">
              <div class="text-2xl mb-2">📸</div>
              <p class="text-dinor-brown font-medium">Cliquez pour ajouter une photo</p>
              <p class="text-sm text-gray-500">JPG, PNG, GIF (max 5MB)</p>
            </div>
            <div v-else class="space-y-2">
              <img :src="photoPreview" alt="Aperçu" class="max-w-full h-32 object-cover rounded mx-auto">
              <button @click="removePhoto" class="text-red-500 text-sm">❌ Supprimer</button>
            </div>
          </div>
        </div>
        
        <button 
          @click="registerWithWhatsApp"
          :disabled="loading || !registerForm.prenom || !registerForm.nom || !registerForm.whatsapp"
          class="w-full bg-green-500 text-white py-3 font-bold hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
          style="border-radius: 6px;"
        >
          {{ loading ? 'Inscription...' : '📱 S\'inscrire avec WhatsApp' }}
        </button>
      </div>

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

const activeTab = ref('login')
const loading = ref(false)
const errorMessage = ref('')
const codeSent = ref(false)
const photoPreview = ref(null)

const loginForm = ref({
  whatsapp: '',
  code: ''
})

const registerForm = ref({
  prenom: '',
  nom: '',
  whatsapp: ''
})

// Envoyer le code de connexion
const sendLoginCode = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    const response = await $fetch('/api/whatsapp-login', {
      method: 'POST',
      body: {
        whatsapp: loginForm.value.whatsapp
      }
    })
    
    if (response.success) {
      codeSent.value = true
      emit('success', response.message)
    }
    
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || error.message
  } finally {
    loading.value = false
  }
}

// Vérifier le code
const verifyCode = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    const response = await $fetch('/api/verify-login-code', {
      method: 'POST',
      body: {
        whatsapp: loginForm.value.whatsapp,
        code: loginForm.value.code
      }
    })
    
    if (response.success) {
      emit('success', 'Connexion réussie !')
      emit('close')
    }
    
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || error.message
  } finally {
    loading.value = false
  }
}

// S'inscrire avec WhatsApp
const registerWithWhatsApp = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    let photo_data = null
    if (photoPreview.value) {
      // Convertir l'image en base64
      const response = await fetch(photoPreview.value)
      const blob = await response.blob()
      const reader = new FileReader()
      photo_data = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
    }
    
    const response = await $fetch('/api/whatsapp-auth', {
      method: 'POST',
      body: {
        nom: registerForm.value.nom,
        prenom: registerForm.value.prenom,
        whatsapp: registerForm.value.whatsapp,
        photo_data
      }
    })
    
    if (response.success) {
      emit('success', response.message)
      emit('close')
    }
    
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || error.message
  } finally {
    loading.value = false
  }
}

// Gérer la sélection de photo
const handlePhotoSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'Le fichier est trop volumineux (max 5MB)'
      return
    }
    photoPreview.value = URL.createObjectURL(file)
  }
}

// Supprimer la photo
const removePhoto = () => {
  photoPreview.value = null
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

// Reset form when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    errorMessage.value = ''
    codeSent.value = false
    photoPreview.value = null
    loginForm.value = { whatsapp: '', code: '' }
    registerForm.value = { prenom: '', nom: '', whatsapp: '' }
  }
})
</script>
