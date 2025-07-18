import type { Expense, ExpenseRow } from '~/types/expense'

// データベース行をExpense型に変換するユーティリティ
export function transformExpenseRow(row: ExpenseRow): Expense {
  return {
    id: row.id,
    userId: row.user_id,
    amount: row.amount,
    description: row.description,
    categoryId: row.category_id,
    expenseDate: new Date(row.expense_date),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}