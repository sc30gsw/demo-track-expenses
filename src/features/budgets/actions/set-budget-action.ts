'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import type { BudgetRow } from '~/types/budget'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'
import { transformBudgetRow } from '../utils/transform'
import { budgetInputSchema } from '../types/schema/budget-schema'

// 予算設定
export async function setBudget(formData: FormData) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    // フォームデータを解析
    const rawData = {
      amount: Number(formData.get('amount')),
      month: Number(formData.get('month')),
      year: Number(formData.get('year')),
    }

    // バリデーション
    const validatedData = budgetInputSchema.parse(rawData)

    // 既存の予算があるかチェック
    const { data: existingBudget } = await supabase
      .from('budgets')
      .select('id')
      .eq('user_id', userId)
      .eq('month', validatedData.month)
      .eq('year', validatedData.year)
      .single()

    if (existingBudget) {
      // 更新
      const { data, error } = await supabase
        .from('budgets')
        .update({
          amount: validatedData.amount,
        })
        .eq('id', existingBudget.id)
        .select('*')
        .single()

      if (error) {
        console.error('予算更新エラー:', error)
        throw new Error('予算の更新に失敗しました')
      }

      revalidatePath('/budget')
      revalidatePath('/')

      return { success: true, data: transformBudgetRow(data as BudgetRow) }
    } else {
      // 新規作成
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: userId,
          amount: validatedData.amount,
          month: validatedData.month,
          year: validatedData.year,
        })
        .select('*')
        .single()

      if (error) {
        console.error('予算作成エラー:', error)
        throw new Error('予算の作成に失敗しました')
      }

      revalidatePath('/budget')
      revalidatePath('/')

      return { success: true, data: transformBudgetRow(data as BudgetRow) }
    }
  } catch (error) {
    console.error('予算設定処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}