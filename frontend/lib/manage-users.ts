import { createClient } from 'redis'
import type { Member } from '@/lib/db/features/users/types'

const MANAGE_USERS_URL =
  process.env.DUT_MANAGER_USERS_URL || 'https://manage.dutai.io.vn/api/v1/users'
const HOT_CACHE_KEY = 'dut-ai-web:manage-users:v1'
const STALE_CACHE_KEY = 'dut-ai-web:manage-users:stale:v1'
const HOT_CACHE_SECONDS = 10 * 60
const STALE_CACHE_SECONDS = 24 * 60 * 60

type RedisClient = ReturnType<typeof createClient>

declare global {
  // eslint-disable-next-line no-var
  var manageUsersRedis: RedisClient | undefined
}

let refreshPromise: Promise<Member[]> | null = null
let memoryCache: { users: Member[]; expiresAt: number } | null = null

function normalizeStatus(status: unknown): string {
  return (
    String(status ?? '')
      .trim()
      .toLowerCase() || 'inactive'
  )
}

function normalizeUser(input: Record<string, unknown>): Member {
  const roleNames = Array.isArray(input.role_names)
    ? input.role_names.map(String).filter(Boolean)
    : []
  const roleIds = Array.isArray(input.role_ids)
    ? input.role_ids.map(Number).filter(Number.isFinite)
    : []

  return {
    id: Number(input.id),
    name: String(input.name || 'Thành viên DUT AI'),
    email: input.email ? String(input.email) : undefined,
    phone_number: input.phone_number ? String(input.phone_number) : undefined,
    status: normalizeStatus(input.status),
    role_id: roleIds[0],
    role_ids: roleIds,
    role_name: roleNames[0] || 'teammate',
    role_names: roleNames,
    avatar_url: input.avatar_url ? String(input.avatar_url) : undefined,
    discord_id: input.discord_id ? String(input.discord_id) : undefined,
  }
}

async function getRedis(): Promise<RedisClient | null> {
  const url = process.env.REDIS_URL
  if (!url) return null

  try {
    if (!global.manageUsersRedis) {
      const client = createClient({
        url,
        socket: { connectTimeout: 1500, reconnectStrategy: false },
      })
      client.on('error', (error) => {
        console.error('Redis connection error:', error instanceof Error ? error.message : error)
      })
      global.manageUsersRedis = client
    }

    if (!global.manageUsersRedis.isOpen) {
      await global.manageUsersRedis.connect()
    }

    return global.manageUsersRedis
  } catch (error) {
    console.error('Redis unavailable, using process cache:', error)
    if (global.manageUsersRedis && !global.manageUsersRedis.isOpen) {
      try {
        global.manageUsersRedis.destroy()
      } catch {
        // ignore if already destroyed/closed
      }
      global.manageUsersRedis = undefined
    }
    return null
  }
}

async function readRedis(key: string): Promise<Member[] | null> {
  const redis = await getRedis()
  if (!redis) return null

  try {
    const value = await redis.get(key)
    return value ? (JSON.parse(value) as Member[]) : null
  } catch (error) {
    console.error(`Failed to read Redis key ${key}:`, error)
    return null
  }
}

async function writeRedis(users: Member[]) {
  const redis = await getRedis()
  if (!redis) return

  const value = JSON.stringify(users)
  try {
    await Promise.all([
      redis.set(HOT_CACHE_KEY, value, { EX: HOT_CACHE_SECONDS }),
      redis.set(STALE_CACHE_KEY, value, { EX: STALE_CACHE_SECONDS }),
    ])
  } catch (error) {
    console.error('Failed to cache Manage users in Redis:', error)
  }
}

async function fetchManageUsers(): Promise<Member[]> {
  const apiKey = process.env.DUT_MANAGER_API_KEY
  if (!apiKey) {
    console.warn('DUT_MANAGER_API_KEY is not configured; returning an empty user list')
    return []
  }

  const response = await fetch(MANAGE_USERS_URL, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Manage users API failed with status ${response.status}`)
  }

  const payload = await response.json()
  const rows = Array.isArray(payload?.data) ? payload.data : []
  return rows
    .map((row: Record<string, unknown>) => normalizeUser(row))
    .filter((user: Member) => Number.isFinite(user.id))
}

export async function getManageUsers(options: { forceRefresh?: boolean } = {}): Promise<Member[]> {
  const forceRefresh = options.forceRefresh === true

  if (!forceRefresh && memoryCache && memoryCache.expiresAt > Date.now()) {
    return memoryCache.users
  }

  if (!forceRefresh) {
    const cached = await readRedis(HOT_CACHE_KEY)
    if (cached) {
      memoryCache = { users: cached, expiresAt: Date.now() + HOT_CACHE_SECONDS * 1000 }
      return cached
    }
  }

  if (!refreshPromise) {
    refreshPromise = fetchManageUsers()
      .then(async (users) => {
        memoryCache = { users, expiresAt: Date.now() + HOT_CACHE_SECONDS * 1000 }
        await writeRedis(users)
        return users
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  try {
    return await refreshPromise
  } catch (error) {
    const stale = await readRedis(STALE_CACHE_KEY)
    if (stale) {
      console.warn('Using stale Manage users cache after refresh failure')
      return stale
    }
    if (memoryCache) return memoryCache.users
    throw error
  }
}

export async function getManageUsersMap(): Promise<Map<number, Member>> {
  const users = await getManageUsers()
  return new Map(users.map((user) => [user.id, user]))
}
