'use client'

import { useState } from 'react'
import Card, { CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const faqCategories = [
  { id: 'general', label: 'General', icon: '❓' },
  { id: 'billing', label: 'Billing', icon: '💳' },
  { id: 'technical', label: 'Technical', icon: '🔧' },
  { id: 'orders', label: 'Orders', icon: '📦' },
]

const faqs = [
  {
    category: 'general',
    question: 'What is Rhine Solution?',
    answer: 'Rhine Solution is an enterprise-grade multi-service platform offering e-commerce, travel booking, portfolio management, and more. We provide modern web solutions built with cutting-edge technologies.'
  },
  {
    category: 'general',
    question: 'How do I create an account?',
    answer: 'Click on the "Register" button in the navigation bar. You can sign up using your email or use Google/GitHub OAuth for faster registration.'
  },
  {
    category: 'general',
    question: 'Is my data secure?',
    answer: 'Yes! We use industry-standard security practices including SSL encryption, secure database storage with Supabase, and human verification to protect your data.'
  },
  {
    category: 'billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards through our secure Stripe payment system. You can also use digital wallets like Apple Pay and Google Pay.'
  },
  {
    category: 'billing',
    question: 'Can I get a refund?',
    answer: 'Yes, we offer a 30-day money-back guarantee on most services. Contact our support team to request a refund.'
  },
  {
    category: 'billing',
    question: 'How do I update my billing information?',
    answer: 'Go to your Profile page and navigate to the Billing section to update your payment methods and billing address.'
  },
  {
    category: 'technical',
    question: 'What technologies do you use?',
    answer: 'Our platform is built with Next.js, React, Tailwind CSS, Supabase (PostgreSQL), and deployed on Vercel. We use Cloudflare for DNS and security.'
  },
  {
    category: 'technical',
    question: 'Do you offer custom development?',
    answer: 'Yes! We offer custom web development services. Check our shop for development packages or contact us for custom solutions.'
  },
  {
    category: 'technical',
    question: 'What is the uptime guarantee?',
    answer: 'We guarantee 99.9% uptime for all our hosting services. Our infrastructure is designed for high availability and performance.'
  },
  {
    category: 'orders',
    question: 'How do I track my order?',
    answer: 'Go to your Dashboard and click on "Orders" to see the status of all your purchases. You\'ll receive email updates when your order status changes.'
  },
  {
    category: 'orders',
    question: 'How long does delivery take?',
    answer: 'Digital products are delivered instantly. For services like custom development, delivery times vary based on the project scope. Check the product description for estimated delivery times.'
  },
  {
    category: 'orders',
    question: 'Can I cancel my order?',
    answer: 'You can cancel orders within 24 hours of purchase if the service hasn\'t been delivered. Contact our support team to request a cancellation.'
  },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openQuestion, setOpenQuestion] = useState(null)

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Find answers to common questions about our services
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            All Questions
          </button>
          {faqCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover-lift"
            >
              <button
                onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                className="w-full text-left p-5 flex items-center justify-between gap-4"
              >
                <span className="font-medium text-white text-lg">
                  {faq.question}
                </span>
                <span className={`text-2xl transition-transform duration-300 ${openQuestion === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openQuestion === index && (
                <CardContent className="pt-0 pb-5 px-5">
                  <p className="text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 p-10 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-800 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <Button onClick={() => window.location.href = '/contact'}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}