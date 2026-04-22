'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Package, Mail, ShoppingCart } from 'lucide-react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function AdminNotifications({ userRole }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const isAdmin = userRole === 'admin'

  useEffect(() => {
    if (!isAdmin) return

    const fetchRecentItems = async () => {
      const ordersRes = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?order=created_at.desc&limit=3&select=id,email,total,status,created_at`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      )
      const orders = await ordersRes.json()

      const contactsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/contacts?order=created_at.desc&limit=3&select=id,name,email,subject,created_at`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      )
      const contacts = await contactsRes.json()

      const newNotifications = []
      orders?.forEach(order => {
        newNotifications.push({ id: `order-${order.id}`, type: 'order', title: 'New Order', message: order.email || 'Customer', time: order.created_at, link: '/admin/orders' })
      })
      contacts?.forEach(contact => {
        newNotifications.push({ id: `contact-${contact.id}`, type: 'contact', title: 'New Contact', message: contact.name || contact.email, time: contact.created_at, link: '/admin/contacts' })
      })

      const sorted = newNotifications.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
      setNotifications(sorted)
      setUnreadCount(sorted.length)
    }

    fetchRecentItems()

    // Simple polling every 30 seconds for new items
    const interval = setInterval(fetchRecentItems, 30000)
    return () => clearInterval(interval)
  }, [isAdmin])

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-4 h-4 text-indigo-400" />
      case 'contact': return <Mail className="w-4 h-4 text-green-400" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  if (!isAdmin) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <h3 className="font-medium text-white">Notifications</h3>
              <button 
                onClick={() => {
                  setUnreadCount(0)
                  setIsOpen(false)
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                Mark all read
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-zinc-500 text-sm">
                  No new notifications
                </div>
              ) : (
                notifications.map(notif => (
                  <button
                    key={notif.id}
                    onClick={() => {
                      router.push(notif.link)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-start gap-3 p-4 hover:bg-zinc-800/50 transition-colors text-left border-b border-zinc-800/50 last:border-0"
                  >
                    <div className="mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{notif.title}</p>
                      <p className="text-xs text-zinc-400 truncate">{notif.message}</p>
                      <p className="text-xs text-zinc-500 mt-1">{formatTime(notif.time)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="p-3 border-t border-zinc-800">
              <button
                onClick={() => {
                  router.push('/admin/orders')
                  setIsOpen(false)
                }}
                className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300"
              >
                View all in Admin →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}