import { createClient } from '~/lib/supabase/server'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'
import { transformExpenseRow } from '../utils/transform'
import { expenseFiltersSchema } from '../types/schema/expense-schema'

// 支出一覧取得
export async function getExpenses(filters?: any) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    // フィルターのバリデーション
    const validatedFilters = filters ? expenseFiltersSchema.parse(filters) : {}

    let query = supabase
      .from('expenses')
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `)
      .eq('user_id', userId)
      .order('expense_date', { ascending: false })

    // フィルター適用
    if (validatedFilters.startDate) {
      query = query.gte('expense_date', validatedFilters.startDate.toISOString().split('T')[0])
    }
    if (validatedFilters.endDate) {
      query = query.lte('expense_date', validatedFilters.endDate.toISOString().split('T')[0])
    }
    if (validatedFilters.categoryId) {
      query = query.eq('category_id', validatedFilters.categoryId)
    }
    if (validatedFilters.minAmount) {
      query = query.gte('amount', validatedFilters.minAmount)
    }
    if (validatedFilters.maxAmount) {
      query = query.lte('amount', validatedFilters.maxAmount)
    }

    const { data, error } = await query

    if (error) {
      console.error('支出取得エラー:', error)
      throw new Error('支出の取得に失敗しました')
    }

    // データ変換
    const expenses = data.map((row: any) => ({
      ...transformExpenseRow(row),
      category: row.categories
        ? {
            id: row.categories.id,
            name: row.categories.name,
            color: row.categories.color,
          }
        : undefined,
    }))

    return { success: true, data: expenses }
  } catch (error) {
    console.error('支出取得処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}

// 支出詳細取得
export async function getExpenseById(id: string) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('指定された支出が見つかりません')
      }
      console.error('支出詳細取得エラー:', error)
      throw new Error('支出の取得に失敗しました')
    }

    const expense = {
      ...transformExpenseRow(data),
      category: data.categories
        ? {
            id: data.categories.id,
            name: data.categories.name,
            color: data.categories.color,
          }
        : undefined,
    }

    return { success: true, data: expense }
  } catch (error) {
    console.error('支出詳細取得処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}