import type { Budget, BudgetRow } from '~/types/budget'

// データベース行をBudget型に変換するユーティリティ
export function transformBudgetRow(row: BudgetRow): Budget {
  return {
    id: row.id,
    userId: row.user_id,
    amount: row.amount,
    month: row.month,
    year: row.year,
    createdAt: new Date(row.created_at),
  }
}