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
        `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'}/rest/v1/products?select=*&is_active=true&order=created_at.desc`,
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

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-xl h-80 shimmer" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="card-animate hover-lift group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardImage 
                    src={product.image_url} 
                    alt={product.name}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <CardContent>
                    <div className="text-xs text-indigo-400 mb-1">{product.category}</div>
                    <CardTitle className="line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                    <div className="flex items-center justify-between mt-4">
                      <CardPrice>${product.price}</CardPrice>
                      <span className="text-sm text-zinc-500">{product.stock || 'Unlimited'}</span>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => addItem(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
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