'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X, Sparkles, Zap, Shield } from 'lucide-react'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    subtitle: 'DIY – Do It Yourself',
    description: 'Self-service tech resources for independent problem solving. Perfect for tech-savvy users who want flexibility.',
    monthlyPrice: 29,
    annualPrice: 278,
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-400',
    borderColor: 'border-blue-500/30',
    popular: false,
    cta: 'Get Started',
    features: [
      { name: 'Knowledge Base Access', included: true },
      { name: 'Email Support (48h response)', included: true },
      { name: 'Community Forum Access', included: true },
      { name: 'Video Tutorials Library', included: true },
      { name: 'Basic Tech Checklists', included: true },
      { name: 'Live Chat Support', included: false },
      { name: 'Monthly Tech Audit', included: false },
      { name: 'Guided Implementation', included: false },
      { name: 'Remote Assistance', included: false },
      { name: '24/7 Priority Support', included: false },
      { name: 'Dedicated Account Manager', included: false },
      { name: 'On-site Support', included: false },
      { name: 'Proactive Monitoring', included: false },
      { name: 'Custom Solutions', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    subtitle: 'DWY – Done With You',
    description: 'Hands-on support with guided implementation. Ideal for growing businesses needing regular tech assistance.',
    monthlyPrice: 99,
    annualPrice: 950,
    icon: Sparkles,
    gradient: 'from-indigo-500 to-purple-500',
    borderColor: 'border-indigo-500',
    popular: true,
    cta: 'Start Free Trial',
    trialDays: 14,
    features: [
      { name: 'Knowledge Base Access', included: true },
      { name: 'Email Support (24h response)', included: true },
      { name: 'Community Forum Access', included: true },
      { name: 'Video Tutorials Library', included: true },
      { name: 'Basic Tech Checklists', included: true },
      { name: 'Live Chat Support', included: true, note: 'Business Hours' },
      { name: 'Monthly Tech Audit', included: true },
      { name: 'Guided Implementation', included: true },
      { name: 'Remote Assistance', included: true, note: 'Common Issues' },
      { name: '24/7 Priority Support', included: false },
      { name: 'Dedicated Account Manager', included: false },
      { name: 'On-site Support', included: false },
      { name: 'Proactive Monitoring', included: false },
      { name: 'Custom Solutions', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'DFY – Done For You',
    description: 'Complete white-glove tech management. For businesses that want full tech handling with premium support.',
    monthlyPrice: 499,
    annualPrice: 4790,
    icon: Shield,
    gradient: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/50',
    popular: false,
    cta: 'Contact Sales',
    features: [
      { name: 'Knowledge Base Access', included: true },
      { name: 'Email Support (Priority)', included: true },
      { name: 'Community Forum Access', included: true },
      { name: 'Video Tutorials Library', included: true },
      { name: 'Basic Tech Checklists', included: true },
      { name: 'Live Chat Support', included: true, note: '24/7' },
      { name: 'Monthly Tech Audit', included: true },
      { name: 'Guided Implementation', included: true },
      { name: 'Remote Assistance', included: true, note: 'Unlimited' },
      { name: '24/7 Priority Support', included: true, note: '<30 min response' },
      { name: 'Dedicated Account Manager', included: true },
      { name: 'On-site Support', included: true, note: 'If local' },
      { name: 'Proactive Monitoring', included: true },
      { name: 'Custom Solutions', included: true },
    ],
  },
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 pt-20 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-5">
              <Sparkles className="w-4 h-4 mr-2" />
              Pricing Plans
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5">
              Simple, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Transparent</span> Pricing
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              DIY, DWY, or DFY — pick the level of support that fits your needs.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-indigo-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-white' : 'text-zinc-500'}`}>
              Annual <span className="text-green-400 font-semibold">(Save 20%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 -mt-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon
              const price = isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice
              const yearlyTotal = isAnnual ? plan.annualPrice : plan.monthlyPrice * 12
              
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular 
                      ? 'bg-gradient-to-b from-zinc-800/90 to-zinc-900/90 border-2 shadow-2xl shadow-indigo-500/20' 
                      : 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center px-5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-500/40">
                        <Sparkles className="w-4 h-4 mr-1.5" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`absolute inset-0 rounded-3xl ${plan.gradient} opacity-5`} />
                  
                  <div className="relative p-6 pt-8">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-5 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className={`text-sm font-medium mb-2 ${plan.popular ? 'text-indigo-400' : 'text-zinc-400'}`}>{plan.subtitle}</p>
                    <p className="text-zinc-400 text-sm mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-white">${price}</span>
                        <span className="text-zinc-500">/month</span>
                      </div>
                      {isAnnual && (
                        <p className="text-sm text-zinc-400 mt-1">
                          ${yearlyTotal}/year (save ${plan.monthlyPrice * 12 - plan.annualPrice})
                        </p>
                      )}
                    </div>

                    <Link
                      href={plan.id === 'enterprise' ? '/contact' : `/checkout?plan=${plan.id}&billing=${isAnnual ? 'annual' : 'monthly'}`}
                      className={`block w-full py-4 rounded-xl font-semibold text-base text-center transition-all hover:shadow-lg ${
                        plan.popular
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30'
                          : 'bg-zinc-800 text-white hover:bg-zinc-700'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                    
                    {plan.trialDays && (
                      <p className="text-center text-xs text-zinc-500 mt-4">
                        {plan.trialDays}-day free trial • No credit card required
                      </p>
                    )}
                  </div>

                  <div className="relative px-6 pb-6">
                    <div className="border-t border-zinc-800 pt-5">
                      <h4 className="text-sm font-semibold text-white mb-4">What's included:</h4>
                      <ul className="space-y-3">
                        {plan.features.slice(0, 7).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm">
                            {feature.included ? (
                              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-5 h-5 text-zinc-700 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={feature.included ? 'text-zinc-300' : 'text-zinc-600'}>
                              {feature.name}
                              {feature.note && <span className="text-zinc-500 text-xs ml-1">({feature.note})</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              { q: 'Can I upgrade or downgrade my plan anytime?', a: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the start of your next billing cycle. No hidden fees or cancellation penalties.' },
              { q: 'What happens during the 14-day free trial?', a: 'You get full access to all Professional features for 14 days. Cancel anytime during the trial and you won\'t be charged. If you continue, your subscription auto-converts.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans.' },
              { q: 'Is there a money-back guarantee?', a: 'Yes, we offer a 30-day money-back guarantee on all plans. Contact us anytime within 30 days for a full refund, no questions asked.' },
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-zinc-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a custom solution?</h2>
          <p className="text-zinc-400 mb-8">Contact us for custom enterprise pricing and dedicated support.</p>
          <Link 
            href="/contact" 
            className="inline-block px-8 py-4 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
          >
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  )
}