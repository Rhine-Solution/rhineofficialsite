'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../components/AuthProvider'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Copy, Check, Users, Gift, TrendingUp } from 'lucide-react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function ReferralPage() {
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const [referralCode, setReferralCode] = useState('')
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReferralData()
    }
  }, [isAuthenticated, user])

  const fetchReferralData = async () => {
    try {
      setLoading(true)
      
      const userRes = await fetch(
        `${SUPABASE_URL}/rest/v1/users?id=eq.${user.id}&select=user_metadata`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const userData = await userRes.json()
      if (userData[0]?.user_metadata?.referral_code) {
        setReferralCode(userData[0].user_metadata.referral_code)
      }

      const referralsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/referrals?referrer_id=eq.${user.id}&order=created_at.desc`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const referralsData = await referralsRes.json()
      setReferrals(Array.isArray(referralsData) ? referralsData : [])
    } catch (err) {
      console.error('Error fetching referral data:', err)
    } finally {
      setLoading(false)
    }
  }

  const referralLink = `https://rhinesolution.com/register?ref=${referralCode}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const stats = {
    total: referrals.length,
    signedUp: referrals.filter(r => r.status !== 'pending').length,
    converted: referrals.filter(r => r.status === 'converted' || r.reward_earned).length
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Referral Program</h1>
        <p className="text-zinc-400 mb-8">Invite friends and earn rewards</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-zinc-400">Total Referrals</p>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="p-6 text-center">
              <Check className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <p className="text-3xl font-bold">{stats.signedUp}</p>
              <p className="text-sm text-zinc-400">Signed Up</p>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="p-6 text-center">
              <Gift className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <p className="text-3xl font-bold">{stats.converted}</p>
              <p className="text-sm text-zinc-400">Converted</p>
            </CardContent>
          </Card>
        </div>

        <Card className="hover-lift mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-4">Your Referral Link</h2>
            <p className="text-zinc-400 mb-4">Share this link with friends to earn rewards</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300"
              />
              <Button onClick={copyToClipboard} className="px-6">
                {copied ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copy
                  </span>
                )}
              </Button>
            </div>
            <p className="text-sm text-zinc-500 mt-3">
              Your referral code: <span className="font-mono text-indigo-400">{referralCode}</span>
            </p>
          </CardContent>
        </Card>

        {referrals.length > 0 && (
          <Card className="hover-lift">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Referral History</h2>
              <div className="space-y-3">
                {referrals.map((ref) => (
                  <div
                    key={ref.id}
                    className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl"
                  >
                    <div>
                      <p className="text-zinc-300">{ref.referred_email}</p>
                      <p className="text-sm text-zinc-500">
                        {new Date(ref.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        ref.status === 'converted' || ref.reward_earned
                          ? 'bg-green-500/20 text-green-400'
                          : ref.status === 'signed_up'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {ref.status === 'converted' || ref.reward_earned
                        ? 'Converted'
                        : ref.status === 'signed_up'
                        ? 'Signed Up'
                        : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}