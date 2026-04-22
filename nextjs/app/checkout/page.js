'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Button from '../../components/ui/Button'
import { Check, X, RefreshCw, Shield, CreditCard, AlertCircle, Sparkles, Zap, Shield as ShieldIcon } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo')

const subscriptionPlans = {
  basic: {
    id: 'basic',
    name: 'Basic',
    subtitle: 'DIY – Do It Yourself',
    monthlyPrice: 29,
    annualPrice: 278,
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-400',
    features: ['Knowledge Base', 'Email Support', 'Community Access'],
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    subtitle: 'DWY – Done With You',
    monthlyPrice: 99,
    annualPrice: 950,
    icon: Sparkles,
    gradient: 'from-indigo-500 to-purple-500',
    popular: true,
    features: ['Everything in Basic', 'Live Chat Support', 'Monthly Tech Audit', 'Remote Assistance'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'DFY – Done For You',
    monthlyPrice: 499,
    annualPrice: 4790,
    icon: ShieldIcon,
    gradient: 'from-amber-500 to-orange-500',
    features: ['Everything in Professional', '24/7 Priority Support', 'Dedicated Manager', 'On-site Support'],
  },
}

function CheckoutForm({ plan, isAnnual, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const price = isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice
  const total = isAnnual ? plan.annualPrice : plan.monthlyPrice

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.')
      setLoading(false)
      return
    }

    // Simulate payment processing for demo
    await new Promise(resolve => setTimeout(resolve, 2000))
    onSuccess(Date.now())
    setLoading(false)
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': { color: '#71717a' },
        backgroundColor: '#18181b',
      },
      invalid: { color: '#ef4444' },
    },
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-green-400 font-medium">Recurring Subscription</p>
            <p className="text-sm text-zinc-400">
              {isAnnual ? 'Billed annually' : 'Billed monthly'} • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-zinc-900 rounded-xl">
        <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
          <Shield className="w-4 h-4 text-green-500" />
          Secure payment with Stripe
        </div>
        <div className="p-4 border border-zinc-700 rounded-lg bg-zinc-800/50">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        size="lg" 
        className="w-full py-4 text-base"
        disabled={!stripe || loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : (
          <span>Subscribe for ${price}/month</span>
        )}
      </Button>

      <p className="text-xs text-zinc-500 text-center">
        Test mode: Use card 4242 4242 4242 4242, any future date, any CVC
      </p>

      <div className="text-center text-sm text-zinc-500">
        <p>By subscribing, you agree to our <Link href="/terms" className="text-indigo-400 hover:underline">Terms of Service</Link></p>
      </div>
    </div>
  )
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan') || 'professional'
  const initialAnnual = searchParams.get('billing') === 'annual'
  
  const [isAnnual, setIsAnnual] = useState(initialAnnual)
  const [userData, setUserData] = useState({ email: '', name: '', company: '' })
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const plan = subscriptionPlans[planId] || subscriptionPlans.professional
  const price = isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice
  const total = isAnnual ? plan.annualPrice : plan.monthlyPrice

  const handleSuccess = (id) => {
    setOrderId(id)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Subscription Activated!</h1>
          <p className="text-zinc-400 mb-6">
            Thank you for subscribing to the {plan.name} plan. Your subscription is now active.
          </p>
          <div className="bg-zinc-900 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-zinc-400 mb-2">Subscription Details:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-300">Plan:</span>
                <span className="text-white font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Billing:</span>
                <span className="text-white font-medium">{isAnnual ? 'Annual' : 'Monthly'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Amount:</span>
                <span className="text-cyan-400 font-medium">${price}/month</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-zinc-500 mb-6">
            You can manage your subscription from your dashboard. A confirmation email has been sent to {userData.email}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors">
              Go to Dashboard
            </Link>
            <Link href="/" className="px-6 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/shop" className="text-zinc-400 hover:text-white">Shop</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-white">Checkout</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Complete Your Subscription</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Selected Plan */}
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Selected Plan</h2>
                <button 
                  onClick={() => router.push('/shop')}
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Change Plan
                </button>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{plan.name}</h3>
                  <p className="text-sm text-zinc-400">{plan.subtitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${price}</div>
                  <div className="text-sm text-zinc-500">/month</div>
                </div>
              </div>

              {/* Billing Toggle */}
              <div className="mt-4 p-4 bg-zinc-800/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Billing Frequency</p>
                    <p className="text-sm text-zinc-400">
                      {isAnnual 
                        ? `Annual billing (save $${plan.monthlyPrice * 12 - plan.annualPrice}/year)` 
                        : 'Monthly billing'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAnnual(!isAnnual)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-indigo-600' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Plan Features */}
              <div className="mt-4">
                <p className="text-sm text-zinc-400 mb-2">Included features:</p>
                <div className="flex flex-wrap gap-2">
                  {plan.features.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-zinc-800/50 rounded-full text-sm text-zinc-300">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Company (Optional)</label>
                <input
                  type="text"
                  placeholder="Your company name"
                  value={userData.company}
                  onChange={(e) => setUserData({...userData, company: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Payment Details</h2>
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  plan={plan} 
                  isAnnual={isAnnual}
                  onSuccess={handleSuccess}
                />
              </Elements>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-24 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-300">{plan.name} Plan</span>
                  <span className="text-white">${price}/month</span>
                </div>
                {isAnnual && (
                  <div className="flex justify-between text-green-400">
                    <span>Annual Discount (20%)</span>
                    <span>-${Math.round((plan.monthlyPrice - price))}/mo</span>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-300">Subtotal</span>
                  <span className="text-white">${plan.monthlyPrice}/mo</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Savings</span>
                  <span>-${plan.monthlyPrice - price}/mo</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-white pt-2">
                  <span>Total</span>
                  <span className="text-cyan-400">${price}/mo</span>
                </div>
                {isAnnual && (
                  <div className="text-sm text-zinc-400 text-right">
                    Billed ${total} annually
                  </div>
                )}
              </div>

              {/* Subscription Info */}
              <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                <h3 className="text-sm font-medium text-indigo-400 mb-2">Subscription Benefits</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Cancel anytime
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Upgrade or downgrade anytime
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    30-day money-back guarantee
                  </li>
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <CreditCard className="w-4 h-4" />
                Secure SSL Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}