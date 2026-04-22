import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { token, action } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 401 }
      )
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY

    if (!secretKey) {
      console.error('[Turnstile] TURNSTILE_SECRET_KEY not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const formData = new FormData()
    formData.append('secret', secretKey)
    formData.append('response', token)
    
    if (action) {
      formData.append('action', action)
    }

    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    formData.append('remoteip', clientIp)

    const verifyRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    )

    const outcome = await verifyRes.json()

    if (!outcome.success) {
      console.error('[Turnstile] Verification failed:', outcome['error-codes'])
      return NextResponse.json(
        { error: 'Verification failed', codes: outcome['error-codes'] },
        { status: 400 }
      )
    }

    if (action && outcome.action !== action) {
      console.error('[Turnstile] Action mismatch:', { expected: action, got: outcome.action })
      return NextResponse.json(
        { error: 'Action mismatch' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[Turnstile] Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Turnstile verification endpoint. Use POST with { token, action? }' },
    { status: 200 }
  )
}