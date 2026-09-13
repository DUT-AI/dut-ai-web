import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Force the runtime to nodejs to allow fs access
export const runtime = 'nodejs'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default async function Icon() {
  try {
    const logoData = await readFile(
      join(process.cwd(), 'public/static/images/logo.png')
    )
    const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

    return new ImageResponse(
      (
        <div
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20%', // The requested border radius
            padding: '2px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={28}
            height={28}
            alt="DUT AI Logo"
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
      ),
      {
        ...size,
      }
    )
  } catch (error) {
    // Fallback in case of error
    return new ImageResponse(
      (
        <div
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20%',
            color: '#1e3a8a',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          AI
        </div>
      ),
      { ...size }
    )
  }
}
