'use client'

import { useState } from 'react'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
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
        
        // Send confirmation email
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

  const contactMethods = [
    { icon: '📧', label: 'Email', value: 'contact@rhinesolution.com' },
    { icon: '💻', label: 'GitHub', value: 'github.com/rhine-solution' },
    { icon: '📍', label: 'Location', value: 'Available Worldwide' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-zinc-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-zinc-400">We'd love to hear from you. Send us a message!</p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map(method => (
              <Card key={method.label} className="hover-lift">
                <CardContent className="text-center p-6">
                  <div className="text-3xl mb-3">{method.icon}</div>
                  <h3 className="font-semibold mb-1">{method.label}</h3>
                  <p className="text-zinc-400 text-sm">{method.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="hover-lift">
            <CardContent className="p-8">
              {success ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-zinc-400 mb-6">Thank you for contacting us. We'll get back to you soon.</p>
                  <Button onClick={() => setSuccess(false)}>Send Another Message</Button>
                </div>
              ) : (
                <>
                  <CardTitle className="mb-6">Send us a message</CardTitle>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>

                    <Input
                      label="Subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />

                    <Textarea
                      label="Message"
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}