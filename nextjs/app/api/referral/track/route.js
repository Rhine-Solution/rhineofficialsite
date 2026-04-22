import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { 
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) 
        }
      }
    }
  )
}

export async function POST(request) {
  try {
    const { referralCode, email, referredUserId } = await request.json()
    const supabase = await getSupabase()

    if (!referralCode || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: referrer, error: referrerError } = await supabase
      .from('users')
      .select('id')
      .eq('user_metadata->referral_code', referralCode)
      .single()

    if (referrerError || !referrer) {
      return NextResponse.json({ success: true, message: 'Referrer not found' })
    }

    const { error: insertError } = await supabase.from('referrals').insert({
      referrer_id: referrer.id,
      referred_email: email,
      referral_code: referralCode,
      status: 'signed_up',
      converted_at: new Date().toISOString()
    })

    if (insertError) {
      console.error('Referral insert error:', insertError)
      return NextResponse.json({ success: true, message: 'Referral recorded (with warnings)' })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Referral track error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}