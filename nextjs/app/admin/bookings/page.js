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
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function BookingsPage() {
  const toast = useToast()
  const [bookings, setBookings] = useState([])
  const [destinations, setDestinations] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [bookingsRes, destinationsRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/bookings?select=*&order=created_at.desc`, {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        }),
        fetch(`${SUPABASE_URL}/rest/v1/destinations?select=id,name`, {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        })
      ])

      const bookingsData = await bookingsRes.json()
      const destinationsData = await destinationsRes.json()

      setBookings(Array.isArray(bookingsData) ? bookingsData : [])
      
      // Create destinations lookup
      const destMap = {}
      if (Array.isArray(destinationsData)) {
        destinationsData.forEach(d => { destMap[d.id] = d.name })
      }
      setDestinations(destMap)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = !search || 
      b.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.guest_email?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      header: 'Destination',
      accessor: 'destination_id',
      render: (row) => (
        <span className="text-white">{destinations[row.destination_id] || 'Destination'}</span>
      )
    },
    {
      header: 'Guest',
      render: (row) => (
        <div>
          <p className="text-white">{row.guest_name}</p>
          <p className="text-xs text-zinc-500">{row.guest_email}</p>
        </div>
      )
    },
    {
      header: 'Dates',
      render: (row) => (
        <span className="text-zinc-400 text-sm">
          {row.check_in && row.check_out 
            ? `${format(new Date(row.check_in), 'MMM dd')} - ${format(new Date(row.check_out), 'MMM dd')}`
            : '-'
          }
        </span>
      )
    },
    {
      header: 'Guests',
      accessor: 'guests',
      render: (row) => <span className="text-zinc-400">{row.guests || 1}</span>
    },
    {
      header: 'Total',
      accessor: 'total_price',
      render: (row) => <span className="text-cyan-400 font-medium">${parseFloat(row.total_price || 0).toFixed(2)}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status || 'pending'} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => setSelectedBooking(row)}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ]

  async function updateStatus(bookingId, newStatus) {
    setUpdatingStatus(bookingId)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${bookingId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        toast.success('Booking status updated')
        fetchData()
      }
    } catch (error) {
      toast.error('Failed to update')
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0)
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Travel Bookings</h1>
        <p className="text-zinc-400">Manage travel destination bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{bookings.length}</p>
          <p className="text-sm text-zinc-400">Total Bookings</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-cyan-400">${totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-zinc-400">Total Revenue</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-green-400">{confirmedBookings}</p>
          <p className="text-sm text-zinc-400">Confirmed</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-400">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
          <p className="text-sm text-zinc-400">Pending</p>
        </div>
      </div>

      {/* Table */}
      {bookings.length === 0 && !loading ? (
        <EmptyState
          title="No bookings yet"
          description="Travel bookings will appear here when customers make reservations."
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredBookings}
          searchValue={search}
          onSearch={setSearch}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={statusOptions}
          searchPlaceholder="Search bookings..."
          loading={loading}
          emptyMessage="No bookings found"
        />
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Destination</p>
                  <p className="text-white">{destinations[selectedBooking.destination_id] || 'Destination'}</p>
                </div>
                <StatusBadge status={selectedBooking.status || 'pending'} />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Guest</p>
                <p className="text-white">{selectedBooking.guest_name}</p>
                <p className="text-sm text-indigo-400">{selectedBooking.guest_email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500">Check-in</p>
                  <p className="text-white">{selectedBooking.check_in ? format(new Date(selectedBooking.check_in), 'MMM dd, yyyy') : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Check-out</p>
                  <p className="text-white">{selectedBooking.check_out ? format(new Date(selectedBooking.check_out), 'MMM dd, yyyy') : '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Guests</p>
                <p className="text-white">{selectedBooking.guests || 1}</p>
              </div>
              {selectedBooking.special_requests && (
                <div>
                  <p className="text-sm text-zinc-500">Special Requests</p>
                  <p className="text-white">{selectedBooking.special_requests}</p>
                </div>
              )}
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-zinc-500 mb-2">Update Status</p>
                <div className="flex gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      onClick={() => updateStatus(selectedBooking.id, status.value)}
                      disabled={updatingStatus === selectedBooking.id}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        selectedBooking.status === status.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}