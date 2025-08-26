/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        'dinor': {
          'orange': '#FF8C00',
          'orange-light': '#FFB84D',
          'cream': '#FFF8DC',
          'brown': '#8B4513',
          'brown-dark': '#2C1810',
          'beige': '#F5DEB3',
          'red-vintage': '#CD853F',
          'olive': '#808000'
        }
      },
      fontFamily: {
        'retro': ['Georgia', 'serif'],
        'vintage': ['Times New Roman', 'serif']
      },
      backgroundImage: {
        'gradient-dinor': 'linear-gradient(135deg, #FF8C00 0%, #FFB84D 100%)',
        'gradient-brown': 'linear-gradient(45deg, #8B4513 0%, #CD853F 100%)'
      }
    }
  },
  plugins: []
}