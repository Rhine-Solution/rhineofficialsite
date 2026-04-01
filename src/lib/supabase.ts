import { createClient } from "@supabase/supabase-js";

// Read VITE_ env vars (only VITE_ are exposed to client bundles)
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Fail-fast for missing config to avoid silent runtime errors in production.
if (!supabaseUrl || !supabaseAnonKey) {
  // Throwing here forces the developer to configure env vars properly.
  throw new Error('Missing Supabase configuration: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});
