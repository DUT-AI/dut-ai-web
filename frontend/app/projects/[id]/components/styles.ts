import type React from 'react'

/**
 * Use `glassClass` as className instead of `style={glass}` on elements.
 * The actual CSS is defined in the project detail page's <style> tag,
 * switching between light and dark mode automatically via `.dark` prefix.
 */
export const glassClass = 'proj-glass'

/** Plus Jakarta Sans font shorthand. */
export const jakarta: React.CSSProperties = { fontFamily: 'var(--font-jakarta)' }
