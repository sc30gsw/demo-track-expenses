'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'

// 支出削除
export async function deleteExpense(id: string) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    const { error } = await supabase.from('expenses').delete().eq('id', id).eq('user_id', userId)

    if (error) {
      console.error('支出削除エラー:', error)
      throw new Error('支出の削除に失敗しました')
    }

    revalidatePath('/expenses')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('支出削除処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}