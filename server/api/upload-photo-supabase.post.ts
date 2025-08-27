import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody(event)
    const { photo_data, filename } = body
    
    if (!photo_data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Aucune photo fournie'
      })
    }
    
    // Extraire les données de l'image base64
    const matches = photo_data.match(/^data:image\/([a-zA-Z]*);base64,(.*)$/)
    if (!matches || matches.length !== 3) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format d\'image invalide'
      })
    }
    
    const imageType = matches[1] // jpg, png, etc.
    const imageData = matches[2]
    const buffer = Buffer.from(imageData, 'base64')
    
    // Vérifier la taille (2MB max)
    const maxSize = 2 * 1024 * 1024
    if (buffer.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: `Image trop grande. Taille max: 2MB, actuelle: ${(buffer.length / 1024 / 1024).toFixed(1)}MB`
      })
    }
    
    // Générer un nom de fichier unique
    const fileId = randomUUID()
    const fileName = `candidates/${fileId}.${imageType}`
    
    // Vérifier les variables d'environnement
    if (!config.supabaseStorageEndpoint || !config.supabaseStorageAccessKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration Supabase Storage manquante'
      })
    }
    
    // Configuration S3 pour Supabase Storage
    const s3Client = new S3Client({
      endpoint: config.supabaseStorageEndpoint,
      region: config.supabaseStorageRegion || 'eu-west-2',
      credentials: {
        accessKeyId: config.supabaseStorageAccessKey,
        secretAccessKey: config.supabaseStorageSecretKey,
      },
      forcePathStyle: true // Obligatoire pour Supabase Storage
    })
    
    // Upload vers Supabase Storage
    const uploadParams = {
      Bucket: config.supabaseStorageBucket,
      Key: fileName,
      Body: buffer,
      ContentType: `image/${imageType}`,
      ACL: 'public-read', // Rendre l'image accessible publiquement
      Metadata: {
        'uploaded-by': 'dinor-contest',
        'upload-date': new Date().toISOString()
      }
    }
    
    const command = new PutObjectCommand(uploadParams)
    await s3Client.send(command)
    
    // Construire l'URL publique
    const publicUrl = `${config.supabaseStorageEndpoint.replace('/storage/v1/s3', '')}/storage/v1/object/public/${config.supabaseStorageBucket}/${fileName}`
    
    return {
      success: true,
      url: publicUrl,
      filename: fileName,
      size: buffer.length,
      type: imageType
    }
    
  } catch (error) {
    console.error('Erreur upload Supabase Storage:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || `Erreur upload: ${error.message}`
    })
  }
})