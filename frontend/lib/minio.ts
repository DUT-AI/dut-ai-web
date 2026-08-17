import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

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
  contentType: string
): Promise<{ url: string; key: string }> {
  const bucketName = process.env.MINIO_BUCKET_NAME || 'dut-ai-manager-prod'
  const s3 = getS3Client()

  // Clean filename and add timestamp
  const timestamp = Date.now()
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `uploads/${timestamp}-${cleanName}`

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'public-read',
  })

  await s3.send(command)

  const endpoint = process.env.MINIO_ENDPOINT || 'minio.dutai.site'
  const secure = process.env.MINIO_SECURE !== 'false'
  const protocol = secure ? 'https' : 'http'
  const cleanEndpoint = endpoint.replace(/^https?:\/\//, '').replace(/\/$/, '')

  const publicUrl = `${protocol}://${cleanEndpoint}/${bucketName}/${key}`

  return {
    url: publicUrl,
    key,
  }
}
