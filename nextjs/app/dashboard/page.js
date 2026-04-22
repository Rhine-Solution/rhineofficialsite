'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../components/AuthProvider'
import { useCart } from '../../components/CartProvider'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function DashboardPage() {
  const { user, loading: authLoading, signOut, isAuthenticated, profile } = useAuth()
  const { cartCount } = useCart()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData()
    }
  }, [isAuthenticated, user])

  async function fetchUserData() {
    setLoadingData(true)
    try {
      // Fetch orders
      const ordersRes = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?user_id=eq.${user.id}&order=created_at.desc&limit=5`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const ordersData = await ordersRes.json()
      setOrders(Array.isArray(ordersData) ? ordersData : [])

      // Fetch appointments
      const appointmentsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/appointments?user_id=eq.${user.id}&order=datetime.desc&limit=5`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const appointmentsData = await appointmentsRes.json()
      setBookings(Array.isArray(appointmentsData) ? appointmentsData : [])
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Orders', value: orders.length, icon: '📦' },
    { label: 'Bookings', value: bookings.length, icon: '📅' },
    { label: 'Cart Items', value: cartCount || '0', icon: '🛒' },
    { label: 'Appointments', value: bookings.filter(b => b.status === 'confirmed').length, icon: '✅' },
  ]

  const getInitials = (email) => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-zinc-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {profile?.username || user?.email?.split('@')[0] || 'User'}!
              </h1>
              <p className="text-zinc-400">
                {profile?.role === 'admin' ? 'Admin Dashboard' : 
                 profile?.role === 'employee' ? 'Employee Dashboard' : 
                 'Manage your account and activity'}
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(stat => (
              <Card key={stat.label} className="hover-lift">
                <CardContent className="text-center p-6">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Orders */}
              <Card className="hover-lift">
                <CardContent>
                  <div className="flex justify-between items-center mb-6">
                    <CardTitle>Recent Orders</CardTitle>
                    <Link href="/orders"><Button variant="ghost" size="sm">View All</Button></Link>
                  </div>
                  {loadingData ? (
                    <div className="text-center py-4 text-zinc-500">Loading...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-4 text-zinc-500">
                      <p>No orders yet.</p>
                      <Link href="/shop" className="text-indigo-400 text-sm">Browse shop</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                            <p className="text-cyan-400 font-semibold mt-1">${order.total}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Appointments */}
              <Card className="hover-lift">
                <CardContent>
                  <div className="flex justify-between items-center mb-6">
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <Link href="/appointments"><Button variant="ghost" size="sm">View All</Button></Link>
                  </div>
                  {loadingData ? (
                    <div className="text-center py-4 text-zinc-500">Loading...</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-4 text-zinc-500">
                      <p>No appointments yet.</p>
                      <Link href="/appointments/book" className="text-indigo-400 text-sm">Book appointment</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map(apt => (
                        <div key={apt.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                          <div>
                            <p className="font-medium">{apt.title}</p>
                            <p className="text-sm text-zinc-500">
                              {new Date(apt.datetime).toLocaleDateString()} at {new Date(apt.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            apt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            apt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-zinc-700 text-zinc-400'
                          }`}>
                            {apt.status || 'pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="hover-lift">
                <CardContent>
                  <CardTitle className="mb-4">Quick Actions</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/shop"><Button variant="outline" className="w-full">🛒 Shop Now</Button></Link>
                    <Link href="/travel"><Button variant="outline" className="w-full">✈️ Book Travel</Button></Link>
                    <Link href="/appointments/book"><Button variant="outline" className="w-full">📅 Book Appointment</Button></Link>
                    <Link href="/contact"><Button variant="outline" className="w-full">💬 Send Message</Button></Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="hover-lift">
                <CardContent>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-4">
                      {getInitials(user?.email)}
                    </div>
                    <h3 className="font-semibold text-lg">{profile?.username || user?.email?.split('@')[0] || 'User'}</h3>
                    <p className="text-sm text-zinc-500">{user?.email}</p>
                    <div className="mt-4">
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full capitalize">
                        {profile?.role || 'client'}
                      </span>
                    </div>
                    {profile?.role === 'admin' && (
                      <Link href="/admin" className="block mt-3">
                        <Button variant="outline" className="w-full">⚙️ Admin Panel</Button>
                      </Link>
                    )}
                    {profile?.role === 'employee' && (
                      <Link href="/appointments/admin" className="block mt-3">
                        <Button variant="outline" className="w-full">📋 Manage Appointments</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card className="hover-lift">
                <CardContent>
                  <CardTitle className="mb-4">Account</CardTitle>
                  <div className="space-y-3">
                    <Link href="/dashboard" className="block p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                      <p className="font-medium">📊 Overview</p>
                    </Link>
                    <Link href="/dashboard" className="block p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                      <p className="font-medium">📦 My Orders</p>
                    </Link>
                    <Link href="/dashboard" className="block p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                      <p className="font-medium">✈️ My Bookings</p>
                    </Link>
                    <Link href="/referral" className="block p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                      <p className="font-medium">🎁 Refer Friends</p>
                    </Link>
                    <button onClick={handleSignOut} className="block w-full text-left p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors text-red-400">
                      <p className="font-medium">🚪 Sign Out</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Cart Preview */}
              {cartCount > 0 && (
                <Card className="border-amber-500/30">
                  <CardContent>
                    <CardTitle className="mb-4">🛒 Cart</CardTitle>
                    <div className="p-3 bg-amber-500/10 rounded-lg">
                      <p className="text-amber-400 font-medium">You have {cartCount} item(s) in cart</p>
                      <Link href="/checkout">
                        <Button size="sm" className="mt-2 w-full">View Cart</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}