'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import type { ExpenseRow } from '~/types/expense'
import { getAuthenticatedUserId } from '~/features/auth/utils/auth-utils'
import { transformExpenseRow } from '../utils/transform'
import { expenseUpdateSchema } from '../types/schema/expense-schema'

// 支出更新
export async function updateExpense(id: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const userId = await getAuthenticatedUserId()

    // フォームデータを解析
    const rawData: Record<string, any> = {}

    if (formData.get('amount')) {
      rawData.amount = Number(formData.get('amount'))
    }
    if (formData.get('description')) {
      rawData.description = formData.get('description') as string
    }
    if (formData.get('categoryId')) {
      rawData.categoryId = formData.get('categoryId') as string
    }
    if (formData.get('expenseDate')) {
      rawData.expenseDate = new Date(formData.get('expenseDate') as string)
    }

    // バリデーション
    const validatedData = expenseUpdateSchema.parse(rawData)

    // データベース更新用のオブジェクト作成
    const updateData: Record<string, any> = {}
    if (validatedData.amount !== undefined) updateData.amount = validatedData.amount
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.categoryId !== undefined) updateData.category_id = validatedData.categoryId
    if (validatedData.expenseDate !== undefined) {
      updateData.expense_date = validatedData.expenseDate.toISOString().split('T')[0]
    }
    updateData.updated_at = new Date().toISOString()

    // データベースを更新
    const { data, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single()

    if (error) {
      console.error('支出更新エラー:', error)
      throw new Error('支出の更新に失敗しました')
    }

    revalidatePath('/expenses')
    revalidatePath('/')

    return { success: true, data: transformExpenseRow(data as ExpenseRow) }
  } catch (error) {
    console.error('支出更新処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
    }
  }
}