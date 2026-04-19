'use client'

import { useState } from 'react'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Demo mode - just simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSuccess(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
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
              <Card key={method.label}>
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
          <Card>
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