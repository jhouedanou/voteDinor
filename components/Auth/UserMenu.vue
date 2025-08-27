<template>
  <div class="relative" data-user-menu>
    <!-- Menu utilisateur connecté -->
    <div v-if="user" class="flex items-center gap-4">
      <span class="text-dinor-cream font-medium">
        Bonjour, {{ user.user_metadata?.full_name || user.email }}
      </span>
      
      <div class="relative">
        <button 
          @mouseenter="showDropdown = true"
          @mouseleave="scheduleHideDropdown"
          @click="toggleDropdown"
          class="w-10 h-10 bg-dinor-beige rounded-full flex items-center justify-center hover:bg-dinor-cream transition-colors duration-300 cursor-pointer"
          title="Cliquez ou survolez pour voir le menu"
        >
          <img 
            v-if="user.user_metadata?.avatar_url" 
            :src="user.user_metadata.avatar_url" 
            :alt="user.user_metadata?.full_name || 'Avatar'"
            class="w-8 h-8 rounded-full object-cover"
          >
          <svg v-else class="w-5 h-5 text-dinor-brown" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </button>
        
        <!-- Dropdown Menu -->
        <div 
          v-if="showDropdown" 
          @mouseenter="cancelHideDropdown"
          @mouseleave="scheduleHideDropdown"
          @click.stop
          class="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-xl border-2 border-dinor-olive z-50 transition-all duration-200 ease-out"
          style="margin-top: 2px;"
        >
          <div class="py-2">
            <nuxt-link 
              to="/classements" 
              class="block px-4 py-3 text-dinor-brown hover:bg-dinor-beige transition-colors duration-200 text-sm font-medium"
              @click="closeDropdown"
            >
              🏆 Classements
            </nuxt-link>
            <nuxt-link 
              v-if="isAdmin"
              to="/admin/dashboard" 
              class="block px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 font-semibold text-sm"
              @click="closeDropdown"
            >
              ⚙️ Administration
            </nuxt-link>
            <nuxt-link 
              to="/profile" 
              class="block px-4 py-3 text-dinor-brown hover:bg-dinor-beige transition-colors duration-200 text-sm font-medium"
              @click="closeDropdown"
            >
              👤 Mon Profil
            </nuxt-link>
            <hr class="my-1 border-dinor-beige">
            <nuxt-link 
              to="/delete-account" 
              class="block px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
              @click="closeDropdown"
            >
              🗑️ Supprimer mon compte
            </nuxt-link>
            <button 
              @click="handleLogout"
              class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm font-medium border-t border-dinor-beige"
            >
              🚪 Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Boutons pour utilisateur non connecté -->
    <div v-else class="flex gap-2">
      <button 
        @click="$emit('openLogin')"
        class="bg-dinor-beige text-dinor-brown px-4 py-2 font-semibold hover:bg-dinor-cream transition-all duration-300"
        style="border-radius: 6px;"
      >
        🗳️ Voter
      </button>
      <button 
        @click="$emit('openCandidateLogin')"
        class="bg-dinor-orange text-white px-4 py-2 font-semibold hover:bg-dinor-orange-light transition-all duration-300"
        style="border-radius: 6px;"
      >
        📸 Candidat
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['openLogin', 'openCandidateLogin'])

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const showDropdown = ref(false)
const isAdmin = ref(false)
let hideTimer = null

// Toggle dropdown (click)
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// Schedule hide with delay
const scheduleHideDropdown = () => {
  hideTimer = setTimeout(() => {
    showDropdown.value = false
    hideTimer = null
  }, 300) // 300ms delay
}

// Cancel scheduled hide
const cancelHideDropdown = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  showDropdown.value = true
}

// Close dropdown immediately
const closeDropdown = () => {
  showDropdown.value = false
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// Vérifier si l'utilisateur est admin
watch(user, async (newUser) => {
  if (newUser) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', newUser.id)
        .single()
      
      isAdmin.value = profile?.is_admin || false
    } catch (error) {
      console.error('Erreur vérification admin:', error)
      isAdmin.value = false
    }
  } else {
    isAdmin.value = false
  }
}, { immediate: true })

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    closeDropdown()
    await navigateTo('/')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

// Fermer le menu quand on clique à l'extérieur
onMounted(() => {
  const menuRef = ref(null)
  
  const handleClickOutside = (event) => {
    // Vérifier si le clic est à l'extérieur du menu utilisateur
    const menuElement = document.querySelector('[data-user-menu]')
    if (menuElement && !menuElement.contains(event.target)) {
      closeDropdown()
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    if (hideTimer) {
      clearTimeout(hideTimer)
    }
  })
})


</script>