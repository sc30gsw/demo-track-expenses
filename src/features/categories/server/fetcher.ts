import { createClient } from '~/lib/supabase/server'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'
import { transformCategoryRow } from '../utils/transform'

// カテゴリ一覧取得
export async function getCategories() {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false }) // デフォルトカテゴリを先に表示
      .order('created_at', { ascending: true })

    if (error) {
      console.error('カテゴリ取得エラー:', error)
      throw new Error('カテゴリの取得に失敗しました')
    }

    const categories = data.map(transformCategoryRow)

    return { success: true, data: categories }
  } catch (error) {
    console.error('カテゴリ取得処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}

// カテゴリ詳細取得
export async function getCategoryById(id: string) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('指定されたカテゴリが見つかりません')
      }
      console.error('カテゴリ詳細取得エラー:', error)
      throw new Error('カテゴリの取得に失敗しました')
    }

    const category = transformCategoryRow(data)

    return { success: true, data: category }
  } catch (error) {
    console.error('カテゴリ詳細取得処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}

// デフォルトカテゴリ一覧取得
export async function getDefaultCategories() {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('デフォルトカテゴリ取得エラー:', error)
      throw new Error('デフォルトカテゴリの取得に失敗しました')
    }

    const categories = data.map(transformCategoryRow)

    return { success: true, data: categories }
  } catch (error) {
    console.error('デフォルトカテゴリ取得処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}