'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Card, { CardContent } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input, { Textarea } from '../../../components/ui/Input'
import { useAuth } from '../../../components/AuthProvider'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

const destinationDetails = {
  1: { name: 'Bali Paradise', location: 'Bali, Indonesia', price: 1299, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', duration: '7 days', includes: ['Hotel', 'Breakfast', 'Tours', 'Airport Transfer'] },
  2: { name: 'Paris Adventure', location: 'Paris, France', price: 1899, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', duration: '5 days', includes: ['Hotel', 'Breakfast', 'City Tour', 'Museum Pass'] },
  3: { name: 'Tokyo Explorer', location: 'Tokyo, Japan', price: 2199, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', duration: '8 days', includes: ['Hotel', 'JR Pass', 'Tours', 'Airport Transfer'] },
  4: { name: 'Maldives Luxury', location: 'Maldives', price: 3499, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400', duration: '6 days', includes: ['Luxury Resort', 'All Meals', 'Water Sports', 'Seaplane Transfer'] },
  5: { name: 'Swiss Alps', location: 'Zurich, Switzerland', price: 2499, image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400', duration: '7 days', includes: ['Hotel', 'Swiss Travel Pass', 'Ski Lessons', 'Mountain Tour'] },
  6: { name: 'New York City', location: 'New York, USA', price: 1799, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', duration: '6 days', includes: ['Hotel', 'Broadway Tickets', 'City Pass', 'Airport Transfer'] },
}

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const destinationId = searchParams.get('id')
  
  const [bookingData, setBookingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    guests: 1,
    specialRequests: ''
  })
  const [loading, setLoading] = useState(false)

  const numericId = parseInt(destinationId) || 1
  const destination = destinationDetails[numericId] || destinationDetails[1] || {
    name: 'Destination',
    location: 'Location',
    price: 0,
    image: '',
    duration: '0 days',
    includes: []
  }
  const total = (destination?.price || 0) * bookingData.guests

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Save booking to Supabase
      const bookingPayload = {
        user_id: user?.id || null,
        destination_id: destinationId,
        status: 'pending',
        guest_name: bookingData.fullName,
        guest_email: bookingData.email,
        check_in: bookingData.travelDate,
        check_out: bookingData.travelDate,
        guests: bookingData.guests,
        total_price: total,
        special_requests: bookingData.specialRequests
      }

      await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(bookingPayload)
      })

      router.push(`/travel/success?id=${destinationId}&guests=${bookingData.guests}`)
    } catch (error) {
      console.error('Booking error:', error)
      // Continue anyway for demo
      router.push(`/travel/success?id=${destinationId}&guests=${bookingData.guests}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8 text-zinc-400">
          <Link href="/travel" className="hover:text-white">Travel</Link>
          <span>/</span>
          <span className="text-white">Booking</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Traveler Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      value={bookingData.fullName}
                      onChange={(e) => setBookingData({...bookingData, fullName: e.target.value})}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+1 234 567 890"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      required
                    />
                    <Input
                      label="Travel Date"
                      type="date"
                      value={bookingData.travelDate}
                      onChange={(e) => setBookingData({...bookingData, travelDate: e.target.value})}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Number of Guests</label>
                      <select
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                      >
                        {[1,2,3,4,5,6].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Textarea
                      label="Special Requests"
                      placeholder="Dietary requirements, accessibility needs, etc."
                      rows={3}
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Processing Booking...' : `Book Now - $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Trip Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold">{destination.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{destination.location}</p>
                
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Duration</span>
                    <span className="text-white">{destination.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Guests</span>
                    <span className="text-white">{bookingData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Price per person</span>
                    <span className="text-white">${destination.price}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4 mb-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-cyan-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">What's Included:</h4>
                  <ul className="space-y-1">
                    {destination.includes.map(item => (
                      <li key={item} className="text-sm text-zinc-400 flex items-center gap-2">
                        <span className="text-green-400">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="min-h-screen py-20 text-center">
      <div className="text-zinc-400">Loading...</div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BookingContent />
    </Suspense>
  )
}