// Supabase client for Next.js
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM';

export const supabaseUrl = SUPABASE_URL;
export const supabaseAnonKey = SUPABASE_ANON_KEY;

export async function fetchFromSupabase(table, options = {}) {
  const { select = '*', eq = {}, order = '', limit = '' } = options;
  
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
  
  // Add filters
  Object.entries(eq).forEach(([key, value]) => {
    url += `&${key}=eq.${value}`;
  });
  
  if (order) url += `&order=${order}`;
  if (limit) url += `&limit=${limit}`;
  
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${table}`);
  }
  
  return response.json();
}

export async function insertToSupabase(table, data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Failed to insert to ${table}`);
  }
  
  return true;
}

export default { supabaseUrl, supabaseAnonKey, fetchFromSupabase, insertToSupabase };