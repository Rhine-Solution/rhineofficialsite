'use client'

import { useState, useEffect } from 'react'
import { Eye, X } from 'lucide-react'
import DataTable from '../../../components/admin/DataTable'
import StatusBadge from '../../../components/admin/StatusBadge'
import EmptyState from '../../../components/admin/EmptyState'
import { useToast } from '../../../components/admin/Toast'
import { format } from 'date-fns'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function OrdersPage() {
  const toast = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [updatingStatus, setUpdatingStatus] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchOrderItems(orderId) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/order_items?select=*,products(name)&order_id=eq.${orderId}`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const data = await res.json()
      setOrderItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching order items:', error)
    }
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = !search || 
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_address?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono text-sm text-zinc-400">
          {row.id?.slice(0, 8)}...
        </span>
      )
    },
    {
      header: 'Total',
      accessor: 'total',
      render: (row) => (
        <span className="text-cyan-400 font-medium">${parseFloat(row.total || 0).toFixed(2)}</span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status || 'pending'} />
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-zinc-400 text-sm">
          {row.created_at ? format(new Date(row.created_at), 'MMM dd, yyyy') : '-'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => { setSelectedOrder(row); fetchOrderItems(row.id) }}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ]

  async function updateStatus(orderId, newStatus) {
    setUpdatingStatus(orderId)
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        }
      )

      if (res.ok) {
        toast.success('Order status updated')
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)
  const completedOrders = orders.filter(o => o.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-zinc-400">Manage and track customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{orders.length}</p>
          <p className="text-sm text-zinc-400">Total Orders</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-cyan-400">${totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-zinc-400">Total Revenue</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-green-400">{completedOrders}</p>
          <p className="text-sm text-zinc-400">Completed</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-400">
            {orders.filter(o => o.status === 'pending').length}
          </p>
          <p className="text-sm text-zinc-400">Pending</p>
        </div>
      </div>

      {/* Table */}
      {orders.length === 0 && !loading ? (
        <EmptyState
          title="No orders yet"
          description="Orders will appear here when customers make purchases."
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          searchValue={search}
          onSearch={setSearch}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={statusOptions}
          searchPlaceholder="Search orders..."
          loading={loading}
          emptyMessage="No orders found"
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Order Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Order ID</p>
                  <p className="font-mono text-white">{selectedOrder.id?.slice(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-500">Date</p>
                  <p className="text-white">
                    {selectedOrder.created_at ? format(new Date(selectedOrder.created_at), 'MMM dd, yyyy HH:mm') : '-'}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-zinc-500 mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      onClick={() => updateStatus(selectedOrder.id, status.value)}
                      disabled={updatingStatus === selectedOrder.id}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                        ${selectedOrder.status === status.value 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                        }
                      `}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <p className="text-sm text-zinc-500 mb-1">Shipping Address</p>
                <p className="text-white whitespace-pre-line">{selectedOrder.shipping_address || '-'}</p>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-sm text-zinc-500 mb-2">Items</p>
                {orderItems.length > 0 ? (
                  <div className="space-y-2">
                    {orderItems.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                        <div>
                          <p className="text-white">{item.products?.name || 'Product'}</p>
                          <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-cyan-400 font-medium">${parseFloat(item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500">No items found</p>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-white">Total</p>
                  <p className="text-2xl font-bold text-cyan-400">${parseFloat(selectedOrder.total || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}