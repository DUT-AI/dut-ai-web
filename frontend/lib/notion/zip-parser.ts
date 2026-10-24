import JSZip from 'jszip'

export interface ExtractedZipAsset {
  zipPath: string
  normalizedPath: string
  fileName: string
  mimeType: string
  buffer: Buffer
}

export interface ParsedNotionZip {
  title: string
  slug: string
  summary: string
  markdownContent: string
  primaryMdPath: string
  images: ExtractedZipAsset[]
}

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

/**
 * Converts Vietnamese unicode string to clean URL-friendly kebab-case slug.
 */
export function slugifyVietnamese(str: string): string {
  if (!str) return ''

  let slug = str.trim().toLowerCase()

  // Transliterate accented Vietnamese characters
  slug = slug.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
  slug = slug.replace(/[èéẹẻẽêềếệểễ]/g, 'e')
  slug = slug.replace(/[ìíịỉĩ]/g, 'i')
  slug = slug.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
  slug = slug.replace(/[ùúụủũưừứựửữ]/g, 'u')
  slug = slug.replace(/[ỳýỵỷỹ]/g, 'y')
  slug = slug.replace(/đ/g, 'd')

  // Remove combining diacritical marks
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Replace special characters and spaces with hyphen
  slug = slug.replace(/[^a-z0-9]+/g, '-')

  // Remove leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '')

  return slug
}

/**
 * Strips Notion's 32-character hexadecimal page hash from a filename.
 * Example: "My Page 3f798e2c5a1d806cbaebc06b09601803.md" -> "My Page"
 */
export function cleanNotionPageTitle(filename: string): string {
  const base = filename.split(/[/\\]/).pop() || filename
  const withoutExt = base.replace(/\.md$/i, '')
  // Match 32 hex chars preceded by space or %20
  return withoutExt.replace(/(?:\s+|%20)[0-9a-f]{32}$/i, '').trim()
}

/**
 * Extracts a readable title from markdown `# Heading` or falls back to cleaned filename.
 */
export function extractTitle(filename: string, content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('# ') && !trimmed.startsWith('##')) {
      const heading = trimmed.replace(/^#\s+/, '').trim()
      if (heading) {
        return heading
      }
    }
  }

  const cleanedFromFilename = cleanNotionPageTitle(filename)
  return cleanedFromFilename || 'Bài viết mới'
}

/**
 * Extracts the first meaningful text paragraph (<= 300 chars) as a summary.
 */
export function extractSummary(content: string): string {
  const paragraphs = content.split(/\n\s*\n/)

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim()
    if (!trimmed) continue
    // Skip headings
    if (trimmed.startsWith('#')) continue
    // Skip solo image lines
    if (/^!\[.*?\]\(.*?\)$/.test(trimmed)) continue
    // Skip tables or horizontal dividers
    if (trimmed.startsWith('|') || trimmed.startsWith('---') || trimmed.startsWith('***')) continue
    // Skip code fences
    if (trimmed.startsWith('```')) continue

    // Clean inline markdown syntax
    const cleaned = trimmed
      .replace(/!\[.*?\]\(.*?\)/g, '') // remove images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // link text
      .replace(/[*_`~#]/g, '') // formatting
      .replace(/\s+/g, ' ')
      .trim()

    if (cleaned.length > 20) {
      if (cleaned.length <= 280) {
        return cleaned
      }
      return `${cleaned.slice(0, 277)}...`
    }
  }

  return ''
}

/**
 * Parses an in-memory Notion export ZIP archive.
 */
export async function parseNotionZip(buffer: Buffer): Promise<ParsedNotionZip> {
  const zip = await JSZip.loadAsync(buffer)

  // Find all .md files (exclude internal __MACOSX and hidden files)
  const mdEntries = Object.entries(zip.files).filter(([path, file]: [string, any]) => {
    return !file.dir && path.endsWith('.md') && !path.includes('__MACOSX') && !path.startsWith('.')
  })

  if (mdEntries.length === 0) {
    throw new Error('File ZIP không chứa tệp nội dung Markdown (.md) hợp lệ từ Notion.')
  }

  // Pick the primary markdown file (prefer shortest path or highest word count)
  let primaryPath = mdEntries[0][0]
  let primaryFile: any = mdEntries[0][1]

  if (mdEntries.length > 1) {
    // Sort by path depth ascending
    mdEntries.sort((a, b) => a[0].split('/').length - b[0].split('/').length)
    primaryPath = mdEntries[0][0]
    primaryFile = mdEntries[0][1]
  }

  const markdownContent = await primaryFile.async('text')
  const title = extractTitle(primaryPath, markdownContent)
  const slug = slugifyVietnamese(title)
  const summary = extractSummary(markdownContent)

  // Find all image entries
  const images: ExtractedZipAsset[] = []
  for (const [zipPath, file] of Object.entries(zip.files) as [string, any][]) {
    if (file.dir || zipPath.includes('__MACOSX') || zipPath.startsWith('.')) {
      continue
    }

    const dotIndex = zipPath.lastIndexOf('.')
    if (dotIndex === -1) continue
    const ext = zipPath.substring(dotIndex).toLowerCase()

    const mimeType = MIME_MAP[ext]
    if (!mimeType) continue

    const arrayBuffer = await file.async('nodebuffer')
    const fileName = zipPath.split(/[/\\]/).pop() || 'image'

    images.push({
      zipPath,
      normalizedPath: zipPath.replace(/\\/g, '/'),
      fileName,
      mimeType,
      buffer: arrayBuffer,
    })
  }

  return {
    title,
    slug,
    summary,
    markdownContent,
    primaryMdPath: primaryPath,
    images,
  }
}

/**
 * Rewrites relative image paths in Markdown to persistent public MinIO URLs.
 * Matches both standard Markdown `![alt](path)` and HTML `<img src="path">`.
 */
export function rewriteMarkdownImageUrls(
  markdown: string,
  urlMapping: Map<string, string>
): string {
  let result = markdown

  // 1. Rewrite Markdown image syntax: ![alt](url "title")
  result = result.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (match, alt, rawUrl, titleAttr) => {
    if (/^(?:https?:|\/\/|data:)/i.test(rawUrl)) {
      return match
    }

    const matchedUrl = findMatchingMinIOUrl(rawUrl, urlMapping)
    if (!matchedUrl) {
      return match
    }

    const titlePart = titleAttr ? ` "${titleAttr}"` : ''
    return `![${alt}](${matchedUrl}${titlePart})`
  })

  // 2. Rewrite HTML <img> tags
  result = result.replace(/<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (match, before, rawUrl, after) => {
    if (/^(?:https?:|\/\/|data:)/i.test(rawUrl)) {
      return match
    }

    const matchedUrl = findMatchingMinIOUrl(rawUrl, urlMapping)
    if (!matchedUrl) {
      return match
    }

    return `<img ${before}src="${matchedUrl}"${after}>`
  })

  return result
}

/**
 * Helper to match a raw relative URL from Markdown against our uploaded asset map.
 */
function findMatchingMinIOUrl(rawUrl: string, urlMapping: Map<string, string>): string | null {
  try {
    const decodedUrl = decodeURIComponent(rawUrl).replace(/\\/g, '/')

    // 1. Direct match with decoded URL
    if (urlMapping.has(decodedUrl)) {
      return urlMapping.get(decodedUrl)!
    }

    // 2. Suffix match on zipPath (e.g. "Private & Shared/Folder/image.png" ends with "Folder/image.png")
    for (const [key, minioUrl] of urlMapping.entries()) {
      if (key.endsWith(decodedUrl) || decodedUrl.endsWith(key)) {
        return minioUrl
      }
    }

    // 3. Fallback: match by filename
    const baseName = decodedUrl.split('/').pop()
    if (baseName) {
      for (const [key, minioUrl] of urlMapping.entries()) {
        const keyBase = key.split('/').pop()
        if (keyBase === baseName) {
          return minioUrl
        }
      }
    }
  } catch (err) {
    console.error('Error matching image URL:', rawUrl, err)
  }

  return null
}
