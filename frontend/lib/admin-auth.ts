import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'dut_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecretKey(): string {
  return process.env.SECRET_KEY || 'dut-ai-admin-secret-super-key-2026'
}

function signToken(username: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000
  const payload = `${username}:${expiresAt}`
  const signature = crypto
    .createHmac('sha256', getSecretKey())
    .update(payload)
    .digest('hex')
  return Buffer.from(`${payload}:${signature}`).toString('base64')
}

export function verifyToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [username, expiresAtStr, signature] = decoded.split(':')
    if (!username || !expiresAtStr || !signature) return { valid: false }

    const expiresAt = parseInt(expiresAtStr, 10)
    if (isNaN(expiresAt) || Date.now() > expiresAt) return { valid: false }

    const payload = `${username}:${expiresAt}`
    const expectedSig = crypto
      .createHmac('sha256', getSecretKey())
      .update(payload)
      .digest('hex')

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: true, username }
    }
  } catch {
    return { valid: false }
  }
  return { valid: false }
}

export async function createAdminSession(username: string) {
  const token = signToken(username)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAdminSession(): Promise<{ authenticated: boolean; username?: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return { authenticated: false }

  const verification = verifyToken(token)
  if (!verification.valid) return { authenticated: false }

  return { authenticated: true, username: verification.username }
}
