'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'
import { budgetPeriodSchema } from '../types/schema/budget-schema'

// 予算削除
export async function deleteBudget(month: number, year: number) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    const validatedPeriod = budgetPeriodSchema.parse({ month, year })

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('user_id', userId)
      .eq('month', validatedPeriod.month)
      .eq('year', validatedPeriod.year)

    if (error) {
      console.error('予算削除エラー:', error)
      throw new Error('予算の削除に失敗しました')
    }

    revalidatePath('/budget')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('予算削除処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}