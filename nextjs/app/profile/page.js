'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../components/AuthProvider'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated, updateProfile, profile } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    bio: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    } else if (user) {
      setFormData({
        name: user.user_metadata?.name || user.email?.split('@')[0] || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        company: user.user_metadata?.company || '',
        bio: user.user_metadata?.bio || ''
      })
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const result = await updateProfile({
        data: {
          name: formData.name,
          phone: formData.phone,
          company: formData.company,
          bio: formData.bio
        }
      })
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <Card className="hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center text-4xl font-bold mb-4">
                  {getInitials(formData.name)}
                </div>
                <h3 className="text-xl font-semibold">{formData.name || 'User'}</h3>
                <p className="text-zinc-500 text-sm">{formData.email}</p>
                <div className="mt-4">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full capitalize">
                    {profile?.role || user?.user_metadata?.role || 'client'}
                  </span>
                </div>
                <div className="mt-4 text-xs text-zinc-500">
                  Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'recently'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="hover-lift">
              <CardContent className="p-8">
                <CardTitle className="mb-6">Edit Profile</CardTitle>
                
                {message.text && (
                  <div className={`p-3 rounded-lg mb-6 ${
                    message.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                      : 'bg-red-500/10 border border-red-500/50 text-red-400'
                  }`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your name"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="opacity-50"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 234 567 8900"
                    />
                    <Input
                      label="Company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      placeholder="Your company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => router.push('/dashboard')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="mt-6 border-red-500/30">
              <CardContent className="p-8">
                <CardTitle className="text-red-400 mb-4">Danger Zone</CardTitle>
                <p className="text-zinc-400 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="outline" className="text-red-400 border-red-400 hover:bg-red-400/10">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}