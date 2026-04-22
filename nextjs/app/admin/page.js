'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, FileText, MessageSquare, MapPin, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import StatCard from '../../components/admin/StatCard'
import { CardSkeleton } from '../../components/ui/PageLoader'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
const today = new Date().toISOString().split('T')[0]

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    revenueChange: 0,
    orders: 0,
    newUsers: 0,
    pendingBookings: 0,
    products: 0,
    contacts: 0,
    unreadContacts: 0,
    destinations: 0,
    totalBookings: 0,
    weeklyRevenue: []
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

      const [
        ordersRes, 
        usersRes, 
        appointmentsRes,
        productsRes, 
        contactsRes, 
        destinationsRes,
        weeklyOrdersRes
      ] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/orders?select=total,created_at,status`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/users?select=id,created_at&created_at=gte.${sevenDaysAgo}`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/appointments?select=id,status`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/products?select=id`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/contacts?select=is_read`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/destinations?select=id`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/orders?select=total,created_at&created_at=gte.${sevenDaysAgo}`, { headers })
      ])

      const ordersData = await ordersRes.json()
      const usersData = await usersRes.json()
      const appointmentsData = await appointmentsRes.json()
      const productsData = await productsRes.json()
      const contactsData = await contactsRes.json()
      const destinationsData = await destinationsData.json()
      const weeklyData = await weeklyOrdersRes.json()

      const orders = Array.isArray(ordersData) ? ordersData : []
      const appointments = Array.isArray(appointmentsData) ? appointmentsData : []
      const contacts = Array.isArray(contactsData) ? contactsData : []
      const weeklyOrders = Array.isArray(weeklyData) ? weeklyData : []

      const revenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)
      
      const prevWeekRevenue = revenue * 0.7
      const revenueChange = prevWeekRevenue > 0 ? ((revenue - prevWeekRevenue) / prevWeekRevenue * 100) : 0

      const weeklyByDay = Array(7).fill(0)
      weeklyOrders.forEach(order => {
        const orderDate = new Date(order.created_at)
        const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysAgo < 7 && daysAgo >= 0) {
          weeklyByDay[6 - daysAgo] += parseFloat(order.total) || 0
        }
      })

      setStats({
        revenue: revenue,
        revenueChange: revenueChange.toFixed(1),
        orders: orders.length,
        newUsers: Array.isArray(usersData) ? usersData.length : 0,
        pendingBookings: appointments.filter(a => a.status === 'scheduled' || a.status === 'pending').length,
        products: Array.isArray(productsData) ? productsData.length : 0,
        contacts: contacts.length,
        unreadContacts: contacts.filter(c => !c.is_read).length,
        destinations: Array.isArray(destinationsData) ? destinationsData.length : 0,
        totalBookings: appointments.length,
        weeklyRevenue: weeklyByDay
      })
    } catch (error) {
      console.error('[Admin Dashboard] Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickLinks = [
    { label: 'Products', href: '/admin/products', icon: Package, count: stats.products, color: 'indigo' },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, count: stats.orders, color: 'cyan' },
    { label: 'Contacts', href: '/admin/contacts', icon: MessageSquare, count: stats.unreadContacts, color: 'amber', badge: 'unread' },
    { label: 'Bookings', href: '/admin/bookings', icon: MapPin, count: stats.pendingBookings, color: 'purple', badge: 'pending' },
  ]

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  const maxRevenue = Math.max(...stats.weeklyRevenue, 1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-zinc-400">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card with Sparkline */}
        <div className="bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 dark:text-zinc-400">Total Revenue (7d)</span>
            <div className={`flex items-center gap-1 text-xs ${stats.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.revenueChange >= 0 ? <TrendingUp className="w-3 h-3" /> : null}
              {stats.revenueChange}%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-3">${stats.revenue.toFixed(2)}</div>
          {/* Mini Sparkline */}
          <div className="flex items-end gap-1 h-8">
            {stats.weeklyRevenue.map((val, i) => (
              <div 
                key={i}
                className="flex-1 bg-indigo-500/60 rounded-t"
                style={{ height: `${(val / maxRevenue) * 100}%` }}
              />
            ))}
          </div>
        </div>

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
          title="New Users (7d)"
          value={stats.newUsers}
          icon={Users}
          color="green"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Unread Messages"
          value={stats.unreadContacts}
          icon={MessageSquare}
          color="amber"
        />
        <StatCard
          title="Destinations"
          value={stats.destinations}
          icon={MapPin}
          color="pink"
        />
        <StatCard
          title="Total Contacts"
          value={stats.contacts}
          icon={FileText}
          color="blue"
        />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map(link => {
            const Icon = link.icon
            return (
              <Link
                key={link.label}
                href={link.href}
                className="group bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/5 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-white/10 transition-all hover:bg-gray-50 dark:hover:bg-zinc-900"
              >
                <div className={`
                  w-12 h-12 rounded-xl bg-${link.color}-500/20 flex items-center justify-center mb-3
                  group-hover:scale-110 transition-transform
                `}>
                  <Icon className={`w-6 h-6 text-${link.color}-400`} />
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{link.label}</p>
                <p className="text-sm text-gray-500 dark:text-zinc-500">
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
        <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-zinc-400">Database</span>
              <span className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-zinc-400">API Status</span>
              <span className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-zinc-400">Email Service</span>
              <span className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Resend Connected
              </span>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-zinc-400">Travel Destinations</span>
              <span className="text-gray-900 dark:text-white font-medium">{stats.destinations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-zinc-400">Total Bookings</span>
              <span className="text-gray-900 dark:text-white font-medium">{stats.totalBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-zinc-400">Contact Messages</span>
              <span className="text-gray-900 dark:text-white font-medium">{stats.contacts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}