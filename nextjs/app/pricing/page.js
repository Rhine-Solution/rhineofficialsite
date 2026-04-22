'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const STORAGE_KEY = 'pricing_ab_variant'

function getVariant() {
  if (typeof window === 'undefined') return 'default'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return stored
  const variant = Math.random() > 0.5 ? 'highlight-pro' : 'default'
  localStorage.setItem(STORAGE_KEY, variant)
  return variant
}

const plans = [
  {
    name: 'Basic',
    model: 'DIY',
    monthly: 29,
    annual: 278,
    description: 'Perfect for those who want to manage their own tech stack',
    features: [
      'Knowledge base access',
      'Email support (48h response)',
      'Community forum access',
      'Video tutorials library',
      'Basic tech checklists',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    model: 'DWY',
    monthly: 99,
    annual: 950,
    description: 'Best for growing businesses needing guided implementation',
    features: [
      'Everything in Basic, plus:',
      'Live chat support',
      'Monthly tech audit',
      'Guided implementation',
      'Remote assistance',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    model: 'DFY',
    monthly: 499,
    annual: 4790,
    description: 'For organizations requiring full-service IT management',
    features: [
      'Everything in Professional, plus:',
      '24/7 live chat support',
      'Unlimited remote assistance',
      'Dedicated account manager',
      'On-site support',
      'Proactive monitoring',
      'Custom solutions',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingPage() {
  const [layout, setLayout] = useState('default')
  const [isAnnual, setIsAnnual] = useState(false)

  useEffect(() => {
    setLayout(getVariant())
  }, [])

  const trackConversion = (planName, variant) => {
    if (typeof window !== 'undefined') {
      console.log('Pricing CTA:', planName, variant, isAnnual ? 'annual' : 'monthly')
      if (window.umami) {
        window.umami.track('pricing_cta_click', { plan: planName, variant })
      }
    }
  }

  const handleCtaClick = (planName) => {
    trackConversion(planName, layout)
  }

  const getPrice = (plan) => isAnnual ? plan.annual : plan.monthly

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Choose Your <span className="gradient-text dark:text-white">Plan</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto">
            DIY, DWY, or DFY — pick the level of support that fits your needs.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
              A/B Test Variant: {layout}
            </div>
          )}
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-gray-100 dark:bg-zinc-900 rounded-lg p-1 border border-gray-200 dark:border-zinc-800">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                !isAnnual 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                isAnnual 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Yearly <span className="text-green-500 text-xs ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className={`grid gap-8 max-w-5xl mx-auto ${
          layout === 'highlight-pro' 
            ? 'md:grid-cols-3 md:gap-4' 
            : 'md:grid-cols-3'
        }`}>
          {plans.map((plan, index) => {
            const isHighlighted = layout === 'highlight-pro' && plan.name === 'Professional'
            const isPopular = plan.name === 'Professional'
            
            return (
              <Card 
                key={plan.name} 
                className={`relative card-animate hover-lift transition-all ${
                  isPopular || isHighlighted 
                    ? 'border-indigo-500 glow-primary' 
                    : ''
                } ${
                  layout === 'highlight-pro' && isHighlighted 
                    ? 'md:scale-110 md:-my-4 md:z-10 shadow-2xl shadow-indigo-500/30' 
                    : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {(isPopular || isHighlighted) && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-medium rounded-full ${
                    layout === 'highlight-pro' && isHighlighted
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950'
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {layout === 'highlight-pro' && isHighlighted ? '🏆 Best Value' : 'Most Popular'}
                  </div>
                )}
                <CardContent className={`p-8 ${layout === 'highlight-pro' && isHighlighted ? 'p-10' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                      {plan.model}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className={`font-bold text-gray-900 dark:text-white ${layout === 'highlight-pro' && isHighlighted ? 'text-5xl' : 'text-4xl'}`}>${getPrice(plan)}</span>
                    <span className="text-gray-500 dark:text-zinc-500">/month</span>
                    {isAnnual && (
                      <div className="text-sm text-gray-500 dark:text-zinc-500 mt-1">
                        ${plan.annual}/year billed annually
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-600 dark:text-zinc-300">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href={plan.name === 'Enterprise' ? '/contact' : `/checkout?plan=${plan.name.toLowerCase()}`}
                    onClick={() => handleCtaClick(plan.name)}
                  >
                    <Button 
                      className="w-full" 
                      variant={isPopular || isHighlighted ? 'primary' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              { q: 'Can I change plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
              { q: 'Is there a free trial?', a: 'Yes! All paid plans include a 14-day free trial. No credit card required.' },
              { q: 'What happens if I exceed my limits?', a: 'We\'ll notify you when you\'re close to your limits. You can upgrade or pay for overages.' },
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-zinc-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-zinc-400 mb-4">Need a custom solution?</p>
          <Link href="/contact">
            <Button variant="outline" size="lg">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}