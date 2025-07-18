'use server'

import { createClient } from '~/lib/supabase/server'
import { resetPasswordSchema } from '../types/schema/auth-schema'

export async function resetPasswordAction(formData: FormData) {
  try {
    const supabase = await createClient()

    // フォームデータを解析
    const rawData = {
      email: formData.get('email') as string,
    }

    // バリデーション
    const validatedData = resetPasswordSchema.parse(rawData)

    // Supabaseでパスワードリセットメール送信
    const { error } = await supabase.auth.resetPasswordForEmail(
      validatedData.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      }
    )

    if (error) {
      console.error('パスワードリセットエラー:', error)
      
      // エラーメッセージをユーザーフレンドリーに変換
      let errorMessage = 'パスワードリセットメールの送信に失敗しました'
      
      if (error.message.includes('Invalid email')) {
        errorMessage = '有効なメールアドレスを入力してください'
      } else if (error.message.includes('For security purposes')) {
        // Supabaseは存在しないメールアドレスでも成功として扱う場合がある
        // セキュリティ上の理由で詳細なエラーを表示しない
        errorMessage = 'メールアドレスが見つかりません'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'リクエストが多すぎます。しばらく待ってから再度お試しください'
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }

    // パスワードリセットメール送信成功
    return {
      success: true,
      message: 'パスワードリセットメールを送信しました。メールをご確認ください。',
    }
  } catch (error) {
    console.error('パスワードリセット処理エラー:', error)
    
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