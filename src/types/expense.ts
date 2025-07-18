// 支出データ型定義
export type Expense = {
  id: string
  userId: string
  amount: number
  description: string
  categoryId: string
  expenseDate: Date
  createdAt: Date
  updatedAt: Date
  category?: Category
}

// 支出入力データ型
export type ExpenseInput = {
  amount: number
  description: string
  categoryId: string
  expenseDate: Date
}

// 支出更新データ型
export type ExpenseUpdate = Partial<ExpenseInput>

// 支出フィルター型
export type ExpenseFilters = {
  startDate?: Date
  endDate?: Date
  categoryId?: string
  minAmount?: number
  maxAmount?: number
}

// データベース用の支出型（snake_case）
export type ExpenseRow = {
  id: string
  user_id: string
  amount: number
  description: string
  category_id: string
  expense_date: string
  created_at: string
  updated_at: string
}

// カテゴリデータ型
export type Category = {
  id: string
  userId: string
  name: string
  color: string
  isDefault: boolean
  createdAt: Date
}

// カテゴリ入力データ型
export type CategoryInput = {
  name: string
  color: string
}

// データベース用のカテゴリ型（snake_case）
export type CategoryRow = {
  id: string
  user_id: string
  name: string
  color: string
  is_default: boolean
  created_at: string
}