'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card, { CardImage, CardContent, CardTitle, CardDescription, CardPrice } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const categories = [
  { id: 'all', label: 'All Destinations', icon: '🌍' },
  { id: 'beach', label: 'Beach', icon: '🏝️' },
  { id: 'city', label: 'City', icon: '🗼' },
  { id: 'mountain', label: 'Mountain', icon: '⛰️' },
  { id: 'island', label: 'Island', icon: '🏝️' },
]

const fallbackDestinations = [
  { id: 1, name: 'Bali Paradise', location: 'Bali, Indonesia', price: 1299, category: 'beach', description: 'Beautiful beach resort with ocean views', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
  { id: 2, name: 'Paris Adventure', location: 'Paris, France', price: 1899, category: 'city', description: 'Romantic getaway in the city of lights', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
  { id: 3, name: 'Tokyo Explorer', location: 'Tokyo, Japan', price: 2199, category: 'city', description: 'Cultural experience in the capital of Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
  { id: 4, name: 'Maldives Luxury', location: 'Maldives', price: 3499, category: 'island', description: '5-star luxury resort on private island', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400' },
  { id: 5, name: 'Swiss Alps', location: 'Zurich, Switzerland', price: 2499, category: 'mountain', description: 'Skiing and mountain adventure', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400' },
  { id: 6, name: 'New York City', location: 'New York, USA', price: 1799, category: 'city', description: 'Complete NYC experience with Broadway shows', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
  { id: 7, name: 'Santorini Sunset', location: 'Santorini, Greece', price: 1599, category: 'island', description: 'Famous sunset views and white buildings', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400' },
  { id: 8, name: 'Safari Kenya', location: 'Masai Mara, Kenya', price: 2899, category: 'mountain', description: 'Wildlife safari and cultural experience', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400' },
]

export default function TravelPage() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDestinations()
  }, [])

  async function fetchDestinations() {
    try {
      const res = await fetch(
        'https://crqjedivobupxbbathux.supabase.co/rest/v1/products?select=*&order=created_at.desc',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'
          }
        }
      )
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setDestinations(data.map(d => ({
          id: d.id,
          name: d.name,
          location: d.description || 'Various Locations',
          price: parseFloat(d.price) || 999,
          category: d.category || 'city',
          description: d.description,
          image: d.image_url
        })))
      } else {
        setDestinations(fallbackDestinations)
      }
    } catch (error) {
      setDestinations(fallbackDestinations)
    } finally {
      setLoading(false)
    }
  }

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (cat) => {
    const found = categories.find(c => c.id === cat)
    return found?.icon || '🌍'
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-indigo-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next <span className="text-indigo-500">Adventure</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Explore amazing destinations around the world and book your dream vacation
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <Button className="px-8">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'Popular Destinations' : `${categories.find(c => c.id === selectedCategory)?.label} Destinations`}
            </h2>
            <span className="text-zinc-500">{filteredDestinations.length} results</span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-zinc-500">Loading destinations...</div>
          ) : filteredDestinations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((dest, index) => (
                <Card key={dest.id} className="card-animate" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="relative">
                    <CardImage src={dest.image} alt={dest.name} className="h-48" />
                    <span className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
                      {getCategoryIcon(dest.category)}
                    </span>
                  </div>
                  <CardContent>
                    <CardTitle className="line-clamp-1">{dest.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{dest.location}</CardDescription>
                    <div className="flex items-center justify-between mt-3">
                      <CardPrice>${dest.price} <span className="text-sm text-zinc-500 font-normal">/ person</span></CardPrice>
                    </div>
                    <Link href={`/travel/booking?id=${dest.id}`} className="block mt-4">
                      <Button className="w-full">Book Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-500">
              No destinations found. Try a different search.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-zinc-400 mb-8">
            Join thousands of happy travelers who booked their dream vacation with us
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Explore All Destinations</Button>
            <Button variant="outline" size="lg">Contact Us</Button>
          </div>
        </div>
      </section>
    </div>
  )
}