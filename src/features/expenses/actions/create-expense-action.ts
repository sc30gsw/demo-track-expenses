'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import type { ExpenseRow } from '~/types/expense'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'
import { transformExpenseRow } from '../utils/transform'
import { expenseInputSchema } from '../types/schema/expense-schema'

// 支出作成
export async function createExpense(formData: FormData) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    // フォームデータを解析
    const rawData = {
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
      categoryId: formData.get('categoryId') as string,
      expenseDate: new Date(formData.get('expenseDate') as string),
    }

    // バリデーション
    const validatedData = expenseInputSchema.parse(rawData)

    // データベースに挿入
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        amount: validatedData.amount,
        description: validatedData.description,
        category_id: validatedData.categoryId,
        expense_date: validatedData.expenseDate.toISOString().split('T')[0],
      })
      .select('*')
      .single()

    if (error) {
      console.error('支出作成エラー:', error)
      throw new Error('支出の作成に失敗しました')
    }

    revalidatePath('/expenses')
    revalidatePath('/')

    return { success: true, data: transformExpenseRow(data as ExpenseRow) }
  } catch (error) {
    console.error('支出作成処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}