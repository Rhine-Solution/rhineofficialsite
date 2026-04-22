'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../components/AuthProvider'
import { Download } from 'lucide-react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400'
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders()
    }
  }, [isAuthenticated, user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?user_id=eq.${user.id}&order=created_at.desc`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setOrders(data || [])
      } else {
        setError('Failed to load orders')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">My Orders</h1>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <Card className="hover-lift">
            <CardContent className="p-12 text-center">
              <svg className="w-16 h-16 text-zinc-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-xl font-semibold text-zinc-400 mb-2">No orders yet</h3>
              <p className="text-zinc-500 mb-6">Start shopping to see your orders here</p>
              <Button onClick={() => router.push('/shop')}>
                Browse Shop
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <span className={`px-3 py-1 text-xs rounded-full ${statusColors[order.status] || 'bg-zinc-500/20 text-zinc-400'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-zinc-400 space-y-1">
                        <p>Ordered on {formatDate(order.created_at)}</p>
                        <p>Ship to: {order.city}, {order.country || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatPrice(order.total)}</p>
                      <p className="text-sm text-zinc-500">{order.customer_name}</p>
                      <a
                        href={`/api/invoice/${order.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 mt-2"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                  
                  {order.notes && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <p className="text-sm text-zinc-400">
                        <span className="font-medium">Notes:</span> {order.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}