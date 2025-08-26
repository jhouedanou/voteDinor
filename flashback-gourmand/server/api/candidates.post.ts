import { supabase } from '~/plugins/supabase.client'
import { v2 as cloudinary } from 'cloudinary'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// reCAPTCHA verification function
async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
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

export default defineEventHandler(async (event) => {
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