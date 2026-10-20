import fs from 'node:fs'
import path from 'node:path'

let cachedLogoDataUri: string | null = null

function resolveAssetPath(relativePath: string): string {
  const cwd = process.cwd()
  // Direct check relative to cwd (e.g. public/...)
  const directPath = path.resolve(cwd, relativePath)
  if (fs.existsSync(directPath)) return directPath

  // Check if cwd is repo root and asset is under frontend/
  const frontendPath = path.resolve(cwd, 'frontend', relativePath)
  if (fs.existsSync(frontendPath)) return frontendPath

  // Check relative to current directory (__dirname / import.meta)
  const relativeToLib = path.resolve(__dirname, '..', relativePath)
  if (fs.existsSync(relativeToLib)) return relativeToLib

  return directPath
}

/**
 * Returns the base64 data URI for the official club logo
 * Cached in memory for sub-millisecond access
 */
export function getClubLogoDataUri(): string {
  if (cachedLogoDataUri) return cachedLogoDataUri

  try {
    const logoPath = resolveAssetPath('public/static/images/logo.png')
    const buffer = fs.readFileSync(logoPath)
    cachedLogoDataUri = `data:image/png;base64,${buffer.toString('base64')}`
    return cachedLogoDataUri
  } catch (err) {
    console.error('Failed to load club logo asset:', err)
    // Fallback: minimal inline SVG robot placeholder
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="%232563EB"><circle cx="12" cy="12" r="10"/></svg>'
  }
}

/**
 * Returns a static TrueType font buffer for Satori font rendering if available.
 * Note: Variable fonts (containing `fvar` tables) are not supported by Satori's
 * font parser. When null is returned, ImageResponse uses its built-in engine.
 */
export function getBeVietnamProFontBuffer(): ArrayBuffer | null {
  return null
}
