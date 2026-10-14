import { ImageResponse } from 'next/og'
import siteMetadata from '@/data/siteMetadata'
import { getClubLogoDataUri, getBeVietnamProFontBuffer } from './blog-thumbnail-assets'
import { getVietnameseInitial, getAvatarColor } from './vietnamese-names'
import {
  BLOG_THUMBNAIL_SIZE,
  type BlogAuthorInfo,
  type BlogThumbnailOptions,
} from './blog-thumbnail-types'

export { BLOG_THUMBNAIL_SIZE }
export type { BlogAuthorInfo, BlogThumbnailOptions }

const SITE_HOSTNAME = new URL(siteMetadata.siteUrl).hostname

const palette = {
  ink: '#0F172A',
  muted: '#334155',
  blue: '#2563EB',
  blueDark: '#1D4ED8',
  cyan: '#06B6D4',
  orange: '#FF8A00',
  paper: '#F8FAFC',
}

function normalizeText(value: string, fallback: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) return fallback
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

function getTitleFontSize(title: string) {
  if (title.length > 100) return 52
  if (title.length > 65) return 62
  return 70
}

function normalizeAuthors(rawAuthors: Array<BlogAuthorInfo | string> = []): BlogAuthorInfo[] {
  if (!rawAuthors || rawAuthors.length === 0) {
    return [{ name: 'DUT AI Club', avatarUrl: null }]
  }

  const normalized: BlogAuthorInfo[] = []
  for (const item of rawAuthors) {
    if (typeof item === 'string') {
      const trimmed = item.trim()
      if (trimmed) normalized.push({ name: trimmed, avatarUrl: null })
    } else if (item && typeof item === 'object' && item.name) {
      const trimmed = item.name.trim()
      if (trimmed) normalized.push({ name: trimmed, avatarUrl: item.avatarUrl || null })
    }
  }

  return normalized.length > 0 ? normalized : [{ name: 'DUT AI Club', avatarUrl: null }]
}

export function createBlogThumbnail({
  title,
  authors: rawAuthors = [],
  siteDomain = SITE_HOSTNAME,
  category = 'BLOG',
}: BlogThumbnailOptions) {
  const safeTitle = normalizeText(title, 'DUT AI Knowledge Hub', 150)
  const authors = normalizeAuthors(rawAuthors)
  const authorNames = normalizeText(authors.map((a) => a.name).join('  ·  '), 'DUT AI Club', 65)
  const logoDataUri = getClubLogoDataUri()
  const fontData = getBeVietnamProFontBuffer()

  // Display max 3 avatar icons, with overflow badge if > 3
  const visibleAvatars = authors.slice(0, 3)
  const overflowCount = authors.length > 3 ? authors.length - 3 : 0

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: palette.paper,
        color: palette.ink,
        fontFamily: fontData ? '"Be Vietnam Pro", sans-serif' : 'Arial, sans-serif',
      }}
    >
      {/* Dynamic background lighting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 48%, #EFF6FF 100%)',
        }}
      />

      {/* Decorative gradient sphere (Kept at original top-right position) */}
      <div
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          right: -60,
          top: -90,
          display: 'flex',
          borderRadius: 999,
          background: 'linear-gradient(145deg, #0284C7 0%, #2563EB 50%, #06B6D4 100%)',
          opacity: 0.92,
        }}
      />

      {/* Decorative bottom-right warm sphere */}
      <div
        style={{
          position: 'absolute',
          width: 240,
          height: 240,
          right: 250,
          bottom: -190,
          display: 'flex',
          borderRadius: 999,
          background: 'linear-gradient(145deg, #F59E0B 0%, #EA580C 100%)',
          opacity: 0.85,
        }}
      />

      {/* Modern floating backdrop geometry */}
      <div
        style={{
          position: 'absolute',
          right: 80,
          bottom: 74,
          width: 240,
          height: 140,
          display: 'flex',
          border: '2.5px solid rgba(37, 99, 235, 0.22)',
          borderRadius: 36,
          transform: 'rotate(-8deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 114,
          bottom: 104,
          width: 240,
          height: 140,
          display: 'flex',
          border: '2.5px solid rgba(255, 138, 0, 0.25)',
          borderRadius: 36,
          transform: 'rotate(-8deg)',
        }}
      />

      {/* Brand accent left border bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 22,
          height: '100%',
          display: 'flex',
          background:
            'linear-gradient(180deg, #2358D4 0%, #355CED 10%, #4455ED 20%, #534DED 30%, #6146ED 40%, #7040EE 50%, #823EE3 60%, #A150AC 70%, #C1626F 80%, #E07637 90%, #E27C04 100%)',
        }}
      />

      {/* Content wrapper */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '52px 76px 48px 88px',
        }}
      >
        {/* Top bar: Official Club Logo + Club title & Category badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Official Club Logo */}
            <div
              style={{
                width: 74,
                height: 74,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 22,
                background: '#FFFFFF',
                border: '2px solid rgba(226, 232, 240, 0.95)',
                overflow: 'hidden',
                padding: 4,
              }}
            >
              <img
                src={logoDataUri}
                alt="DUT AI Club Logo"
                width={64}
                height={64}
                style={{
                  objectFit: 'contain',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5, color: palette.ink }}
              >
                DUT AI CLUB
              </span>
              <span
                style={{
                  marginTop: 3,
                  color: '#64748B',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 2.8,
                }}
              >
                AI KNOWLEDGE HUB
              </span>
            </div>
          </div>

          {/* Category Pill: Repositioned to center naturally within the blue bubble */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '13px 26px',
              borderRadius: 999,
              border: '2px solid rgba(37, 99, 235, 0.22)',
              background: 'rgba(255, 255, 255, 0.96)',
              color: palette.blue,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1.6,
              marginRight: -40,
              marginTop: -16,
            }}
          >
            <span
              style={{
                width: 11,
                height: 11,
                display: 'flex',
                borderRadius: 999,
                background: palette.orange,
              }}
            />
            {category}
          </div>
        </div>

        {/* Center: Blog Title with guaranteed safe area (never clipped by decorative shapes) */}
        <div
          style={{
            maxWidth: 820,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: getTitleFontSize(safeTitle),
              lineHeight: 1.18,
              fontWeight: 800,
              letterSpacing: -1.8,
              color: palette.ink,
            }}
          >
            {safeTitle}
          </div>
        </div>

        {/* Footer: Multi-Author Avatars + Author Names + Site Hostname */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Multi-Author Avatar Cluster */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {visibleAvatars.map((author, index) => {
                const initial = getVietnameseInitial(author.name)
                const bgColor = getAvatarColor(author.name)
                return (
                  <div
                    key={`${author.name}-${index}`}
                    style={{
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 999,
                      border: '2.5px solid #FFFFFF',
                      marginLeft: index > 0 ? -14 : 0,
                      overflow: 'hidden',
                      background: bgColor,
                      color: '#FFFFFF',
                      fontSize: 20,
                      fontWeight: 800,
                    }}
                  >
                    {author.avatarUrl ? (
                      <img
                        src={author.avatarUrl}
                        alt={author.name}
                        width={48}
                        height={48}
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    ) : (
                      initial
                    )}
                  </div>
                )
              })}

              {overflowCount > 0 && (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 999,
                    border: '2.5px solid #FFFFFF',
                    marginLeft: -14,
                    background: '#64748B',
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  +{overflowCount}
                </div>
              )}
            </div>

            <span style={{ color: palette.muted, fontSize: 22, fontWeight: 700 }}>
              {authorNames}
            </span>
          </div>

          <span
            style={{
              color: palette.muted,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 0.5,
              position: "relative",
              bottom: -40,
            }}
          >
            {siteDomain}
          </span>
        </div>
      </div>
    </div>,
    {
      ...BLOG_THUMBNAIL_SIZE,
      fonts: fontData
        ? [
          {
            name: 'Be Vietnam Pro',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ]
        : undefined,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
