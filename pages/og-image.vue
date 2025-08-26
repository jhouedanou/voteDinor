<template>
  <div class="og-image">
    <div class="bg-gradient-to-br from-dinor-orange to-dinor-red-vintage w-full h-full flex items-center justify-center">
      <div class="text-center text-white p-8">
        <div class="text-6xl font-bold mb-4">🍳</div>
        <h1 class="text-5xl font-retro font-bold mb-4">DINOR</h1>
        <h2 class="text-3xl font-semibold mb-2">Concours Photo Rétro</h2>
        <p class="text-xl opacity-90">Cuisine Vintage des Années 60</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Configuration pour l'image og:image
definePageMeta({
  layout: false
})

// Head pour cette page
useHead({
  title: 'DINOR - Concours Photo Rétro',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>

<style scoped>
.og-image {
  width: 1200px;
  height: 630px;
  background: linear-gradient(135deg, #D2691E 0%, #8B4513 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Georgia', serif;
}

.font-retro {
  font-family: 'Georgia', 'Times New Roman', serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
