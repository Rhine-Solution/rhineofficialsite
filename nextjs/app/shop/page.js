'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card, { CardImage, CardContent, CardTitle, CardDescription } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useCart } from '../../components/CartProvider'
import { useToast } from '../../components/ui/Toast'
import { X, Eye, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react'

const fallbackProducts = [
  { id: '1', name: 'Premium Web Hosting', description: 'High-performance hosting with 99.9% uptime', price: 29, category: 'Hosting', image_url: null, stock: 100 },
  { id: '2', name: 'Domain Registration', description: 'Secure your perfect domain name', price: 12, category: 'Domains', image_url: null, stock: 50 },
  { id: '3', name: 'SSL Certificate', description: 'Enterprise-grade security for your site', price: 49, category: 'Security', image_url: null, stock: 25 },
  { id: '4', name: 'Cloud Backup', description: 'Automated daily backups', price: 19, category: 'Storage', image_url: null, stock: 0 },
  { id: '5', name: 'Email Hosting', description: 'Professional email with your domain', price: 9, category: 'Email', image_url: null, stock: 200 },
]

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

function StockBadge({ stock }) {
  if (!stock || stock === 0) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
        Out of Stock
      </span>
    )
  }
  if (stock < 10) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
        Low Stock ({stock})
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
      In Stock
    </span>
  )
}

function QuantitySelector({ value, onChange, max }) {
  const decrease = () => {
    if (value > 1) onChange(value - 1)
  }
  const increase = () => {
    if (!max || value < max) onChange(value + 1)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={decrease}
        disabled={value <= 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center text-white font-medium">{value}</span>
      <button
        onClick={increase}
        disabled={max && value >= max}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}

function QuickViewModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    setAdding(true)
    await onAddToCart(product, quantity)
    setAdding(false)
    onClose()
  }

  if (!product) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <div className="aspect-video bg-zinc-800 overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-sm text-indigo-400 uppercase tracking-wide">{product.category}</span>
              <h2 className="text-2xl font-bold text-white mt-1">{product.name}</h2>
            </div>
            <StockBadge stock={product.stock} />
          </div>

          <p className="text-zinc-400 mb-6">{product.description || 'No description available.'}</p>

          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-3xl font-bold text-cyan-400">${product.price}</span>
              {product.stock !== undefined && product.stock > 0 && (
                <span className="text-sm text-zinc-500 ml-2">/ unit</span>
              )}
            </div>
          </div>

          {product.stock !== undefined && product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-zinc-400">Quantity:</span>
              <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleAdd}
              disabled={!product.stock || product.stock === 0 || adding}
              className="flex-1"
            >
              {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : `Add to Cart - $${(parseFloat(product.price) * quantity).toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [products, setProducts] = useState(fallbackProducts)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantities, setQuantities] = useState({})
  const { addItem } = useCart()
  const toast = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        // Add random stock for demo
        const productsWithStock = data.map(p => ({
          ...p,
          stock: Math.floor(Math.random() * 150) + 1
        }))
        setProducts(productsWithStock)
      }
    } catch (error) {
      console.log('Using fallback products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product, quantity = 1) => {
    // Add the same product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    toast.success(`${product.name} x${quantity} added to cart!`)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !category || product.category === category
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Shop</h1>
          <p className="text-zinc-400">Browse our premium services and solutions</p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-6 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !category ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  category === cat ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bundles */}
      {filteredProducts.some(p => p.name?.includes('Premium') || p.name?.includes('Pro') || p.name?.includes('Enterprise')) && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-900/80 via-red-800/60 to-amber-900/80 border border-amber-400/30 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-amber-500/20 to-red-600/20 animate-pulse" />
              <div className="relative z-10 px-8 pt-8 pb-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <span className="text-4xl">👑</span>
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">Premium Collection</span>
                </h2>
              </div>
              <div className="relative z-10 px-8 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.filter(p => 
                    p.name?.includes('Premium') || 
                    p.name?.includes('Pro') || 
                    p.name?.includes('Enterprise') ||
                    p.name?.includes('MVP')
                  ).slice(0, 8).map((product, index) => (
                    <div 
                      key={product.id}
                      className="group relative bg-gradient-to-br from-amber-500/20 to-red-500/10 border border-amber-400/20 rounded-2xl p-4 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="absolute -top-2 -right-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-bold rounded-full shadow-lg">
                          ⭐
                        </span>
                      </div>
                      <div>
                        <div className="text-xs text-amber-400 mb-1 uppercase tracking-wide font-medium">{product.category}</div>
                        <h3 className="font-bold text-white text-sm mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-amber-300">${product.price}</span>
                          <button 
                            onClick={() => handleAddToCart(product)}
                            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">All Services</h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-xl h-80 shimmer" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product, index) => {
                const qty = quantities[product.id] || 1
                const isOutOfStock = !product.stock || product.stock === 0
                
                return (
                <Card 
                  key={product.id} 
                  className="card-animate hover-lift group relative"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-indigo-400 uppercase tracking-wide">{product.category}</span>
                      <StockBadge stock={product.stock} />
                    </div>
                    <CardTitle className="text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-cyan-400 text-sm">${product.price}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {!isOutOfStock && (
                        <QuantitySelector 
                          value={qty} 
                          onChange={(v) => setQuantities({...quantities, [product.id]: v})}
                          max={product.stock}
                        />
                      )}
                      <button 
                        onClick={() => handleAddToCart(product, qty)}
                        disabled={isOutOfStock}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isOutOfStock 
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              No products found. Try a different search.
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}