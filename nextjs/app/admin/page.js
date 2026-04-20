'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../components/AuthProvider'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function AdminPage() {
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated, isAdmin } = useAuth()
  const [activeSection, setActiveSection] = useState('overview')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [contacts, setContacts] = useState([])
  const [destinations, setDestinations] = useState([])
  const [bookings, setBookings] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, products: 0 })

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  async function fetchData() {
    try {
      const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }

      const [productsRes, ordersRes, contactsRes, destinationsRes, profilesRes, bookingsRes, appointmentsRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/orders?select=*`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/contacts?select=*`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/destinations?select=*`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/bookings?select=*`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/appointments?select=*`, { headers })
      ])

      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()
      const contactsData = await contactsRes.json()
      const destinationsData = await destinationsRes.json()
      const profilesData = await profilesRes.json()
      const bookingsData = await bookingsRes.json()
      const appointmentsData = await appointmentsRes.json()

      setProducts(Array.isArray(productsData) ? productsData : [])
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setContacts(Array.isArray(contactsData) ? contactsData : [])
      setDestinations(Array.isArray(destinationsData) ? destinationsData : [])
      setBookings(Array.isArray(bookingsData) ? bookingsData : [])
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])

      const totalRevenue = Array.isArray(ordersData) 
        ? ordersData.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0) 
        : 0

      setStats({
        users: Array.isArray(profilesData) ? profilesData.length : 0,
        orders: ordersData.length || 0,
        revenue: totalRevenue,
        products: productsData.length || 0,
        destinations: destinationsData.length || 0,
        contacts: contactsData.length || 0
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
  }

  async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      })
      fetchData()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  async function updateOrderStatus(id, status) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      fetchData()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const adminStats = [
    { label: 'Total Users', value: stats.users, change: '+5%', icon: '👥' },
    { label: 'Total Orders', value: stats.orders, change: '+8%', icon: '📦' },
    { label: 'Revenue', value: formatCurrency(stats.revenue), change: '+12%', icon: '💰' },
    { label: 'Products', value: stats.products, change: '+3%', icon: '🏷️' },
  ]

  const recentActivity = [
    { type: 'order', message: `New order #${orders[0]?.id?.slice(0, 8) || 'N/A'} placed`, time: orders[0] ? new Date(orders[0].created_at).toLocaleString() : 'N/A' },
    { type: 'contact', message: `${stats.contacts} contact messages`, time: 'Total' },
    { type: 'product', message: `${stats.products} products available`, time: 'Total' },
    { type: 'destination', message: `${stats.destinations} travel destinations`, time: 'Total' },
  ]

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'products', label: 'Products', icon: '🏷️' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'bookings', label: 'Travel Bookings', icon: '✈️' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'contacts', label: 'Contacts', icon: '💬' },
    { id: 'destinations', label: 'Destinations', icon: '🌍' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-zinc-900/50 py-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-zinc-400">Manage your platform</p>
          </div>
          <Button>Add New Product</Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {adminStats.map(stat => (
                <Card key={stat.label}>
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-zinc-500 flex items-center gap-1">
                      {stat.label}
                      <span className="text-green-400">{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Products Table */}
            <Card>
              <CardContent>
                <CardTitle className="mb-4">Products Management</CardTitle>
                {loading ? (
                  <p className="text-zinc-500">Loading...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Name</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Category</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Price</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Stock</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.slice(0, 5).map(product => (
                          <tr key={product.id} className="border-b border-zinc-800/50">
                            <td className="py-3 px-4">{product.name}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-zinc-800 rounded text-xs">
                                {product.category || 'Uncategorized'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-cyan-400">${product.price}</td>
                            <td className="py-3 px-4">{product.stock || 0}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button 
                                  variant="danger" 
                                  size="sm"
                                  onClick={() => deleteProduct(product.id)}
                                >Delete</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent>
                <CardTitle className="mb-4">Recent Activity</CardTitle>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-zinc-900 rounded-lg">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-zinc-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}