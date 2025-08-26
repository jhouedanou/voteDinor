export default defineEventHandler(async (event) => {
  try {
    const { token } = await readBody(event)
    const config = useRuntimeConfig()
    
    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token reCAPTCHA manquant'
      })
    }
    
    if (!config.recaptchaSecretKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Clé secrète reCAPTCHA non configurée'
      })
    }
    
    // Vérifier le token avec Google reCAPTCHA
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        secret: config.recaptchaSecretKey,
        response: token
      })
    })
    
    const data = await response.json()
    
    return {
      success: data.success,
      score: data.score || 0,
      action: data.action || 'unknown'
    }
    
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la vérification reCAPTCHA: ' + error.message
    })
  }
})