'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Card, { CardContent, CardTitle } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input, { Textarea } from '../../../components/ui/Input'
import { useAuth } from '../../../components/AuthProvider'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function BookAppointmentPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.date || !formData.time) {
      setError('Please fill in all required fields')
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setLoading(true)
    setError('')

    const datetime = `${formData.date}T${formData.time}:00`

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/appointments`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          datetime: datetime,
          duration_minutes: 60,
          status: 'pending'
        })
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/appointments')
        }, 2000)
      } else {
        throw new Error('Failed to book appointment')
      }
    } catch (err) {
      setError(err.message || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Sign in required</h2>
            <p className="text-zinc-400 mb-4">Please sign in to book an appointment.</p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-zinc-400 hover:text-white">Home</Link>
          <span className="text-zinc-600">/</span>
          <Link href="/appointments" className="text-zinc-400 hover:text-white">Appointments</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-white">Book</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-zinc-400 mb-8">Schedule a time with us.</p>

        {success ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2">Appointment Booked!</h2>
              <p className="text-zinc-400">Redirecting to your appointments...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Appointment Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Consultation, Design Review"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell us about what you need..."
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Booking...' : 'Book Appointment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}