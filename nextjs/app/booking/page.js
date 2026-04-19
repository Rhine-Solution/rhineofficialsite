'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const destinations = [
  { id: 1, name: 'Bali Paradise', location: 'Bali, Indonesia', price: 1299, emoji: '🏝️' },
  { id: 2, name: 'Paris Adventure', location: 'Paris, France', price: 1899, emoji: '🗼' },
  { id: 3, name: 'Tokyo Explorer', location: 'Tokyo, Japan', price: 2199, emoji: '🗾' },
  { id: 4, name: 'Maldives Luxury', location: 'Maldives', price: 3499, emoji: '🏨' },
  { id: 5, name: 'Swiss Alps', location: 'Zurich, Switzerland', price: 2499, emoji: '⛰️' },
  { id: 6, name: 'New York City', location: 'New York, USA', price: 1799, emoji: '🗽' },
]

export default function Booking() {
  const searchParams = useSearchParams()
  const id = parseInt(searchParams.get('id') || '1')
  const destination = destinations.find(d => d.id === id) || destinations[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Booking submitted! This is a demo.')
  }

  return (
    <>
      <nav>
        <div className="container">
          <Link href="/" className="logo">Sunny Travels</Link>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/destinations">Destinations</Link></li>
          </ul>
        </div>
      </nav>

      <section className="booking">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '4rem' }}>{destination.emoji}</span>
            <h1 style={{ marginTop: '16px' }}>{destination.name}</h1>
            <p style={{ color: '#a1a1aa' }}>{destination.location}</p>
            <p style={{ fontSize: '2rem', color: '#f472b6', fontWeight: 'bold', marginTop: '16px' }}>
              ${destination.price}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className="form-group">
              <label htmlFor="checkin">Check-in Date</label>
              <input type="date" id="checkin" name="checkin" required />
            </div>

            <div className="form-group">
              <label htmlFor="checkout">Check-out Date</label>
              <input type="date" id="checkout" name="checkout" required />
            </div>

            <div className="form-group">
              <label htmlFor="guests">Number of Guests</label>
              <select id="guests" name="guests">
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="requests">Special Requests</label>
              <textarea id="requests" name="requests" rows="4" placeholder="Any special requests or requirements..."></textarea>
            </div>

            <button type="submit" className="btn" style={{ width: '100%' }}>
              Complete Booking
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/" style={{ color: '#a1a1aa' }}>← Back to Home</Link>
          </div>
        </div>
      </section>
    </>
  )
}