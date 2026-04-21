'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../AuthProvider'
import { useCart } from '../CartProvider'
import { useWishlist } from '../WishlistProvider'
import { useSearch } from '../SearchContext'

const megaMenuCategories = [
  {
    title: 'Services',
    items: [
      { label: 'Shop', href: '/shop', desc: 'Web hosting, domains, SSL' },
      { label: 'Travel', href: '/travel', desc: 'Book your next trip' },
      { label: 'Appointments', href: '/appointments', desc: 'Schedule a meeting' },
    ]
  },
  {
    title: 'Portfolio',
    items: [
      { label: 'Portfolio', href: '/portfolio', desc: 'View our work' },
      { label: 'Pricing', href: '/pricing', desc: 'Our pricing plans' },
    ]
  },
  {
    title: 'Resources',
    items: [
      { label: 'Blog', href: '/blog', desc: 'Latest articles' },
      { label: 'FAQ', href: '/faq', desc: 'Common questions' },
      { label: 'Reviews', href: '/reviews', desc: 'Customer feedback' },
    ]
  },
  {
    title: 'Company',
    items: [
      { label: 'About', href: '/about', desc: 'Learn about us' },
      { label: 'Contact', href: '/contact', desc: 'Get in touch' },
      { label: 'Admin', href: '/admin', desc: 'Management' },
    ]
  },
]

const accountItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
  { label: 'Orders', href: '/orders' },
  { label: 'Admin', href: '/admin', adminOnly: true },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [accountDropdown, setAccountDropdown] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, signOut } = useAuth()
  const { cartCount, setIsOpen: setCartOpen } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { open: openSearch } = useSearch()
  const megaMenuRef = useRef(null)
  const accountRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setMegaMenuOpen(false)
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMegaMenuOpen(false)
    setAccountDropdown(false)
  }, [pathname])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-3'
    }`}>
      {/* Glass background */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        scrolled 
          ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5' 
          : 'bg-zinc-950/60 backdrop-blur-lg'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold gradient-text">Rhine</span>
          </Link>

          {/* Mega Menu Button */}
          <div className="relative" ref={megaMenuRef}>
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                megaMenuOpen 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl">☰</span>
              <span className="hidden sm:inline">Menu</span>
              <svg className={`w-4 h-4 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mega Menu Panel */}
            {megaMenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[90vw] max-w-4xl bg-zinc-950/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {megaMenuCategories.map((category) => (
                      <div key={category.title}>
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                          {category.title}
                        </h3>
                        <div className="space-y-2">
                          {category.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block p-3 -mx-2 rounded-xl hover:bg-white/5 transition-colors group"
                            >
                              <span className="block text-base font-medium text-white group-hover:text-indigo-400 transition-colors">
                                {item.label}
                              </span>
                              <span className="block text-xs text-zinc-500">
                                {item.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Links */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex flex-wrap items-center gap-4">
                      <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
                        Home
                      </Link>
                      <span className="text-zinc-700">|</span>
                      <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
                        Sign In
                      </Link>
                      <span className="text-zinc-700">|</span>
                      <Link href="/register" className="text-sm text-zinc-400 hover:text-white transition-colors">
                        Create Account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={openSearch}
              className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              title="Search (Ctrl+K)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Dropdown */}
            <div className="relative" ref={accountRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setAccountDropdown(!accountDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${accountDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <Link 
                  href="/login"
                  className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              {/* Account Dropdown */}
              {accountDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-950/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {isAuthenticated && (
                    <>
                      <div className="p-4 border-b border-white/5">
                        <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                        <p className="text-xs text-zinc-500">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                      </div>
                      <div className="p-2">
                        {accountItems.map((item) => (
                          (!item.adminOnly || user?.role === 'admin') && (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-zinc-300 hover:text-white"
                            >
                              <span>{item.label}</span>
                            </Link>
                          )
                        ))}
                      </div>
                      <div className="p-2 border-t border-white/5">
                        <button 
                          onClick={signOut}
                          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sign Up Button (when not logged in) */}
            {!isAuthenticated && (
              <Link 
                href="/register"
                className="hidden lg:inline-flex px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Mega Menu Overlay */}
      {megaMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-zinc-950/95 backdrop-blur-xl z-40 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {megaMenuCategories.map((category) => (
                <div key={category.title}>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                    {category.title}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMegaMenuOpen(false)}
                        className="block p-3 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <span className="block text-base font-medium text-white">
                          {item.label}
                        </span>
                        <span className="block text-xs text-zinc-500">
                          {item.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Quick Links */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
              <Link href="/" onClick={() => setMegaMenuOpen(false)} className="block py-3 text-white font-medium">
                Home
              </Link>
              {!isAuthenticated && (
                <>
                  <Link href="/login" onClick={() => setMegaMenuOpen(false)} className="block py-3 text-zinc-400 hover:text-white">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMegaMenuOpen(false)} className="block py-3 text-zinc-400 hover:text-white">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}