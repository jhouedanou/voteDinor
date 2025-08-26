import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  
  // Configuration Cloudinary
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
  })

  // reCAPTCHA verification function
  async function verifyRecaptcha(token: string) {
    const secretKey = config.recaptchaSecretKey
    if (!secretKey) {
      throw new Error('reCAPTCHA secret key not configured')
    }
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`
    })
    
    const data = await response.json()
    return data.success && data.score > 0.5
  }

  try {
    const body = await readBody(event)
    const { nom, prenom, whatsapp, photo_data, recaptcha_token } = body
    
    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptcha_token)
    if (!recaptchaValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Vérification anti-spam échouée'
      })
    }
    
    // Validate Ivorian phone number
    if (!whatsapp.startsWith('+225')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Numéro WhatsApp ivoirien requis'
      })
    }
    
    // Upload photo to Cloudinary
    let photo_url = ''
    let photo_filename = ''
    
    if (photo_data) {
      try {
        const uploadResult = await cloudinary.uploader.upload(photo_data, {
          folder: 'concours-dinor',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        })
        
        photo_url = uploadResult.secure_url
        photo_filename = uploadResult.public_id
      } catch (uploadError) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Erreur upload photo: ' + uploadError.message
        })
      }
    }
    
    // Save candidate to Supabase
    const { data: candidate, error } = await supabase
      .from('candidates')
      .insert({
        nom: nom.trim(),
        prenom: prenom.trim(),
        whatsapp: whatsapp.trim(),
        photo_url,
        photo_filename,
        votes_count: 0,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return { 
      success: true, 
      id: candidate.id,
      message: 'Inscription réussie ! Votre candidature sera validée sous 24h.'
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de l\'inscription: ' + error.message
    })
  }
})