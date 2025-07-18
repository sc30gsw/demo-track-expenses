import type { Category } from './expense'

// 統計データ型
export type ExpenseStatistics = {
  totalAmount: number
  categoryBreakdown: CategoryExpense[]
  monthlyTrend: MonthlyExpense[]
  averageDaily: number
  period: {
    startDate: Date
    endDate: Date
  }
}

// カテゴリ別支出統計
export type CategoryExpense = {
  categoryId: string
  categoryName: string
  amount: number
  percentage: number
  color: string
  transactionCount: number
}

// 月別支出統計
export type MonthlyExpense = {
  month: string // YYYY-MM format
  amount: number
  transactionCount: number
  averagePerDay: number
}

// 日別支出統計
export type DailyExpense = {
  date: string // YYYY-MM-DD format
  amount: number
  transactionCount: number
}

// 統計フィルター
export type StatisticsFilters = {
  startDate: Date
  endDate: Date
  categoryIds?: string[]
  groupBy: 'day' | 'week' | 'month' | 'year'
}

// 予算との比較統計
export type BudgetComparison = {
  currentMonth: {
    budget: number
    actual: number
    difference: number
    percentage: number
  }
  previousMonth: {
    actual: number
    comparison: number // 前月比較（%）
  }
}