import { isReservedUsername } from './reserved-usernames'

/**
 * Removes Vietnamese diacritics/accents from a string.
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

/**
 * Validates a username according to the regex: ^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$ (length 3-30)
 */
export function isValidUsernameFormat(username: string): boolean {
  if (!username || username.length < 3 || username.length > 30) {
    return false
  }
  const regex = /^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$/
  return regex.test(username)
}

/**
 * Converts a display name or email to a URL-safe initial slug.
 */
export function slugifyUsername(input: string, maxLen = 24): string {
  const normalized = removeVietnameseAccents(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const truncated = normalized.slice(0, maxLen).replace(/-+$/, '')
  return truncated || 'member'
}

/**
 * Generates an initial unique username given a name, optional email, and numeric user ID.
 */
export function generateInitialUsername(name: string, email?: string, userId?: number): string {
  let base = ''

  if (name && name.trim()) {
    base = slugifyUsername(name)
  }

  if ((!base || base === 'member') && email) {
    const emailPrefix = email.split('@')[0]
    base = slugifyUsername(emailPrefix)
  }

  if (!base || base.length < 3) {
    base = `member-${userId ?? Math.floor(Math.random() * 1000)}`
  }

  // If base clashes with reserved names or is short, append user ID
  if (isReservedUsername(base) && userId !== undefined) {
    return `${base}-${userId}`
  }

  return base
}
