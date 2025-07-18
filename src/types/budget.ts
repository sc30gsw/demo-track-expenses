// 予算データ型
export type Budget = {
  id: string
  userId: string
  amount: number
  month: number
  year: number
  createdAt: Date
}

// 予算入力データ型
export type BudgetInput = {
  amount: number
  month: number
  year: number
}

// 予算使用状況型
export type BudgetUsage = {
  budget: Budget
  totalExpense: number
  remainingBudget: number
  usagePercentage: number
  isWarning: boolean // 80%超過
  isExceeded: boolean // 100%超過
}

// データベース用の予算型（snake_case）
export type BudgetRow = {
  id: string
  user_id: string
  amount: number
  month: number
  year: number
  created_at: string
}