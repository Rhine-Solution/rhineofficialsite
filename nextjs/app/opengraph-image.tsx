import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Rhine Official - Tech Solutions for Modern Business'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 50%)',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Logo and Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 60px rgba(99, 102, 241, 0.4)',
            }}
          >
            <span
              style={{
                color: 'white',
                fontSize: 40,
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
              }}
            >
              R
            </span>
          </div>
        </div>

        {/* Main Text */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: 16,
            fontFamily: 'sans-serif',
          }}
        >
          Rhine Official
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#94a3b8',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          Tech Solutions for Modern Business
        </div>

        {/* Bottom badges */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            gap: 12,
          }}
        >
          <div
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: 14,
              fontFamily: 'sans-serif',
            }}
          >
            Web Development
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'rgba(6, 182, 212, 0.2)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#67e8f9',
              fontSize: 14,
              fontFamily: 'sans-serif',
            }}
          >
            IT Solutions
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#6ee7b7',
              fontSize: 14,
              fontFamily: 'sans-serif',
            }}
          >
            Cloud Services
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}