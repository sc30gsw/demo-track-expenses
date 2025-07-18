'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '~/lib/supabase/server'

export async function logoutAction() {
  try {
    const supabase = await createClient()

    // Supabaseでログアウト
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('ログアウトエラー:', error)
      return {
        success: false,
        error: 'ログアウトに失敗しました',
      }
    }

    // ログアウト成功時の処理
    revalidatePath('/', 'layout')
    
    return {
      success: true,
      message: 'ログアウトしました',
    }
  } catch (error) {
    console.error('ログアウト処理エラー:', error)
    
    return {
      success: false,
      error: '予期しないエラーが発生しました',
    }
  } finally {
    // ログアウト後は必ずログインページにリダイレクト
    redirect('/login')
  }
}