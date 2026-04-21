'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, FileText, MessageSquare, MapPin, Users, DollarSign, TrendingUp } from 'lucide-react'
import StatCard from '../../components/admin/StatCard'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    contacts: 0,
    bookings: 0,
    destinations: 0,
    revenue: 0,
    unreadContacts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }

      const [productsRes, ordersRes, contactsRes, bookingsRes, destinationsRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/products?select=id`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/orders?select=total,status`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/contacts?select=is_read`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/bookings?select=id`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/destinations?select=id`, { headers })
      ])

      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()
      const contactsData = await contactsRes.json()
      const bookingsData = await bookingsRes.json()
      const destinationsData = await destinationsRes.json()

      const orders = Array.isArray(ordersData) ? ordersData : []
      const contacts = Array.isArray(contactsData) ? contactsData : []

      setStats({
        products: Array.isArray(productsData) ? productsData.length : 0,
        orders: orders.length,
        contacts: contacts.length,
        bookings: Array.isArray(bookingsData) ? bookingsData.length : 0,
        destinations: Array.isArray(destinationsData) ? destinationsData.length : 0,
        revenue: orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
        unreadContacts: contacts.filter(c => !c.is_read).length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickLinks = [
    { label: 'Products', href: '/admin/products', icon: Package, count: stats.products, color: 'indigo' },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, count: stats.orders, color: 'cyan' },
    { label: 'Contacts', href: '/admin/contacts', icon: MessageSquare, count: stats.unreadContacts, color: 'amber', badge: 'unread' },
    { label: 'Bookings', href: '/admin/bookings', icon: MapPin, count: stats.bookings, color: 'purple' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon={ShoppingCart}
          color="cyan"
        />
        <StatCard
          title="Products"
          value={stats.products}
          icon={Package}
          color="indigo"
        />
        <StatCard
          title="Unread Messages"
          value={stats.unreadContacts}
          icon={MessageSquare}
          color="amber"
        />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map(link => {
            const Icon = link.icon
            return (
              <Link
                key={link.label}
                href={link.href}
                className="group bg-zinc-900/50 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all hover:bg-zinc-900"
              >
                <div className={`
                  w-12 h-12 rounded-xl bg-${link.color}-500/20 flex items-center justify-center mb-3
                  group-hover:scale-110 transition-transform
                `}>
                  <Icon className={`w-6 h-6 text-${link.color}-400`} />
                </div>
                <p className="font-medium text-white">{link.label}</p>
                <p className="text-sm text-zinc-500">
                  {link.count} {link.count === 1 ? 'item' : 'items'}
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Database</span>
              <span className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">API Status</span>
              <span className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Email Service</span>
              <span className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Resend Connected
              </span>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Activity Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Travel Destinations</span>
              <span className="text-white font-medium">{stats.destinations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Total Bookings</span>
              <span className="text-white font-medium">{stats.bookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Contact Messages</span>
              <span className="text-white font-medium">{stats.contacts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}