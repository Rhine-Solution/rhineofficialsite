'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { fetchFromSupabase, insertToSupabase } from '../../lib/supabase'

const DESTINATIONS = [
  { id: 1, name: 'Bali Paradise', location: 'Bali, Indonesia', price: 1299 },
  { id: 2, name: 'Paris Adventure', location: 'Paris, France', price: 1899 },
  { id: 3, name: 'Tokyo Explorer', location: 'Tokyo, Japan', price: 2199 },
  { id: 4, name: 'Maldives Luxury', location: 'Maldives', price: 3499 },
  { id: 5, name: 'Swiss Alps', location: 'Zurich, Switzerland', price: 2499 },
  { id: 6, name: 'New York City', location: 'New York, USA', price: 1799 },
]

export default function Booking() {
  const searchParams = useSearchParams()
  const id = parseInt(searchParams.get('id') || '1')
  const destination = DESTINATIONS.find(d => d.id === id) || DESTINATIONS[0]
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkin: '',
    checkout: '',
    guests: '2',
    requests: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Try to save to Supabase
      await insertToSupabase('appointments', {
        title: `Booking: ${destination.name}`,
        description: `Guest: ${formData.name}, Guests: ${formData.guests}, Check-in: ${formData.checkin}`,
        datetime: formData.checkin,
        duration_minutes: 120,
        status: 'scheduled',
        notes: formData.requests,
        created_at: new Date().toISOString()
      })
    } catch (e) {
      console.log('Could not save to database')
    }
    
    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
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
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <span style={{ fontSize: '4rem' }}>✅</span>
              <h1 style={{ marginTop: '24px' }}>Booking Confirmed!</h1>
              <p style={{ color: '#a1a1aa', marginTop: '12px' }}>
                Thank you, {formData.name}! Your trip to {destination.name} has been booked.
              </p>
              <p style={{ color: '#a1a1aa', marginTop: '8px' }}>
                A confirmation email will be sent to {formData.email}
              </p>
              <Link href="/" style={{ display: 'inline-block', marginTop: '32px' }} className="btn">
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </>
    )
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
            <span style={{ fontSize: '4rem' }}>✈️</span>
            <h1 style={{ marginTop: '16px' }}>{destination.name}</h1>
            <p style={{ color: '#a1a1aa' }}>{destination.location}</p>
            <p style={{ fontSize: '2rem', color: '#f472b6', fontWeight: 'bold', marginTop: '16px' }}>
              ${destination.price}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="checkin">Check-in Date</label>
              <input 
                type="date" 
                id="checkin" 
                name="checkin" 
                required
                value={formData.checkin}
                onChange={(e) => setFormData({...formData, checkin: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="checkout">Check-out Date</label>
              <input 
                type="date" 
                id="checkout" 
                name="checkout" 
                required
                value={formData.checkout}
                onChange={(e) => setFormData({...formData, checkout: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="guests">Number of Guests</label>
              <select 
                id="guests" 
                name="guests"
                value={formData.guests}
                onChange={(e) => setFormData({...formData, guests: e.target.value})}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="requests">Special Requests</label>
              <textarea 
                id="requests" 
                name="requests" 
                rows="4" 
                placeholder="Any special requests or requirements..."
                value={formData.requests}
                onChange={(e) => setFormData({...formData, requests: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%' }}
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Complete Booking'}
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