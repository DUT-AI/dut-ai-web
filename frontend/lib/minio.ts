import { randomUUID } from 'node:crypto'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const EVENT_IMAGE_FOLDERS = new Set(['events', 'moments'])

function getBucketName() {
  return process.env.MINIO_BUCKET_NAME || 'dut-ai-manager-prod'
}

function getPublicBaseUrl() {
  const endpoint = process.env.MINIO_ENDPOINT || 'minio.dutai.site'
  const secure = process.env.MINIO_SECURE !== 'false'
  const protocol = secure ? 'https' : 'http'
  const fallback = endpoint.startsWith('http') ? endpoint : `${protocol}://${endpoint}`
  return (process.env.MINIO_PUBLIC_URL || fallback).replace(/\/$/, '')
}

function getS3Client() {
  const endpoint = process.env.MINIO_ENDPOINT || 'minio.dutai.site'
  const accessKeyId = process.env.MINIO_ACCESS_KEY || ''
  const secretAccessKey = process.env.MINIO_SECRET_KEY || ''
  const secure = process.env.MINIO_SECURE !== 'false'

  const protocol = secure ? 'https' : 'http'
  const fullEndpoint = endpoint.startsWith('http') ? endpoint : `${protocol}://${endpoint}`

  return new S3Client({
    endpoint: fullEndpoint,
    region: 'us-east-1',
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  })
}

export async function uploadToMinIO(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder = 'uploads'
): Promise<{ url: string; key: string }> {
  const bucketName = getBucketName()
  const s3 = getS3Client()

  const safeFolder = /^[a-z0-9][a-z0-9/_-]*$/i.test(folder) ? folder : 'uploads'
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_') || 'image'
  const key = `${safeFolder}/${randomUUID()}-${cleanName}`

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  })

  await s3.send(command)

  const encodedKey = key.split('/').map(encodeURIComponent).join('/')
  const publicUrl = `${getPublicBaseUrl()}/${encodeURIComponent(bucketName)}/${encodedKey}`

  return {
    url: publicUrl,
    key,
  }
}

function getManagedEventImageKey(url: string): string | null {
  try {
    const publicBase = new URL(`${getPublicBaseUrl()}/`)
    const objectUrl = new URL(url)
    if (objectUrl.origin !== publicBase.origin) return null

    const basePath = publicBase.pathname.replace(/\/$/, '')
    const bucketPrefix = `${basePath}/${encodeURIComponent(getBucketName())}/`
    if (!objectUrl.pathname.startsWith(bucketPrefix)) return null

    const encodedKey = objectUrl.pathname.slice(bucketPrefix.length)
    const key = encodedKey.split('/').map(decodeURIComponent).join('/')
    const [folder] = key.split('/')
    return EVENT_IMAGE_FOLDERS.has(folder) ? key : null
  } catch {
    return null
  }
}

export async function deleteEventImageFromMinIO(url: string): Promise<boolean> {
  const key = getManagedEventImageKey(url)
  if (!key) return false

  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    })
  )
  return true
}
