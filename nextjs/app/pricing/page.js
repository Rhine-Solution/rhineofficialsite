'use client'

import Link from 'next/link'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const plans = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for hobby projects and small websites',
    features: [
      '5 GB Storage',
      'Basic Analytics',
      'Community Support',
      '1 Custom Domain',
      'Standard SSL',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 29,
    description: 'Best for growing businesses and teams',
    features: [
      '50 GB Storage',
      'Advanced Analytics',
      'Priority Support',
      'Unlimited Domains',
      'Premium SSL',
      'API Access',
      'Custom Integrations',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited Storage',
      'Real-time Analytics',
      '24/7 Dedicated Support',
      'Unlimited Domains',
      'Enterprise SSL',
      'Full API Access',
      'Custom Integrations',
      'SLA Guarantee',
      'Dedicated Account Manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
            <button className="px-6 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-md text-zinc-400 text-sm font-medium hover:text-white transition-colors">
              Yearly <span className="text-green-400 text-xs ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative card-animate hover-lift ${plan.popular ? 'border-indigo-500 glow-primary' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <CardContent className="p-8">
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <p className="text-zinc-400 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-zinc-500">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center text-sm text-zinc-300">
                      <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'primary' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
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