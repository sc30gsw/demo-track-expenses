'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'
import { DEFAULT_CATEGORIES } from '../types/schema/category-schema'

// デフォルトカテゴリ初期化
export async function initializeDefaultCategories() {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    // 既にデフォルトカテゴリが存在するかチェック
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', userId)
      .eq('is_default', true)

    if (existingCategories && existingCategories.length > 0) {
      return { success: true, message: 'デフォルトカテゴリは既に初期化済みです' }
    }

    // デフォルトカテゴリを挿入
    const categoriesData = DEFAULT_CATEGORIES.map((category) => ({
      user_id: userId,
      name: category.name,
      color: category.color,
      is_default: true,
    }))

    const { error } = await supabase.from('categories').insert(categoriesData)

    if (error) {
      console.error('デフォルトカテゴリ初期化エラー:', error)
      throw new Error('デフォルトカテゴリの初期化に失敗しました')
    }

    revalidatePath('/expenses')
    revalidatePath('/')

    return { success: true, message: 'デフォルトカテゴリを初期化しました' }
  } catch (error) {
    console.error('デフォルトカテゴリ初期化処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}