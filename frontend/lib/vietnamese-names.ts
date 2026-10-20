/**
 * Curated accessible palette for author avatar fallback badges
 * Excludes violet/purple tones, maintains high contrast against white text
 */
export const AVATAR_COLOR_PALETTE = [
  '#2563EB', // Blue
  '#0D9488', // Teal
  '#D97706', // Amber
  '#DC2626', // Red
  '#059669', // Emerald
  '#0284C7', // Sky
  '#E11D48', // Rose
  '#EA580C', // Orange
] as const

/**
 * Extracts the initial letter of a person's Vietnamese first name (tên gọi).
 * Vietnamese naming convention: Họ + Tên đệm + Tên gọi (e.g. "Huỳnh Phước Nguyên" -> "Nguyên" -> "N")
 *
 * @param fullName Full name of author
 * @returns 1-character uppercase initial string
 */
export function getVietnameseInitial(fullName: string | null | undefined): string {
  if (!fullName) return 'D'
  const trimmed = fullName.trim()
  if (!trimmed) return 'D'

  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'D'

  // The final token is the first name (tên gọi) in Vietnamese convention
  const firstName = parts[parts.length - 1]
  // Extract the first unicode character, uppercased
  const firstChar = Array.from(firstName)[0] || 'D'
  return firstChar.toUpperCase()
}

/**
 * Generates a deterministic avatar background color based on author's name
 * Ensures the same author consistently receives the same badge color
 */
export function getAvatarColor(name: string | null | undefined): string {
  if (!name) return AVATAR_COLOR_PALETTE[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  const index = Math.abs(hash) % AVATAR_COLOR_PALETTE.length
  return AVATAR_COLOR_PALETTE[index]
}
