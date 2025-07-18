import { z } from 'zod'

// 予算入力スキーマ
export const budgetInputSchema = z.object({
  amount: z
    .number()
    .positive('予算金額は正の数値である必要があります')
    .max(99999999, '予算金額は9999万円以下である必要があります'),
  month: z
    .number()
    .int('月は整数である必要があります')
    .min(1, '月は1以上である必要があります')
    .max(12, '月は12以下である必要があります'),
  year: z
    .number()
    .int('年は整数である必要があります')
    .min(2020, '年は2020年以降である必要があります')
    .max(2030, '年は2030年以下である必要があります')
})

// 予算更新スキーマ
export const budgetUpdateSchema = budgetInputSchema.partial()

// フォーム用の予算スキーマ
export const budgetFormSchema = z.object({
  amount: z
    .string()
    .min(1, '予算金額は必須です')
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive('正の数値を入力してください')),
  month: z
    .string()
    .min(1, '月を選択してください')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(12)),
  year: z
    .string()
    .min(1, '年を選択してください')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(2020).max(2030))
})

// 予算使用状況計算用スキーマ
export const budgetUsageSchema = z.object({
  budget: budgetInputSchema.extend({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    createdAt: z.date()
  }),
  totalExpense: z.number().min(0),
  remainingBudget: z.number(),
  usagePercentage: z.number().min(0).max(200), // 200%まで許可（超過対応）
  isWarning: z.boolean(),
  isExceeded: z.boolean()
})

// 予算期間クエリスキーマ
export const budgetPeriodSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2030)
})

// 型推論用の型エクスポート
export type BudgetInputSchema = z.infer<typeof budgetInputSchema>
export type BudgetUpdateSchema = z.infer<typeof budgetUpdateSchema>
export type BudgetFormSchema = z.infer<typeof budgetFormSchema>
export type BudgetUsageSchema = z.infer<typeof budgetUsageSchema>
export type BudgetPeriodSchema = z.infer<typeof budgetPeriodSchema>

// 予算アラート閾値定数
export const BUDGET_WARNING_THRESHOLD = 0.8 // 80%
export const BUDGET_EXCEEDED_THRESHOLD = 1.0 // 100%

// 現在の月年を取得するヘルパー
export function getCurrentMonthYear(): BudgetPeriodSchema {
  const now = new Date()
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  }
}