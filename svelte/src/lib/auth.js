import { writable } from 'svelte/store'
import { supabase } from './supabase.js'

export const user = writable(null)
export const profile = writable(null)
export const loading = writable(true)

export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    user.set(session.user)
    await fetchProfile(session.user.id)
  }
  
  loading.set(false)

  supabase.auth.onAuthStateChange((_event, session) => {
    user.set(session?.user || null)
    if (session?.user) {
      fetchProfile(session.user.id)
    } else {
      profile.set(null)
    }
  })
}

async function fetchProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  profile.set(data)
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) return { error: error.message }
  return { user: data.user }
}

export async function signUp(email, password, name, role = 'client') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }
    }
  })
  
  if (error) return { error: error.message }
  
  // Create profile
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      username: name,
      role: role
    })
  }
  
  return { user: data.user }
}

export async function signOut() {
  await supabase.auth.signOut()
  user.set(null)
  profile.set(null)
}