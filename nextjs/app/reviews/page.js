'use client'

import { useState, useEffect } from 'react'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../components/AuthProvider'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function ReviewsPage() {
  const { user, isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    product_id: '',
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [reviewsRes, productsRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/reviews?select=*&order=created_at.desc&limit=20`, {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        }),
        fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name&order=name`, {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        })
      ])

      const reviewsData = await reviewsRes.json()
      const productsData = await productsRes.json()

      setReviews(Array.isArray(reviewsData) ? reviewsData : [])
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isAuthenticated) {
      alert('Please sign in to leave a review')
      return
    }

    setSubmitting(true)
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: formData.product_id,
          rating: formData.rating,
          comment: formData.comment
        })
      })

      setSuccess(true)
      setFormData({ product_id: '', rating: 5, comment: '' })
      setShowForm(false)
      fetchData()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error submitting review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  function StarRating({ rating, interactive = false, onChange = () => {} }) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange(star)}
            className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform ${
              star <= rating ? 'text-yellow-400' : 'text-zinc-600'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Customer <span className="gradient-text">Reviews</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            See what our customers are saying about our services
          </p>
        </div>

        {/* Add Review Button */}
        {isAuthenticated && (
          <div className="mb-8">
            <Button onClick={() => setShowForm(!showForm)} className="mx-auto">
              {showForm ? 'Cancel' : 'Write a Review'}
            </Button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mb-8 text-center">
            <p className="text-zinc-400">Sign in to write a review</p>
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Write a Review</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Select Product</label>
                  <select
                    value={formData.product_id}
                    onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    required
                  >
                    <option value="">Choose a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Rating</label>
                  <StarRating rating={formData.rating} interactive onChange={(r) => setFormData({ ...formData, rating: r })} />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Your Review</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 h-32 resize-none"
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500/30 rounded-lg text-green-400 text-center">
            Thank you for your review!
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <Card key={review.id} className="card-animate hover-lift" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <StarRating rating={review.rating} />
                      <p className="text-sm text-zinc-500 mt-1">
                        {new Date(review.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-zinc-300">{review.comment}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500">
            No reviews yet. Be the first to write one!
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-4">Overall Rating</h3>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold gradient-text">
              {reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : '0.0'}
            </div>
            <div>
              <StarRating rating={Math.round(reviews.length > 0 
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
                : 0)} />
              <p className="text-zinc-400 text-sm">{reviews.length} reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}