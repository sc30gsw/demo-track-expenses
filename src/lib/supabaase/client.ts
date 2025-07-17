import { createBrowserClient } from '@supabase/ssr'
import { env } from '~/env'

// ?https://supabase.com/docs/guides/auth/server-side/nextjs
export function createClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
