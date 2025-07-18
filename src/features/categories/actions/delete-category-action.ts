'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'

// カテゴリ削除
export async function deleteCategory(id: string) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    // このカテゴリを使用している支出があるかチェック
    const { data: expensesWithCategory, error: checkError } = await supabase
      .from('expenses')
      .select('id')
      .eq('user_id', userId)
      .eq('category_id', id)
      .limit(1)

    if (checkError) {
      throw new Error('カテゴリ削除前のチェックに失敗しました')
    }

    if (expensesWithCategory && expensesWithCategory.length > 0) {
      throw new Error('このカテゴリを使用している支出があるため削除できません')
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .eq('is_default', false) // デフォルトカテゴリは削除不可

    if (error) {
      console.error('カテゴリ削除エラー:', error)
      throw new Error('カテゴリの削除に失敗しました')
    }

    revalidatePath('/expenses')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('カテゴリ削除処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}