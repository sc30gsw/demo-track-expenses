import { redirect } from 'next/navigation'
import { createClient } from '~/lib/supabase/server'

// 認証済みユーザーIDを取得するヘルパー
export async function getAuthenticatedUserId() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  return user.id
}