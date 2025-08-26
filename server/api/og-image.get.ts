export default defineEventHandler(async (event) => {
  // Rediriger vers la page og-image
  return sendRedirect(event, '/og-image', 302)
})
