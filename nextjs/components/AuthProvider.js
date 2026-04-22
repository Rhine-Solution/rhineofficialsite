'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import { useToast } from './ui/Toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [supabase] = useState(() => createClient())
  const { success, error } = useToast()

  useEffect(() => {
    let mounted = true

    async function getSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted && session) {
          setUser(session.user)
        }
      } catch (err) {
        console.log('No active session')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user || null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false)
        return
      }
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
          
        if (error) throw error
        setIsAdmin(data?.role === 'admin')
      } catch (err) {
        console.error('Admin check failed:', err)
        setIsAdmin(false)
      }
    }
    
    checkAdminStatus()
  }, [user, supabase])

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  const signUp = async (email, password, name, referralCode = null) => {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            referral_code: generateReferralCode()
          }
        }
      })

      if (signUpError) throw signUpError

      if (referralCode && data.user) {
        try {
          await fetch('/api/referral/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              referralCode, 
              email,
              referredUserId: data.user.id 
            })
          })
        } catch (refErr) {
          console.log('Referral tracking failed (non-critical)')
        }
      }

      success('Account created! Please check your email to verify.')
      return { success: true, user: data.user }
    } catch (err) {
      error(err.message || 'Registration failed')
      return { success: false, error: err.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      success('Welcome back!')
      return { success: true, user: data.user }
    } catch (err) {
      error(err.message || 'Invalid credentials')
      return { success: false, error: err.message }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      success('Logged out successfully')
    } catch (err) {
      error('Error logging out')
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://rhinesolution.com/dashboard'
        }
      })
      
      if (googleError) throw googleError
      
      return { success: true }
    } catch (err) {
      error(err.message || 'Google sign-in failed')
      return { success: false, error: err.message }
    }
  }

  const signInWithGitHub = async () => {
    try {
      const { data, error: githubError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'https://rhinesolution.com/dashboard'
        }
      })
      
      if (githubError) throw githubError
      
      return { success: true }
    } catch (err) {
      error(err.message || 'GitHub sign-in failed')
      return { success: false, error: err.message }
    }
  }

  const updateProfile = async (updates) => {
    try {
      const { data, error: updateError } = await supabase.auth.updateUser(updates)
      if (updateError) throw updateError
      setUser(data.user)
      success('Profile updated!')
      return { success: true }
    } catch (err) {
      error(err.message || 'Update failed')
      return { success: false, error: err.message }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      signInWithGitHub,
      updateProfile,
      isAuthenticated: !!user,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      user: null,
      loading: false,
      signUp: async () => ({ success: false }),
      signIn: async () => ({ success: false }),
      signOut: () => {},
      updateProfile: async () => ({ success: false }),
      isAuthenticated: false,
      isAdmin: false
    }
  }
  return context
}