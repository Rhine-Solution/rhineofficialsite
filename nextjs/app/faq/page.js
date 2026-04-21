'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card, { CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const faqCategories = [
  { id: 'general', label: 'General', icon: '🏢', color: 'from-blue-500 to-cyan-500' },
  { id: 'account', label: 'Account', icon: '👤', color: 'from-purple-500 to-pink-500' },
  { id: 'billing', label: 'Billing', icon: '💳', color: 'from-green-500 to-emerald-500' },
  { id: 'technical', label: 'Technical', icon: '⚙️', color: 'from-orange-500 to-amber-500' },
  { id: 'orders', label: 'Orders', icon: '📦', color: 'from-rose-500 to-red-500' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: 'from-indigo-500 to-violet-500' },
]

const faqs = [
  {
    category: 'general',
    question: 'What is Rhine Solution?',
    answer: 'Rhine Solution is an enterprise-grade multi-service platform offering e-commerce, travel booking, portfolio management, and more. We provide modern web solutions built with cutting-edge technologies including Next.js, React, Supabase, and Vercel.'
  },
  {
    category: 'general',
    question: 'What services do you offer?',
    answer: 'We offer a wide range of services including web hosting, domain registration, SSL certificates, SEO services, custom web development, travel booking, appointment scheduling, and portfolio management. Browse our shop for complete details.'
  },
  {
    category: 'general',
    question: 'How do I get started?',
    answer: 'Simply create an account by clicking "Register" in the navigation. You can sign up with email or use Google/GitHub for quick access. Once registered, you can browse our services, make bookings, and manage your account.'
  },
  {
    category: 'general',
    question: 'Is my data secure?',
    answer: 'Absolutely! We use industry-standard security practices including SSL encryption, secure database storage with Supabase (PostgreSQL), human verification via Cloudflare Turnstile, and regular security audits. Your data is protected with enterprise-grade security.'
  },
  {
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Click on the "Register" button in the navigation bar. You can sign up using your email address or use Google/GitHub OAuth for faster one-click registration. It only takes a minute to get started!'
  },
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Go to the login page and click "Forgot Password". Enter your email address and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
  },
  {
    category: 'account',
    question: 'Can I update my profile information?',
    answer: 'Yes! Visit your Profile page to update your name, email, phone, company, and bio. Your profile information helps us provide better service and personalize your experience.'
  },
  {
    category: 'billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) through our secure Stripe payment system. We also support digital wallets like Apple Pay and Google Pay for quick checkout.'
  },
  {
    category: 'billing',
    question: 'Can I get a refund?',
    answer: 'Yes! We offer a 30-day money-back guarantee on most services. If you\'re not satisfied, contact our support team within 30 days of purchase to request a full refund.'
  },
  {
    category: 'billing',
    question: 'How do I update my billing information?',
    answer: 'Go to your Profile page and navigate to the Billing section. You can update your payment methods, billing address, and view your payment history there.'
  },
  {
    category: 'billing',
    question: 'Do you offer discounts for annual plans?',
    answer: 'Yes! We offer significant discounts for annual subscriptions. Check our pricing page for current offers - you can save up to 30% by choosing annual billing.'
  },
  {
    category: 'technical',
    question: 'What technologies do you use?',
    answer: 'Our platform is built with modern, cutting-edge technologies: Next.js 14 for the frontend, React for UI components, Tailwind CSS for styling, Supabase (PostgreSQL) for the database, Vercel for deployment, and Cloudflare for DNS and security.'
  },
  {
    category: 'technical',
    question: 'Do you offer custom development?',
    answer: 'Yes! We offer custom web development services. Browse our shop for development packages like API Development, Mobile App MVP, and Custom Integration Pro. For unique requirements, contact us directly.'
  },
  {
    category: 'technical',
    question: 'What is the uptime guarantee?',
    answer: 'We guarantee 99.9% uptime for all our hosting services. Our infrastructure is built on enterprise-grade servers with redundancy, ensuring your applications stay available around the clock.'
  },
  {
    category: 'technical',
    question: 'How do I get technical support?',
    answer: 'You can reach our technical support team through the contact form, by email, or through our support tickets. Premium customers get priority support with faster response times.'
  },
  {
    category: 'orders',
    question: 'How do I track my order?',
    answer: 'Go to your Dashboard and click on "Orders" to see the status of all your purchases. You\'ll also receive email notifications when your order status changes - from processing to completed.'
  },
  {
    category: 'orders',
    question: 'How long does delivery take?',
    answer: 'Digital products like hosting, domains, and SSL certificates are delivered instantly via email. For services like custom development or SEO packages, delivery times vary - check the product description for estimated timelines.'
  },
  {
    category: 'orders',
    question: 'Can I cancel my order?',
    answer: 'You can cancel orders within 24 hours of purchase if the service hasn\'t been delivered. Contact our support team to request a cancellation. Refunds are processed within 5-7 business days.'
  },
  {
    category: 'orders',
    question: 'Where can I view my purchase history?',
    answer: 'Visit the Orders page in your dashboard to view your complete purchase history, including order details, status, and invoices.'
  },
  {
    category: 'travel',
    question: 'How do I book a travel destination?',
    answer: 'Browse our Travel section, select your desired destination, choose your travel dates and number of guests, fill in your details, and complete the booking. You\'ll receive a confirmation email instantly.'
  },
  {
    category: 'travel',
    question: 'Can I modify my travel booking?',
    answer: 'Yes! Contact our support team at least 48 hours before your check-in date to modify your booking. We can help change dates, update guest information, or adjust special requests.'
  },
  {
    category: 'travel',
    question: 'What is included in the travel package?',
    answer: 'Each travel package includes accommodation, meals (as specified), airport transfers, guided tours, and activities. Check the destination details for specific inclusions.'
  },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openQuestion, setOpenQuestion] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categoryStats = faqs.reduce((acc, faq) => {
    acc[faq.category] = (acc[faq.category] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 relative">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              Help Center
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Find answers to common questions about our services, billing, and more
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-12">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-900/80 border border-zinc-700 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{faqs.length}</div>
              <div className="text-sm text-zinc-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{faqCategories.length}</div>
              <div className="text-sm text-zinc-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-zinc-500">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-y border-zinc-800 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => { setSelectedCategory('all'); setOpenQuestion(null) }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              All ({faqs.length})
            </button>
            {faqCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setOpenQuestion(null) }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-xs opacity-70">({categoryStats[cat.id] || 0})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => {
                const cat = faqCategories.find(c => c.id === faq.category)
                return (
                  <Card 
                    key={index} 
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
                      <div className="flex items-center gap-4">
                        <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat?.color || 'from-zinc-500 to-zinc-600'} flex items-center justify-center text-lg shrink-0`}>
                          {cat?.icon || '❓'}
                        </span>
                        <span className="font-medium text-white text-base group-hover:text-indigo-400 transition-colors">
                          {faq.question}
                        </span>
                      </div>
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-all duration-300 ${
                        openQuestion === index ? 'rotate-180 bg-indigo-600 text-white' : ''
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    {openQuestion === index && (
                      <CardContent className="pt-0 pb-5 px-5 ml-14">
                        <p className="text-zinc-400 leading-relaxed border-l-2 border-indigo-500/30 pl-4">
                          {faq.answer}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-zinc-400 mb-2">No results found</h3>
              <p className="text-zinc-500 mb-6">Try a different search term or browse all categories</p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/50 via-zinc-900 to-cyan-900/50 border border-zinc-800 p-10 text-center">
            <div className="absolute inset-0 bg-grid-white/5" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-3xl">
                💬
              </div>
              <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
              <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                Can't find the answer you're looking for? Our dedicated support team is here to help you with any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="glow-primary">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline" size="lg">
                    Browse Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}