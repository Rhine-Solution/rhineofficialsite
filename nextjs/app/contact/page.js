'use client'

import { useState } from 'react'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'
import Turnstile from '../../components/Turnstile'
import { Mail, MapPin, Phone, Send, Clock, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@rhinesolution.com',
    description: 'Send us an email anytime',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri from 9am to 6pm',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Worldwide Service',
    description: 'Remote support available',
    color: 'from-purple-500 to-pink-500',
  },
]

const faqs = [
  { question: 'How quickly do you respond?', answer: 'We typically respond within 24 hours during business days.' },
  { question: 'Do you offer emergency support?', answer: 'Yes, Enterprise clients have access to 24/7 emergency support.' },
  { question: 'Can I schedule a call?', answer: 'Absolutely! Use our booking system or mention your preferred time in the message.' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [turnstileToken, setTurnstileToken] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!turnstileToken) {
      setError('Please complete the security verification.')
      setLoading(false)
      return
    }

    try {
      const verifyRes = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken, action: 'contact_form' })
      })

      if (!verifyRes.ok) {
        throw new Error('Verification failed')
      }

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/contacts`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject || 'No subject',
            message: formData.message
          })
        }
      )

      if (res.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: formData.email,
              subject: 'We received your message - Rhine Solution',
              html: `
                <h1>Thank you for contacting us!</h1>
                <p>Hi ${formData.name},</p>
                <p>We've received your message and will get back to you soon.</p>
                <p><strong>Your message:</strong></p>
                <p>${formData.message}</p>
              `
            })
          })
        } catch (emailErr) {
          console.log('Email notification failed (non-critical)')
        }
      } else {
        throw new Error('Failed to send message')
      }
    } catch (err) {
      console.error('Contact form error:', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-100 via-gray-50 to-gray-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 pt-20 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-50 to-gray-50 dark:via-zinc-950 dark:to-zinc-950" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 dark:text-indigo-300 text-sm font-medium mb-5">
              <MessageSquare className="w-4 h-4 mr-2" />
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-5">
              Let's <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent dark:text-white">Connect</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Have a question or want to work together? We'd love to hear from you.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon
              return (
                <div
                  key={info.label}
                  className="group relative bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{info.label}</h3>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">{info.value}</p>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">{info.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
              <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 rounded-2xl p-8">
                {success ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Message Sent!</h2>
                    <p className="text-gray-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSuccess(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send us a message</h2>
                      <p className="text-gray-500 dark:text-zinc-400">Fill out the form below and we'll get back to you soon.</p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-6">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Name</label>
                          <input
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Email</label>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Subject</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        >
                          <option value="">Select a topic</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Sales">Sales & Pricing</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Careers">Careers</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Message</label>
                        <textarea
                          placeholder="Tell us about your project or question..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          required
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                        />
                      </div>

                      <Turnstile 
                        onVerify={(token) => setTurnstileToken(token)} 
                        action="contact_form" 
                      />

                      <Button type="submit" className="w-full py-4 text-base" disabled={loading}>
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Send className="w-5 h-5" />
                            Send Message
                          </span>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* FAQ & Additional Info */}
            <div className="space-y-8">
              {/* Response Time Info */}
              <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Response Time</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">We aim to reply within 24 hours</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-100 dark:bg-zinc-800/50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">24h</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-500">Standard</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-zinc-800/50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-indigo-400">4h</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-500">Priority</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-zinc-800/50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-green-400">30m</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-500">Enterprise</div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-zinc-800/30 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-gray-400 dark:text-zinc-400 flex-shrink-0 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedFaq === idx && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-500 dark:text-zinc-400 text-sm">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {['GitHub', 'Twitter', 'LinkedIn'].map((social) => (
                    <button
                      key={social}
                      className="px-4 py-2 bg-gray-100 dark:bg-zinc-800/50 hover:bg-gray-200 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}