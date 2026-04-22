'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import Card, { CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import FadeInSection from '../../components/ui/FadeInSection'
import { useDebounce } from '../../hooks/useDebounce'
import { FAQSchema } from '../../components/JsonLd'

const faqCategories = [
  { 
    id: 'general', 
    label: 'Getting Started', 
    icon: '🚀', 
    desc: 'New here? Start here!',
    color: 'from-emerald-500 to-teal-500',
    steps: ['Create Account', 'Browse Services', 'Make First Purchase']
  },
  { 
    id: 'account', 
    label: 'My Account', 
    icon: '👤', 
    desc: 'Manage your profile',
    color: 'from-violet-500 to-purple-500',
    steps: ['Login', 'Update Profile', 'Change Password']
  },
  { 
    id: 'billing', 
    label: 'Billing & Payments', 
    icon: '💳', 
    desc: 'Payments & refunds',
    color: 'from-amber-500 to-orange-500',
    steps: ['Payment Methods', 'Invoices', 'Request Refund']
  },
  { 
    id: 'technical', 
    label: 'Technical Help', 
    icon: '🔧', 
    desc: 'Setup & troubleshooting',
    color: 'from-blue-500 to-cyan-500',
    steps: ['Setup Guide', 'API Access', 'Contact Support']
  },
  { 
    id: 'orders', 
    label: 'Orders & Delivery', 
    icon: '📦', 
    desc: 'Track your orders',
    color: 'from-rose-500 to-pink-500',
    steps: ['View Orders', 'Track Delivery', 'Cancel Order']
  },
  { 
    id: 'travel', 
    label: 'Travel Bookings', 
    icon: '✈️', 
    desc: 'Trip planning help',
    color: 'from-indigo-500 to-violet-500',
    steps: ['Browse Destinations', 'Book Trip', 'Modify Booking']
  },
]

const faqs = [
  // Getting Started
  {
    category: 'general',
    question: 'What is Rhine Solution?',
    answer: 'Rhine Solution is an enterprise-grade multi-service platform offering e-commerce, travel booking, portfolio management, and more. We provide modern web solutions built with cutting-edge technologies including Next.js, React, Supabase, and Vercel.'
  },
  {
    category: 'general',
    question: 'How do I get started?',
    answer: '1. Create an account using Register\n2. Browse our services in the Shop\n3. Add items to your cart\n4. Complete checkout\n5. Receive confirmation email\n\nThat\'s it! You\'re ready to go.'
  },
  {
    category: 'general',
    question: 'What services do you offer?',
    answer: 'We offer:\n• Web Hosting & Domains\n• SSL Certificates\n• SEO & Marketing Services\n• Custom Web Development\n• Travel Booking\n• Appointment Scheduling\n\nBrowse shop.rhinesolution.com for complete catalog.'
  },
  {
    category: 'general',
    question: 'Is my data secure?',
    answer: 'Yes! We use:\n• SSL encryption\n• Secure Supabase database\n• Cloudflare Turnstile verification\n• Enterprise-grade security\n• Regular security audits'
  },

  // Account
  {
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Click "Register" in the nav bar:\n• Sign up with email\n• Or use Google/GitHub OAuth\n• Verify your email\n• Start browsing!'
  },
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer: '1. Go to Login page\n2. Click "Forgot Password"\n3. Enter your email\n4. Check your inbox\n5. Click reset link\n6. Create new password'
  },
  {
    category: 'account',
    question: 'How do I update my profile?',
    answer: '1. Login to your account\n2. Go to Profile page\n3. Edit name, email, phone, company, bio\n4. Click Save\n\nYour changes are saved automatically.'
  },

  // Billing
  {
    category: 'billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept:\n• Visa, MasterCard, American Express\n• Apple Pay & Google Pay\n• All major credit/debit cards\n\nProcessed securely through Stripe.'
  },
  {
    category: 'billing',
    question: 'Can I get a refund?',
    answer: 'Yes! Our refund policy:\n• 30-day money-back guarantee\n• Contact support within 30 days\n• Full refund to original payment\n• Processed within 5-7 business days'
  },
  {
    category: 'billing',
    question: 'How do I view my invoices?',
    answer: '1. Go to Dashboard\n2. Click Orders\n3. View each order details\n4. Download invoice as PDF\n\nAll invoices are sent via email too.'
  },

  // Technical
  {
    category: 'technical',
    question: 'What technologies do you use?',
    answer: 'Our tech stack:\n• Frontend: Next.js 14, React\n• Styling: Tailwind CSS\n• Database: Supabase (PostgreSQL)\n• Hosting: Vercel\n• Security: Cloudflare\n• Payments: Stripe'
  },
  {
    category: 'technical',
    question: 'Do you offer custom development?',
    answer: 'Yes! Development services:\n• API Development\n• Mobile App MVP\n• Custom Integrations\n• E-commerce Solutions\n\nCheck our Shop for packages or contact us.'
  },
  {
    category: 'technical',
    question: 'What is your uptime guarantee?',
    answer: 'We guarantee:\n• 99.9% uptime\n• Enterprise servers\n• Redundant infrastructure\n• 24/7 monitoring\n• Automatic failover'
  },

  // Orders
  {
    category: 'orders',
    question: 'How do I track my order?',
    answer: 'Track your order:\n1. Go to Dashboard\n2. Click Orders\n3. View order status\n4. Get real-time updates\n\nEmail notifications sent automatically.'
  },
  {
    category: 'orders',
    question: 'How long does delivery take?',
    answer: 'Delivery times:\n• Digital products: Instant\n• Hosting setup: 1-24 hours\n• Domain registration: 1-48 hours\n• Services: Per project timeline'
  },
  {
    category: 'orders',
    question: 'Can I cancel my order?',
    answer: 'Cancel an order:\n• Within 24 hours of purchase\n• Service not yet delivered\n• Contact support team\n• Full refund to original payment'
  },

  // Travel
  {
    category: 'travel',
    question: 'How do I book a trip?',
    answer: 'Book your trip:\n1. Go to Travel section\n2. Browse destinations\n3. Click "Book Now"\n4. Select dates & guests\n5. Enter details\n6. Confirm & pay'
  },
  {
    category: 'travel',
    question: 'Can I modify my booking?',
    answer: 'Modify your booking:\n• Contact 48+ hours before check-in\n• Change dates or guest count\n• Update special requests\n• Subject to availability'
  },
  {
    category: 'travel',
    question: 'What\'s included in travel packages?',
    answer: 'Each package includes:\n✓ Accommodation\n✓ Meals (as specified)\n✓ Airport transfers\n✓ Guided tours\n✓ Activities\n\nCheck destination for details.'
  },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openQuestion, setOpenQuestion] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const debouncedSearch = useDebounce(searchTerm, 300)
  const isSearching = searchTerm !== debouncedSearch

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = !debouncedSearch || 
      faq.question.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(debouncedSearch.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const currentCategory = faqCategories.find(c => c.id === selectedCategory)

  // Transform faqs for JSON-LD schema
  const faqSchemaData = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer.replace(/\n/g, ' ').replace(/•/g, '').trim()
  }))

  return (
    <div className="min-h-screen">
      <FAQSchema faqs={faqSchemaData} />
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How can we <span className="gradient-text">help you?</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            Choose a category below or search for answers
          </p>
          {/* Search Input */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-zinc-900/80 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {searchTerm && !isSearching && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Visual Category Guide */}
      <section className="py-12 -mt-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {faqCategories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'ring-2 ring-offset-2 ring-offset-zinc-950'
                    : 'hover:scale-[1.02]'
                }`}
                style={{ '--tw-ring-color': selectedCategory === cat.id ? '#6366f1' : 'transparent' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-${selectedCategory === cat.id ? '30' : '10'} group-hover:opacity-20 transition-opacity`} />
                <div className="relative z-10">
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-white text-lg mb-1">{cat.label}</h3>
                  <p className="text-sm text-zinc-400">{cat.desc}</p>
                  
                  {/* Steps preview */}
                  <div className="mt-4 pt-4 border-t border-zinc-700/50">
                    <div className="text-xs text-zinc-500 mb-2">Quick steps:</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.steps.slice(0, 2).map((step, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Current Category Steps */}
      {selectedCategory !== 'all' && currentCategory && (
        <section className="py-8 bg-zinc-900/50 border-y border-zinc-800">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl">{currentCategory.icon}</span>
              <div>
                <h2 className="text-xl font-bold">{currentCategory.label}</h2>
                <p className="text-zinc-400 text-sm">Follow these steps to get started</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {currentCategory.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-zinc-300">{step}</span>
                  {index < currentCategory.steps.length - 1 && (
                    <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Categories Reset */}
      {selectedCategory !== 'all' && (
        <section className="py-4">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <button
              onClick={() => { setSelectedCategory('all'); setOpenQuestion(null) }}
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              ← View all categories
            </button>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'All Questions' : currentCategory?.label + ' Questions'}
            </h2>
            <span className="text-zinc-500 text-sm">{filteredFaqs.length} questions</span>
          </div>

          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-500 mb-4">No FAQs match your search.</p>
                <Link href="/contact" className="text-indigo-400 hover:text-indigo-300">
                  Contact support →
                </Link>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const cat = faqCategories.find(c => c.id === faq.category)
                return (
                  <FadeInSection key={index} delay={index * 0.05}>
                    <Card 
                      className={`overflow-hidden transition-all duration-300 ${
                        openQuestion === index 
                          ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                          : 'hover:border-zinc-700'
                      }`}
                    >
                      <button
                        onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{cat?.icon}</span>
                          <span className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                            {faq.question}
                          </span>
                        </div>
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-all duration-300 ${
                          openQuestion === index ? 'rotate-180 bg-indigo-600 text-white' : ''
                        }`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                  </button>
                  {openQuestion === index && (
                    <CardContent className="pt-0 pb-5 px-5">
                      <div className="pl-8">
                        {faq.answer.split('\n').map((line, i) => {
                          if (line.startsWith('•') || line.startsWith('✓') || line.match(/^\d+\./)) {
                            return <div key={i} className="text-zinc-400 mb-1">{line}</div>
                          }
                          return line.trim() ? <p key={i} className="text-zinc-400 mb-2">{line}</p> : <div key={i} className="h-2" />
                        })}
                      </div>
                    </CardContent>
                  )}
                    </Card>
                  </FadeInSection>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Need More Help */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-zinc-400 mb-8">Our support team is here to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="glow-primary">
                Contact Us
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}