import { ImageResponse } from 'next/og'

export const BLOG_THUMBNAIL_SIZE = {
  width: 1200,
  height: 630,
} as const

type BlogThumbnailOptions = {
  title: string
  authors?: string[]
}

const palette = {
  ink: '#111827',
  muted: '#667085',
  blue: '#2563EB',
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
  if (title.length > 110) return 48
  if (title.length > 75) return 56
  return 64
}

export function createBlogThumbnail({ title, authors = [] }: BlogThumbnailOptions) {
  const safeTitle = normalizeText(title, 'DUT AI Knowledge Hub', 150)
  const authorLine = normalizeText(authors.filter(Boolean).join('  ·  '), 'DUT AI Club', 80)

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
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          background: 'linear-gradient(132deg, #FFFFFF 0%, #F3F7FF 52%, #FFF6ED 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: 430,
          height: 430,
          right: -90,
          top: -145,
          display: 'flex',
          borderRadius: 999,
          background: 'linear-gradient(145deg, #7C3AED 0%, #2563EB 62%, #22D3EE 100%)',
          opacity: 0.96,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 250,
          height: 250,
          right: 180,
          bottom: -155,
          display: 'flex',
          borderRadius: 999,
          background: 'linear-gradient(145deg, #FFB347 0%, #FF6B6B 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 80,
          bottom: 74,
          width: 238,
          height: 140,
          display: 'flex',
          border: '2px solid rgba(37, 99, 235, 0.18)',
          borderRadius: 34,
          transform: 'rotate(-8deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 112,
          bottom: 101,
          width: 238,
          height: 140,
          display: 'flex',
          border: '2px solid rgba(255, 138, 0, 0.22)',
          borderRadius: 34,
          transform: 'rotate(-8deg)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 18,
          height: '100%',
          display: 'flex',
          background: `linear-gradient(180deg, ${palette.blue} 0%, #7C3AED 58%, ${palette.orange} 100%)`,
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '58px 72px 54px 86px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 18,
                color: '#FFFFFF',
                background: palette.blue,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: -1,
                boxShadow: '0 14px 28px rgba(37, 99, 235, 0.24)',
              }}
            >
              AI
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4 }}>
                DUT AI CLUB
              </span>
              <span
                style={{
                  marginTop: 2,
                  color: palette.muted,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 2.7,
                }}
              >
                AI KNOWLEDGE HUB
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 18px',
              borderRadius: 999,
              border: '1px solid rgba(37, 99, 235, 0.14)',
              background: 'rgba(255, 255, 255, 0.78)',
              color: palette.blue,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 1.5,
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                display: 'flex',
                borderRadius: 999,
                background: palette.orange,
              }}
            />
            BLOG
          </div>
        </div>

        <div
          style={{
            maxWidth: 880,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            paddingTop: 22,
            paddingBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: getTitleFontSize(safeTitle),
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: -2.5,
            }}
          >
            {safeTitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 20,
            borderTop: '1px solid rgba(17, 24, 39, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                background: '#E8EFFF',
                color: palette.blue,
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              D
            </div>
            <span style={{ color: palette.muted, fontSize: 18, fontWeight: 700 }}>
              {authorLine}
            </span>
          </div>
          <span style={{ color: palette.muted, fontSize: 17, fontWeight: 700 }}>
            clb.dutai.site
          </span>
        </div>
      </div>
    </div>,
    {
      ...BLOG_THUMBNAIL_SIZE,
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
      },
    }
  )
}
