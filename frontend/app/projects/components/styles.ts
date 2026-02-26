import type React from 'react'

/** Glassmorphism card style — shared across all project sub-components. */
export const glass: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.15)',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  boxShadow: 'inset 0 0 25px 1px rgba(255,255,255,0.15)',
}

/** Plus Jakarta Sans font shorthand. */
export const jakarta: React.CSSProperties = { fontFamily: 'var(--font-jakarta)' }
