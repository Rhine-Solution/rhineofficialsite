'use client'

import { useState, useEffect } from 'react'
import { Mail, Trash2, Check, X } from 'lucide-react'
import DataTable from '../../../components/admin/DataTable'
import StatusBadge from '../../../components/admin/StatusBadge'
import EmptyState from '../../../components/admin/EmptyState'
import { useToast } from '../../../components/admin/Toast'
import { format } from 'date-fns'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function ContactsPage() {
  const toast = useToast()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/contacts?select=*&order=created_at.desc`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const data = await res.json()
      setContacts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || 
      (statusFilter === 'read' && c.is_read) ||
      (statusFilter === 'unread' && !c.is_read)
    return matchesSearch && matchesStatus
  })

  async function toggleRead(contact) {
    setUpdating(contact.id)
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/contacts?id=eq.${contact.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_read: !contact.is_read })
        }
      )

      if (res.ok) {
        toast.success(contact.is_read ? 'Marked as unread' : 'Marked as read')
        fetchContacts()
      }
    } catch (error) {
      console.error('Error updating contact:', error)
      toast.error('Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  async function handleDelete() {
    if (!deleteId) return

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/contacts?id=eq.${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )

      if (res.ok) {
        toast.success('Contact deleted')
        fetchContacts()
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error('Failed to delete')
    } finally {
      setDeleteId(null)
    }
  }

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div className={row.is_read ? '' : 'font-semibold'}>
          <p className="text-white">{row.name}</p>
          <p className="text-xs text-zinc-500">{row.email}</p>
        </div>
      )
    },
    {
      header: 'Subject',
      accessor: 'subject',
      render: (row) => (
        <p className={`text-sm ${row.is_read ? 'text-zinc-400' : 'text-white'}`}>
          {row.subject || 'No subject'}
        </p>
      )
    },
    {
      header: 'Status',
      accessor: 'is_read',
      render: (row) => <StatusBadge status={row.is_read ? 'read' : 'unread'} />
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleRead(row)}
            disabled={updating === row.id}
            className={`p-2 rounded-lg transition-colors ${
              row.is_read 
                ? 'text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10' 
                : 'text-zinc-400 hover:text-green-400 hover:bg-green-500/10'
            }`}
          >
            {row.is_read ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setSelectedContact(row)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  // Stats
  const unreadCount = contacts.filter(c => !c.is_read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Contacts</h1>
        <p className="text-zinc-400">Manage contact form submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{contacts.length}</p>
          <p className="text-sm text-zinc-400">Total Messages</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-400">{unreadCount}</p>
          <p className="text-sm text-zinc-400">Unread</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-green-400">{contacts.length - unreadCount}</p>
          <p className="text-sm text-zinc-400">Read</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredContacts}
        searchValue={search}
        onSearch={setSearch}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { value: 'unread', label: 'Unread' },
          { value: 'read', label: 'Read' }
        ]}
        searchPlaceholder="Search messages..."
        loading={loading}
        emptyMessage="No contact messages found"
      />

      {/* View Contact Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Message</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-zinc-500">From</p>
                <p className="text-white">{selectedContact.name}</p>
                <p className="text-sm text-indigo-400">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Subject</p>
                <p className="text-white">{selectedContact.subject || 'No subject'}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Message</p>
                <p className="text-white whitespace-pre-line">{selectedContact.message}</p>
              </div>
              <div className="flex gap-3 pt-4">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white text-center rounded-xl font-medium hover:bg-indigo-500 transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Message?</h3>
            <p className="text-zinc-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}