'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../components/AuthProvider'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function AppointmentsPage() {
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated, profile } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments()
    }
  }, [isAuthenticated])

  async function fetchAppointments() {
    setLoading(true)
    try {
      let query = `${SUPABASE_URL}/rest/v1/appointments?select=*&order=datetime.asc`
      
      if (profile?.role === 'client') {
        query += `&user_id=eq.${user.id}`
      }
      
      const res = await fetch(query, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      })
      
      const data = await res.json()
      if (Array.isArray(data)) {
        setAppointments(data)
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  function formatDateTime(datetime) {
    const date = new Date(datetime)
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-zinc-400 hover:text-white">Home</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-white">Appointments</span>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Appointments</h1>
            <p className="text-zinc-400">Manage your scheduled appointments</p>
          </div>
          <Link href="/appointments/book">
            <Button>Book Appointment</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{appointments.length}</div>
              <div className="text-sm text-zinc-400">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">
                {appointments.filter(a => a.status === 'pending').length}
              </div>
              <div className="text-sm text-zinc-400">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {appointments.filter(a => a.status === 'confirmed').length}
              </div>
              <div className="text-sm text-zinc-400">Confirmed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-400">
                {appointments.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-sm text-zinc-400">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">No appointments yet</h3>
              <p className="text-zinc-400 mb-4">Book your first appointment to get started.</p>
              <Link href="/appointments/book">
                <Button>Book Now</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => {
              const { date, time } = formatDateTime(apt.datetime)
              return (
                <Card key={apt.id} className="hover:border-zinc-600 transition-colors">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="bg-zinc-800 rounded-lg p-4 text-center min-w-[80px]">
                        <div className="text-lg font-bold text-white">{new Date(apt.datetime).getDate()}</div>
                        <div className="text-xs text-zinc-400">{new Date(apt.datetime).toLocaleString('default', { month: 'short' })}</div>
                      </div>
                      <div>
                        <CardTitle className="mb-1">{apt.title}</CardTitle>
                        <p className="text-zinc-400 text-sm">{time} • {apt.duration_minutes || 60} min</p>
                        {apt.description && (
                          <p className="text-zinc-500 text-sm mt-1">{apt.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                        apt.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        apt.status === 'completed' ? 'bg-indigo-500/20 text-indigo-400' :
                        'bg-zinc-700 text-zinc-400'
                      }`}>
                        {apt.status || 'pending'}
                      </span>
                      {profile?.role === 'admin' && (
                        <div className="flex gap-2">
                          {apt.status === 'pending' && (
                            <Button size="sm" variant="secondary">Confirm</Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}