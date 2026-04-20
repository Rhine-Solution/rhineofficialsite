'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSearch } from './SearchContext'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function SearchModal() {
  const { isOpen, close } = useSearch()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ products: [], destinations: [], posts: [] })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults({ products: [], destinations: [], posts: [] })
        return
      }
      
      setLoading(true)
      try {
        const [productsRes, destinationsRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/products?select=*&name=ilike.*${encodeURIComponent(query)}*&limit=5`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
          }),
          fetch(`${SUPABASE_URL}/rest/v1/destinations?select=*&name=ilike.*${encodeURIComponent(query)}*&limit=5`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
          })
        ])

        const products = productsRes.ok ? await productsRes.json() : []
        const destinations = destinationsRes.ok ? await destinationsRes.json() : []

        setResults({
          products: Array.isArray(products) ? products : [],
          destinations: Array.isArray(destinations) ? destinations : [],
          posts: []
        })
      } catch (error) {
        console.error('Search error:', error)
        setResults({ products: [], destinations: [], posts: [] })
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const navigateTo = (path) => {
    router.push(path)
    close()
    setQuery('')
  }

  if (!isOpen) return null

  const hasResults = results.products.length || results.destinations.length || results.posts.length

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, destinations, blog..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-lg"
            />
            <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-zinc-500">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              Searching...
            </div>
          )}

          {!loading && query.length >= 2 && !hasResults && (
            <div className="p-8 text-center text-zinc-500">
              No results found for "{query}"
            </div>
          )}

          {!loading && hasResults && (
            <div className="p-2">
              {results.products.length > 0 && (
                <div className="mb-4">
                  <h3 className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase">Products</h3>
                  {results.products.map(product => (
                    <button
                      key={product.id}
                      onClick={() => navigateTo('/shop')}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg text-left"
                    >
                      <span className="text-xl">📦</span>
                      <div>
                        <div className="text-white">{product.name}</div>
                        <div className="text-sm text-zinc-500">${product.price}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.destinations.length > 0 && (
                <div className="mb-4">
                  <h3 className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase">Destinations</h3>
                  {results.destinations.map(dest => (
                    <button
                      key={dest.id}
                      onClick={() => navigateTo('/travel')}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg text-left"
                    >
                      <span className="text-xl">✈️</span>
                      <div>
                        <div className="text-white">{dest.name}</div>
                        <div className="text-sm text-zinc-500">{dest.location}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.posts.length > 0 && (
                <div>
                  <h3 className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase">Blog Posts</h3>
                  {results.posts.map(post => (
                    <button
                      key={post.id}
                      onClick={() => navigateTo('/blog')}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg text-left"
                    >
                      <span className="text-xl">📝</span>
                      <div className="text-white">{post.title}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="p-4 text-center text-zinc-500 text-sm">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      </div>
    </div>
  )
}