'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import type { CategoryRow } from '~/types/expense'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'
import { transformCategoryRow } from '../utils/transform'
import { categoryInputSchema } from '../types/schema/category-schema'

// カテゴリ作成
export async function createCategory(formData: FormData) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    // フォームデータを解析
    const rawData = {
      name: formData.get('name') as string,
      color: (formData.get('color') as string) || '#6366f1',
    }

    // バリデーション
    const validatedData = categoryInputSchema.parse(rawData)

    // 同じ名前のカテゴリが存在しないかチェック
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', userId)
      .eq('name', validatedData.name)
      .single()

    if (existingCategory) {
      throw new Error('同じ名前のカテゴリが既に存在します')
    }

    // データベースに挿入
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: validatedData.name,
        color: validatedData.color,
        is_default: false,
      })
      .select('*')
      .single()

    if (error) {
      console.error('カテゴリ作成エラー:', error)
      throw new Error('カテゴリの作成に失敗しました')
    }

    revalidatePath('/expenses')
    revalidatePath('/')

    return { success: true, data: transformCategoryRow(data as CategoryRow) }
  } catch (error) {
    console.error('カテゴリ作成処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}