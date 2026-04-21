'use client'

import { useState, useEffect } from 'react'
import Card, { CardImage, CardContent, CardTitle, CardDescription, CardPrice } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useCart } from '../../components/CartProvider'

const fallbackProducts = [
  { id: '1', name: 'Premium Web Hosting', description: 'High-performance hosting with 99.9% uptime', price: 29, category: 'Hosting', image_url: null },
  { id: '2', name: 'Domain Registration', description: 'Secure your perfect domain name', price: 12, category: 'Domains', image_url: null },
  { id: '3', name: 'SSL Certificate', description: 'Enterprise-grade security for your site', price: 49, category: 'Security', image_url: null },
  { id: '4', name: 'Cloud Backup', description: 'Automated daily backups', price: 19, category: 'Storage', image_url: null },
  { id: '5', name: 'Email Hosting', description: 'Professional email with your domain', price: 9, category: 'Email', image_url: null },
  { id: '6', name: 'CDN加速', description: 'Global content delivery network', price: 24, category: 'Performance', image_url: null },
  { id: '7', name: 'Website Builder', description: 'Drag-and-drop website creation', price: 39, category: 'Tools', image_url: null },
  { id: '8', name: 'API Access', description: 'Full API access for developers', price: 59, category: 'Developer', image_url: null },
]

export default function ShopPage() {
  const [products, setProducts] = useState(fallbackProducts)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'}/rest/v1/products?select=*&order=created_at.desc`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'}`
          }
        }
      )
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data)
      }
    } catch (error) {
      console.log('Using fallback products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !category || product.category === category
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-zinc-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Shop</h1>
          <p className="text-zinc-400">Premium services for your business</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Featured Bundles */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">⭐</span> Premium Bundles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-400 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🚀</span>
                <span className="font-bold text-amber-400">Startup Bundle</span>
              </div>
              <p className="text-sm text-zinc-400 mb-4">Everything you need to start your business online</p>
              <ul className="text-sm text-zinc-300 space-y-1 mb-4">
                <li>✓ Premium Hosting (1 year)</li>
                <li>✓ Domain Registration</li>
                <li>✓ SSL Certificate</li>
                <li>✓ Business Email</li>
              </ul>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-white">$399</span>
                <span className="text-sm text-zinc-500 line-through">$599</span>
                <span className="text-sm text-green-400">Save 33%</span>
              </div>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500">Get Started</Button>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-6 hover:border-indigo-400 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💼</span>
                <span className="font-bold text-indigo-400">Business Bundle</span>
              </div>
              <p className="text-sm text-zinc-400 mb-4">Complete solution for growing businesses</p>
              <ul className="text-sm text-zinc-300 space-y-1 mb-4">
                <li>✓ Dedicated Server Pro</li>
                <li>✓ SEO Premium Package</li>
                <li>✓ Cloud Backup 1TB</li>
                <li>✓ Priority Support</li>
              </ul>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-white">$799</span>
                <span className="text-sm text-zinc-500 line-through">$1199</span>
                <span className="text-sm text-green-400">Save 33%</span>
              </div>
              <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">Get Started</Button>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏢</span>
                <span className="font-bold text-cyan-400">Enterprise Bundle</span>
              </div>
              <p className="text-sm text-zinc-400 mb-4">Full-scale solution for large organizations</p>
              <ul className="text-sm text-zinc-300 space-y-1 mb-4">
                <li>✓ Mobile App MVP</li>
                <li>✓ API Development</li>
                <li>✓ Custom Integration</li>
                <li>✓ 24/7 Support</li>
              </ul>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-white">$2499</span>
                <span className="text-sm text-zinc-500 line-through">$3999</span>
                <span className="text-sm text-green-400">Save 37%</span>
              </div>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Items Container - Red Golden Glassy */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            {/* Red Golden Glassy Container */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-900/80 via-red-800/60 to-amber-900/80 border border-amber-400/30 backdrop-blur-xl">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-amber-500/20 to-red-600/20 animate-pulse" />
              
              {/* Header */}
              <div className="relative z-10 px-8 pt-8 pb-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <span className="text-4xl">👑</span>
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">Premium Collection</span>
                </h2>
                <p className="text-red-200/80 mt-2 text-lg">Exclusive premium services with elite features</p>
              </div>

              {/* Premium Items Grid */}
              <div className="relative z-10 px-8 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.filter(p => 
                    p.name?.includes('Premium') || 
                    p.name?.includes('Pro') || 
                    p.name?.includes('MVP') ||
                    p.name?.includes('Enterprise') ||
                    p.is_premium === true
                  ).slice(0, 8).map((product, index) => (
                    <div 
                      key={product.id}
                      className="group relative bg-gradient-to-br from-amber-500/20 to-red-500/10 border border-amber-400/20 rounded-2xl p-4 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Golden glow effect on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Badge */}
                      <div className="absolute -top-2 -right-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-bold rounded-full shadow-lg">
                          ⭐
                        </span>
                      </div>

                      {/* Content */}
                      <div className="relative">
                        <div className="text-xs text-amber-400 mb-1 uppercase tracking-wide font-medium">{product.category}</div>
                        <h3 className="font-bold text-white text-sm mb-2 group-hover:text-amber-300 transition-colors line-clamp-2">{product.name}</h3>
                        {product.description && (
                          <p className="text-xs text-red-200/70 mb-3 line-clamp-2">{product.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-amber-300">${product.price}</span>
                          <button 
                            onClick={() => addItem(product)}
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

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

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
                return (
                <Card 
                  key={product.id} 
                  className="card-animate hover-lift group relative"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <CardContent className="p-3">
                    <div className="text-xs text-indigo-400 mb-1 uppercase tracking-wide">{product.category}</div>
                    <CardTitle className="text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-cyan-400 text-sm">${product.price}</span>
                      <button 
                        onClick={() => addItem(product)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all"
                      >
                        Add
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
    </div>
  )
}