'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '~/lib/supabase/server'
import { updatePasswordSchema } from '../types/schema/auth-schema'

export async function updatePasswordAction(formData: FormData) {
  try {
    const supabase = await createClient()

    // フォームデータを解析
    const rawData = {
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    // バリデーション
    const validatedData = updatePasswordSchema.parse(rawData)

    // 現在のユーザーを確認
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('ユーザー情報取得エラー:', userError)
      return {
        success: false,
        error: 'ユーザー認証に失敗しました',
      }
    }

    // Supabaseでパスワード更新
    const { error } = await supabase.auth.updateUser({
      password: validatedData.password,
    })

    if (error) {
      console.error('パスワード更新エラー:', error)
      
      // エラーメッセージをユーザーフレンドリーに変換
      let errorMessage = 'パスワードの更新に失敗しました'
      
      if (error.message.includes('Password should be at least')) {
        errorMessage = 'パスワードは6文字以上である必要があります'
      } else if (error.message.includes('New password should be different')) {
        errorMessage = '新しいパスワードは現在のパスワードと異なる必要があります'
      } else if (error.message.includes('Password is too weak')) {
        errorMessage = 'パスワードが脆弱です。より強固なパスワードを設定してください'
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }

    // パスワード更新成功時の処理
    revalidatePath('/', 'layout')
    
    return {
      success: true,
      message: 'パスワードを更新しました',
    }
  } catch (error) {
    console.error('パスワード更新処理エラー:', error)
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }
    
    return {
      success: false,
      error: '予期しないエラーが発生しました',
    }
  }
}