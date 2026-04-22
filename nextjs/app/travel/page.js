'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Card, { CardImage, CardContent, CardTitle, CardDescription, CardPrice } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { CardSkeleton } from '../../components/ui/PageLoader'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

const categories = [
  { id: 'all', label: 'All Destinations', icon: '🌍' },
  { id: 'beach', label: 'Beach', icon: '🏝️' },
  { id: 'city', label: 'City', icon: '🗼' },
  { id: 'mountain', label: 'Mountain', icon: '⛰️' },
  { id: 'island', label: 'Island', icon: '🏝️' },
]

const fallbackDestinations = [
  { id: '1', name: 'Bali Paradise', location: 'Bali, Indonesia', price: 1299, category: 'beach', description: 'Beautiful beach resort with ocean views', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
  { id: '2', name: 'Paris Adventure', location: 'Paris, France', price: 1899, category: 'city', description: 'Romantic getaway in the city of lights', image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
  { id: '3', name: 'Tokyo Explorer', location: 'Tokyo, Japan', price: 2199, category: 'city', description: 'Cultural experience in the capital of Japan', image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
  { id: '4', name: 'Maldives Luxury', location: 'Maldives', price: 3499, category: 'island', description: '5-star luxury resort on private island', image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400' },
  { id: '5', name: 'Swiss Alps', location: 'Zurich, Switzerland', price: 2499, category: 'mountain', description: 'Skiing and mountain adventure', image_url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400' },
  { id: '6', name: 'New York City', location: 'New York, USA', price: 1799, category: 'city', description: 'Complete NYC experience with Broadway shows', image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
]

function DestinationsGrid({ destinations, selectedCategory, searchTerm }) {
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dest.description && dest.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (filteredDestinations.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No destinations found. Try a different search.
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredDestinations.map((dest, index) => (
        <Card 
          key={dest.id} 
          className="card-animate hover-lift group"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardImage 
            src={dest.image_url} 
            alt={dest.name}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <CardContent>
            <div className="text-xs text-indigo-400 mb-1 capitalize">{dest.category}</div>
            <CardTitle className="group-hover:text-indigo-400 transition-colors">
              {dest.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">{dest.description}</CardDescription>
            <div className="flex items-center justify-between mt-4">
              <CardPrice>${dest.price}</CardPrice>
              <span className="text-sm text-zinc-500">{dest.duration_days || 5} days</span>
            </div>
            <Link href={`/travel/booking?id=${dest.id}`}>
              <Button className="w-full mt-4">Book Now</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const DestinationsSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
)

export default function TravelPage() {
  const [destinations, setDestinations] = useState(fallbackDestinations)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDestinations()
  }, [])

  async function fetchDestinations() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/destinations?select=*&is_active=true&order=created_at.desc`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      )
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setDestinations(data)
      }
    } catch (error) {
      console.log('Using fallback destinations')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-indigo-900/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Travel <span className="text-indigo-500">Destinations</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Discover amazing destinations around the world and book your next adventure
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid with Suspense */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Suspense fallback={<DestinationsSkeleton />}>
            <DestinationsGrid 
              destinations={destinations}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
            />
          </Suspense>
        </div>
      </section>
    </div>
  )
}