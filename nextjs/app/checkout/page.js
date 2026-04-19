'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'

// Use your Stripe publishable key here (or env variable)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo')

function CheckoutForm({ total }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.')
      setLoading(false)
      return
    }

    const cardElement = elements.getElement(CardElement)

    // In production, you'd create a payment intent on your backend
    // For demo, we'll simulate the payment
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (stripeError) {
      setError(stripeError.message)
      setLoading(false)
      return
    }

    // Simulate successful payment (in production, verify with backend)
    console.log('Payment method created:', paymentMethod.id)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    router.push(`/checkout/success?order=${Date.now()}`)
    setLoading(false)
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#71717a',
        },
        backgroundColor: '#18181b',
      },
      invalid: {
        color: '#ef4444',
      },
    },
  }

  return (
    <>
      <div className="p-4 bg-zinc-900 rounded-lg mb-4">
        <p className="text-zinc-400 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure payment with Stripe
        </p>
      </div>
      
      <div className="p-4 border border-zinc-700 rounded-lg bg-zinc-900/50 mb-4">
        <CardElement options={cardElementOptions} />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        size="lg" 
        className="w-full"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>

      <p className="text-xs text-zinc-500 text-center mt-4">
        Test mode: Use card 4242 4242 4242 4242, any future date, any CVC
      </p>
    </>
  )
}

export default function CheckoutPage() {
  const [orderData, setOrderData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    notes: ''
  })

  // Mock cart data
  const cartItems = [
    { id: '1', name: 'Premium Web Hosting', price: 29, quantity: 1 },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 0
  const total = subtotal + shipping

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/shop" className="text-zinc-400 hover:text-white">Shop</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-white">Checkout</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form>
              {/* Contact Info */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <CardTitle className="mb-4">Contact Information</CardTitle>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      value={orderData.name}
                      onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      value={orderData.email}
                      onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <CardTitle className="mb-4">Billing Address</CardTitle>
                  <div className="space-y-4">
                    <Input
                      label="Address"
                      placeholder="123 Main Street"
                      value={orderData.address}
                      onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="City"
                        placeholder="New York"
                        value={orderData.city}
                        onChange={(e) => setOrderData({...orderData, city: e.target.value})}
                        required
                      />
                      <Input
                        label="ZIP Code"
                        placeholder="10001"
                        value={orderData.zip}
                        onChange={(e) => setOrderData({...orderData, zip: e.target.value})}
                        required
                      />
                    </div>
                    <Input
                      label="Country"
                      placeholder="United States"
                      value={orderData.country}
                      onChange={(e) => setOrderData({...orderData, country: e.target.value})}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <CardTitle className="mb-4">Payment Details</CardTitle>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm total={total} />
                  </Elements>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <CardTitle className="mb-4">Order Notes</CardTitle>
                  <Textarea
                    placeholder="Any special instructions..."
                    rows={3}
                    value={orderData.notes}
                    onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                  />
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <CardTitle className="mb-4">Order Summary</CardTitle>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="text-white">{item.name}</p>
                        <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-700 pt-4 space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-white pt-2">
                    <span>Total</span>
                    <span className="text-cyan-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-zinc-900 rounded-lg">
                  <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
                    <span>🔒 Secure</span>
                    <span>💳 Stripe</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}