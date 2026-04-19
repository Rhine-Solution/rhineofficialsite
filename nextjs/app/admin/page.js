'use client'

import { useState, useEffect } from 'react'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const adminStats = [
  { label: 'Total Users', value: '156', change: '+12%', icon: '👥' },
  { label: 'Total Orders', value: '89', change: '+8%', icon: '📦' },
  { label: 'Revenue', value: '$12,450', change: '+23%', icon: '💰' },
  { label: 'Products', value: '42', change: '+5%', icon: '🏷️' },
]

const recentActivity = [
  { type: 'order', message: 'New order #1234 placed', time: '2 min ago' },
  { type: 'user', message: 'New user registered: john@example.com', time: '15 min ago' },
  { type: 'product', message: 'Product "Wireless Headphones" updated', time: '1 hour ago' },
  { type: 'contact', message: 'New contact form submission', time: '2 hours ago' },
]

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const productsRes = await fetch(
        'https://crqjedivobupxbbathux.supabase.co/rest/v1/products?select=*',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'
          }
        }
      )
      const productsData = await productsRes.json()
      if (Array.isArray(productsData)) {
        setProducts(productsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'products', label: 'Products', icon: '🏷️' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'contacts', label: 'Contacts', icon: '💬' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
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
                              <Button variant="ghost" size="sm">Edit</Button>
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