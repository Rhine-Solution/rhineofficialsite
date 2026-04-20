'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../AuthProvider'
import { useCart } from '../CartProvider'
import { useWishlist } from '../WishlistProvider'
import { useSearch } from '../SearchContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/travel', label: 'Travel' },
  { href: '/appointments', label: 'Appointments' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, signOut } = useAuth()
  const { cartCount, setIsOpen: setCartOpen } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { open: openSearch } = useSearch()
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass py-3' : 'bg-zinc-950 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold gradient-text">Rhine</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-white bg-indigo-600/20 border border-indigo-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors hover-lift"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile"
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors hover-lift"
                >
                  Profile
                </Link>
                <Link 
                  href="/orders"
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors hover-lift"
                >
                  Orders
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    href="/admin"
                    className="px-4 py-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all hover-lift glow-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={openSearch}
            className="hidden md:flex p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            title="Search (Ctrl+K)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Wishlist Button */}
          <Link
            href="/wishlist"
            className="hidden md:flex relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-xs rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="hidden md:flex relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-zinc-800">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-white bg-indigo-600/20 border border-indigo-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Cart button in mobile */}
            <button
              onClick={() => { setIsOpen(false); setCartOpen(true); }}
              className="flex items-center justify-between w-full px-4 py-3 text-base text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-2 text-base text-zinc-300 border border-zinc-700 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-2 text-base text-zinc-300 border border-zinc-700 rounded-lg"
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/orders"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-2 text-base text-zinc-300 border border-zinc-700 rounded-lg"
                  >
                    Orders
                  </Link>
                  <button 
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="w-full text-center px-4 py-2 text-base text-zinc-400 border border-zinc-700 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-2 text-base text-zinc-300 border border-zinc-700 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-2 text-base text-white bg-indigo-600 rounded-lg"
                  >
                    Sign Up
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