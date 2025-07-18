'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import { loginSchema } from '../types/schema/auth-schema'

export async function loginAction(formData: FormData) {
  try {
    const supabase = await createClient()

    // フォームデータを解析
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    // バリデーション
    const validatedData = loginSchema.parse(rawData)

    // Supabaseでログイン
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      console.error('ログインエラー:', error)

      // エラーメッセージをユーザーフレンドリーに変換
      let errorMessage = 'ログインに失敗しました'

      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'メールアドレスまたはパスワードが間違っています'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'メールアドレスの確認が完了していません'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'ログイン試行回数が上限に達しました。しばらく待ってから再度お試しください'
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

    // ログイン成功時の処理
    revalidatePath('/', 'layout')

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    }
  } catch (error) {
    console.error('ログイン処理エラー:', error)

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
