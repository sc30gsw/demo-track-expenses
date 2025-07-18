import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'
import { createClient } from '~/lib/supabase/server'
import type { BudgetUsage } from '~/types/budget'
import {
  BUDGET_EXCEEDED_THRESHOLD,
  BUDGET_WARNING_THRESHOLD,
  budgetPeriodSchema,
  getCurrentMonthYear,
} from '../types/schema/budget-schema'
import { transformBudgetRow } from '../utils/transform'

// 予算取得
export async function getBudget(month?: number, year?: number) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    // デフォルトは現在の月年
    const period = month && year ? { month, year } : getCurrentMonthYear()
    const validatedPeriod = budgetPeriodSchema.parse(period)

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', validatedPeriod.month)
      .eq('year', validatedPeriod.year)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // データが存在しない場合
        return { success: true, data: null }
      }
      console.error('予算取得エラー:', error)
      throw new Error('予算の取得に失敗しました')
    }

    return { success: true, data: transformBudgetRow(data) }
  } catch (error) {
    console.error('予算取得処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}

// 予算使用状況計算
export async function getBudgetUsage(
  month?: number,
  year?: number,
): Promise<{ success: boolean; data?: BudgetUsage; error?: string }> {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    // 予算取得
    const budgetResult = await getBudget(month, year)
    if (!budgetResult.success || !budgetResult.data) {
      return { success: false, error: '予算が設定されていません' }
    }

    const budget = budgetResult.data

    // 該当月の支出合計を計算
    const startDate = new Date(budget.year, budget.month - 1, 1)
    const endDate = new Date(budget.year, budget.month, 0) // 月末日

    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', userId)
      .gte('expense_date', startDate.toISOString().split('T')[0])
      .lte('expense_date', endDate.toISOString().split('T')[0])

    if (expenseError) {
      console.error('支出取得エラー:', expenseError)
      throw new Error('支出データの取得に失敗しました')
    }

    const totalExpense = expenseData?.reduce((sum, expense) => sum + expense.amount, 0) || 0
    const remainingBudget = budget.amount - totalExpense
    const usagePercentage = budget.amount > 0 ? (totalExpense / budget.amount) * 100 : 0

    const budgetUsage: BudgetUsage = {
      budget,
      totalExpense,
      remainingBudget,
      usagePercentage: Math.round(usagePercentage * 100) / 100, // 小数点以下2桁
      isWarning: usagePercentage >= BUDGET_WARNING_THRESHOLD * 100,
      isExceeded: usagePercentage >= BUDGET_EXCEEDED_THRESHOLD * 100,
    }

    return { success: true, data: budgetUsage }
  } catch (error) {
    console.error('予算使用状況計算エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}

// 複数月の予算一覧取得
export async function getBudgets(
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number,
) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .gte('year', startYear)
      .lte('year', endYear)
      .order('year', { ascending: false })
      .order('month', { ascending: false })

    if (error) {
      console.error('予算一覧取得エラー:', error)
      throw new Error('予算一覧の取得に失敗しました')
    }

    const budgets = data
      .filter((budget) => {
        // 期間フィルタリング
        const budgetDate = budget.year * 12 + budget.month
        const startDate = startYear * 12 + startMonth
        const endDate = endYear * 12 + endMonth
        return budgetDate >= startDate && budgetDate <= endDate
      })
      .map(transformBudgetRow)

    return { success: true, data: budgets }
  } catch (error) {
    console.error('予算一覧取得処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}
