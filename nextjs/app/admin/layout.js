'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../../components/AuthProvider'
import AdminSidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/Header'
import { ToastProvider } from '../../components/admin/Toast'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: authLoading, isAuthenticated, isAdmin } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=' + pathname)
      } else if (!isAdmin) {
        router.push('/dashboard')
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router, pathname])

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-zinc-950">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="pt-16 pl-0 lg:pl-64">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}