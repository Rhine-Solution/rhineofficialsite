'use client'

import { useSearchParams, Suspense } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../components/ui/Button'

const destinationDetails = {
  1: { name: 'Bali Paradise', location: 'Bali, Indonesia' },
  2: { name: 'Paris Adventure', location: 'Paris, France' },
  3: { name: 'Tokyo Explorer', location: 'Tokyo, Japan' },
  4: { name: 'Maldives Luxury', location: 'Maldives' },
  5: { name: 'Swiss Alps', location: 'Zurich, Switzerland' },
  6: { name: 'New York City', location: 'New York, USA' },
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const destinationId = searchParams.get('id') || '1'
  const guests = searchParams.get('guests') || '1'
  
  const destination = destinationDetails[destinationId] || destinationDetails[1]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="text-8xl mb-6">✈️</div>
          <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-zinc-400">
            Your adventure to {destination.name} is booked!
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl mb-8 p-6">
          <div className="text-left space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-400">Destination</span>
              <span className="text-white font-semibold">{destination.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Location</span>
              <span className="text-white">{destination.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Guests</span>
              <span className="text-white">{guests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Booking Reference</span>
              <span className="text-indigo-400 font-mono">TRV-{Date.now().toString().slice(-8)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">View My Bookings</Button>
          </Link>
          <Link href="/travel">
            <Button variant="outline" size="lg">Browse More Destinations</Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-zinc-900/50 rounded-xl">
          <h3 className="font-semibold mb-2">What's next?</h3>
          <ul className="text-zinc-400 text-sm space-y-2 text-left">
            <li>📧 Confirmation email sent to your inbox</li>
            <li>📄 Detailed itinerary coming within 24 hours</li>
            <li>💼 Our team will contact you for travel preparation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function TravelSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}