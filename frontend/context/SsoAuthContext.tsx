'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { DutAiUserProfile, SSO_LOGIN_URL } from '@/lib/auth-sso'
import { hasContentAccess } from '@/lib/enums/roles'

export interface SsoAuthContextValue {
  user: DutAiUserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  isContentManager: boolean
  error: string | null
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasPermission: (permission: string) => boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const SsoAuthContext = createContext<SsoAuthContextValue | null>(null)

export function SsoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DutAiUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function initializeSession() {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!isCancelled && res.ok) {
          const json = await res.json()
          if (json?.is_success && json?.data) {
            setUser(json.data)
            setIsLoading(false)
            return
          }
        }
        if (!isCancelled) {
          setUser(null)
          setIsLoading(false)
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err?.message || 'Failed to fetch session')
          setUser(null)
          setIsLoading(false)
        }
      }
    }

    initializeSession()
    return () => {
      isCancelled = true
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        cache: 'no-store',
      })
      if (res.ok) {
        const json = await res.json()
        if (json?.is_success && json?.data) {
          setUser(json.data)
          return
        }
      }
      setUser(null)
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch session')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user?.role_names) return false
      const lower = role.toLowerCase()
      return user.role_names.some((r) => r.toLowerCase() === lower)
    },
    [user]
  )

  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      if (!user?.role_names || roles.length === 0) return false
      const userRoles = user.role_names.map((r) => r.toLowerCase())
      return roles.some((r) => userRoles.includes(r.toLowerCase()))
    },
    [user]
  )

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user?.permissions) return false
      return user.permissions.includes(permission)
    },
    [user]
  )

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error('[SSO] Logout API error:', err)
    } finally {
      setUser(null)
      window.location.assign(SSO_LOGIN_URL)
    }
  }, [])

  const contextValue = useMemo<SsoAuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      isContentManager: hasContentAccess(user),
      error,
      hasRole,
      hasAnyRole,
      hasPermission,
      refresh,
      logout,
    }),
    [user, isLoading, error, hasRole, hasAnyRole, hasPermission, refresh, logout]
  )

  return <SsoAuthContext.Provider value={contextValue}>{children}</SsoAuthContext.Provider>
}

export function useSsoAuth(): SsoAuthContextValue {
  const context = useContext(SsoAuthContext)
  if (!context) {
    throw new Error('useSsoAuth must be used within an SsoAuthProvider')
  }
  return context
}
