'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import { signupSchema } from '../types/schema/auth-schema'

export async function signupAction(formData: FormData) {
  try {
    const supabase = await createClient()

    // フォームデータを解析
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      agreeToTerms: formData.get('agreeToTerms') === 'on',
    }

    // バリデーション
    const validatedData = signupSchema.parse(rawData)

    // Supabaseでサインアップ
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      console.error('サインアップエラー:', error)
      
      // エラーメッセージをユーザーフレンドリーに変換
      let errorMessage = 'アカウント作成に失敗しました'
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'このメールアドレスは既に登録されています'
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'パスワードは6文字以上である必要があります'
      } else if (error.message.includes('Invalid email')) {
        errorMessage = '有効なメールアドレスを入力してください'
      } else if (error.message.includes('Signup is disabled')) {
        errorMessage = '現在サインアップは無効になっています'
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }

    if (!data.user) {
      return {
        success: false,
        error: 'ユーザー情報の取得に失敗しました',
      }
    }

    // サインアップ成功時の処理
    revalidatePath('/', 'layout')
    
    return {
      success: true,
      message: 'アカウントを作成しました。メールアドレスに確認メールを送信しました。',
      user: {
        id: data.user.id,
        email: data.user.email,
        emailConfirmed: data.user.email_confirmed_at !== null,
      },
    }
  } catch (error) {
    console.error('サインアップ処理エラー:', error)
    
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