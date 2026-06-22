import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnon) {
  console.warn('[IBT] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Running in offline/mock mode.')
}

// Use placeholder values when env vars are missing so the app still renders.
// All Supabase calls will fail gracefully and fall back to mock data.
export const supabase = createClient(
  supabaseUrl  ?? 'https://placeholder.supabase.co',
  supabaseAnon ?? 'placeholder-anon-key'
)
