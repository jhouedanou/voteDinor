import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Configuration Cloudinary
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })
    
    // Lire les données du formulaire
    const form = await readMultipartFormData(event)
    if (!form) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Aucun fichier trouvé'
      })
    }
    
    // Trouver le fichier image
    const imageFile = form.find(item => item.name === 'photo')
    if (!imageFile) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Fichier photo manquant'
      })
    }
    
    // Vérifier le type de fichier
    if (!imageFile.type?.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le fichier doit être une image'
      })
    }
    
    // Vérifier la taille (max 2MB)
    if (imageFile.data.length > 2 * 1024 * 1024) {
      throw createError({
        statusCode: 400,
        statusMessage: 'L\'image ne doit pas dépasser 2MB'
      })
    }
    
    // Convertir Buffer en base64 pour Cloudinary
    const base64String = `data:${imageFile.type};base64,${imageFile.data.toString('base64')}`
    
    // Upload vers Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64String, {
      folder: 'concours-dinor', // Organisé dans un dossier
      transformation: [
        { width: 800, height: 600, crop: 'fit', quality: 'auto' }, // Optimisation automatique
        { fetch_format: 'auto' } // Format optimal selon le navigateur
      ],
      public_id: `candidate-${Date.now()}`, // ID unique
    })
    
    return {
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      message: 'Photo uploadée avec succès'
    }
    
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de l\'upload: ' + error.message
    })
  }
})