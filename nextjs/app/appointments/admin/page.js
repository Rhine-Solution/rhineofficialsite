'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Card, { CardContent, CardTitle } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { useAuth } from '../../../components/AuthProvider'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function AppointmentsAdminPage() {
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated, profile } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || profile?.role !== 'admin')) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, profile, router])

  useEffect(() => {
    if (isAuthenticated && profile?.role === 'admin') {
      fetchAppointments()
    }
  }, [isAuthenticated, profile])

  async function fetchAppointments() {
    setLoading(true)
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/appointments?select=*&order=datetime.asc`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
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

  async function updateStatus(id, status) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/appointments?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      fetchAppointments()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  async function deleteAppointment(id) {
    if (!confirm('Are you sure you want to delete this appointment?')) return
    
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/appointments?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      })
      fetchAppointments()
    } catch (error) {
      console.error('Failed to delete appointment:', error)
    }
  }

  function formatDateTime(datetime) {
    const date = new Date(datetime)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (authLoading || !profile?.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-zinc-400 hover:text-white">Home</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-white">Appointments Admin</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">Appointments Admin</h1>
        <p className="text-zinc-400 mb-8">Manage all appointments</p>

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

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="text-left p-4 text-zinc-400 font-medium">Title</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Date & Time</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Status</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-t border-zinc-800">
                      <td className="p-4">
                        <div className="font-medium">{apt.title}</div>
                        {apt.description && (
                          <div className="text-sm text-zinc-500">{apt.description}</div>
                        )}
                      </td>
                      <td className="p-4 text-zinc-400">
                        {formatDateTime(apt.datetime)}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          apt.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          apt.status === 'completed' ? 'bg-indigo-500/20 text-indigo-400' :
                          'bg-zinc-700 text-zinc-400'
                        }`}>
                          {apt.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {apt.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(apt.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                          )}
                          {apt.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(apt.id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => deleteAppointment(apt.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {appointments.length === 0 && !loading && (
              <div className="p-8 text-center text-zinc-500">
                No appointments found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}