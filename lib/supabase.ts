import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
}

export interface LogEntry {
  id: string
  type: 'feeding' | 'alert' | 'refill' | 'system'
  message: string
  timestamp: string
  user_id?: string
}
