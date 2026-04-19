'use client'

import { useState } from 'react'
import Link from 'next/link'

const destinations = [
  { id: 1, name: 'Bali Paradise', location: 'Bali, Indonesia', price: 1299, emoji: '🏝️', category: 'beach' },
  { id: 2, name: 'Paris Adventure', location: 'Paris, France', price: 1899, emoji: '🗼', category: 'city' },
  { id: 3, name: 'Tokyo Explorer', location: 'Tokyo, Japan', price: 2199, emoji: '🗾', category: 'city' },
  { id: 4, name: 'Maldives Luxury', location: 'Maldives', price: 3499, emoji: '🏨', category: 'beach' },
  { id: 5, name: 'Swiss Alps', location: 'Zurich, Switzerland', price: 2499, emoji: '⛰️', category: 'mountain' },
  { id: 6, name: 'New York City', location: 'New York, USA', price: 1799, emoji: '🗽', category: 'city' },
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !category || dest.category === category
    return matchesSearch && matchesCategory
  })

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

      <section className="hero">
        <h1>Discover Your Next Adventure</h1>
        <p>Explore amazing destinations around the world and book your dream vacation today.</p>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="beach">Beach</option>
            <option value="city">City</option>
            <option value="mountain">Mountain</option>
          </select>
          <button className="btn">Search</button>
        </div>
      </section>

      <section className="destinations">
        <div className="container">
          <h2>Popular Destinations</h2>
          <div className="grid">
            {filteredDestinations.map(dest => (
              <div key={dest.id} className="card">
                <div className="card-image">{dest.emoji}</div>
                <div className="card-content">
                  <h3 className="card-title">{dest.name}</h3>
                  <p className="card-location">{dest.location}</p>
                  <div className="card-price">
                    ${dest.price} <span>/ person</span>
                  </div>
                  <Link href={`/booking?id=${dest.id}`}>
                    <button className="btn" style={{ marginTop: '16px', width: '100%' }}>
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2026 Sunny Travels. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}