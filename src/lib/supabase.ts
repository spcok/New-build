import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('CRITICAL: Supabase URL or Anon Key missing. Check your .env.local file. Authentication will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);