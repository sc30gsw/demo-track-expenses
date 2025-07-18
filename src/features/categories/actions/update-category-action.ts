'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import type { CategoryRow } from '~/types/expense'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'
import { transformCategoryRow } from '../utils/transform'
import { categoryUpdateSchema } from '../types/schema/category-schema'

// カテゴリ更新
export async function updateCategory(id: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    // フォームデータを解析
    const rawData: Record<string, any> = {}

    if (formData.get('name')) {
      rawData.name = formData.get('name') as string
    }
    if (formData.get('color')) {
      rawData.color = formData.get('color') as string
    }

    // バリデーション
    const validatedData = categoryUpdateSchema.parse(rawData)

    // 同じ名前のカテゴリが存在しないかチェック（自分以外）
    if (validatedData.name) {
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', userId)
        .eq('name', validatedData.name)
        .neq('id', id)
        .single()

      if (existingCategory) {
        throw new Error('同じ名前のカテゴリが既に存在します')
      }
    }

    // データベース更新用のオブジェクト作成
    const updateData: Record<string, any> = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.color !== undefined) updateData.color = validatedData.color

    // データベースを更新
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .eq('is_default', false) // デフォルトカテゴリは更新不可
      .select('*')
      .single()

    if (error) {
      console.error('カテゴリ更新エラー:', error)
      throw new Error('カテゴリの更新に失敗しました')
    }

    revalidatePath('/expenses')
    revalidatePath('/')

    return { success: true, data: transformCategoryRow(data as CategoryRow) }
  } catch (error) {
    console.error('カテゴリ更新処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}