import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'sayso-auth',
    // Uses the Supabase default (plain localStorage), which is synchronous.
    // The previous custom cryptoStorage adapter used async PBKDF2 encryption
    // with a key bundled in the client JS — providing no real security while
    // introducing async-storage race conditions that contributed to spurious
    // session revocations.
  }
});
