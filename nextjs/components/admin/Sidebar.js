'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FileText, 
  MessageSquare, 
  Users, 
  Star, 
  MapPin, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react'

const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    href: '/admin' 
  },
  { 
    id: 'products', 
    label: 'Products', 
    icon: Package, 
    href: '/admin/products',
    count: 21
  },
  { 
    id: 'orders', 
    label: 'Orders', 
    icon: ShoppingCart, 
    href: '/admin/orders',
    count: 0
  },
  { 
    id: 'bookings', 
    label: 'Bookings', 
    icon: MapPin, 
    href: '/admin/bookings',
    count: 0
  },
  { 
    id: 'contacts', 
    label: 'Contacts', 
    icon: MessageSquare, 
    href: '/admin/contacts',
    count: 3
  },
  { 
    id: 'reviews', 
    label: 'Reviews', 
    icon: Star, 
    href: '/admin/reviews',
    count: 5
  },
  { 
    id: 'destinations', 
    label: 'Destinations', 
    icon: MapPin, 
    href: '/admin/destinations',
    count: 10
  },
  { 
    id: 'users', 
    label: 'Users', 
    icon: Users, 
    href: '/admin/users',
    count: 0
  },
]

const bottomItems = [
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    href: '/admin/analytics' 
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    href: '/admin/settings' 
  },
]

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname()

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 w-64 bg-zinc-950/80 backdrop-blur-xl border-r border-white/5 z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col h-full py-6">
          {/* Main Menu */}
          <div className="flex-1 px-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${active 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`
                      px-2 py-0.5 text-xs rounded-full
                      ${active 
                        ? 'bg-white/20 text-white' 
                        : 'bg-zinc-800 text-zinc-400'
                      }
                    `}>
                      {item.count}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Bottom Menu */}
          <div className="px-3 pt-4 border-t border-white/5">
            {bottomItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${active 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </aside>
    </>
  )
}