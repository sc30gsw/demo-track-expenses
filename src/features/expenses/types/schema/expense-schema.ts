import { z } from 'zod'

// 支出入力スキーマ
export const expenseInputSchema = z.object({
  amount: z
    .number()
    .positive('金額は正の数値である必要があります')
    .max(9999999.99, '金額は999万円以下である必要があります'),
  description: z
    .string()
    .min(1, '説明は必須です')
    .max(200, '説明は200文字以内である必要があります')
    .trim(),
  categoryId: z
    .string()
    .uuid('有効なカテゴリを選択してください'),
  expenseDate: z
    .date()
    .max(new Date(), '未来の日付は選択できません')
})

// 支出更新スキーマ
export const expenseUpdateSchema = expenseInputSchema.partial()

// 支出フィルタースキーマ
export const expenseFiltersSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  categoryId: z.string().uuid().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional()
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate
    }
    return true
  },
  {
    message: '開始日は終了日以前である必要があります',
    path: ['startDate']
  }
).refine(
  (data) => {
    if (data.minAmount && data.maxAmount) {
      return data.minAmount <= data.maxAmount
    }
    return true
  },
  {
    message: '最小金額は最大金額以下である必要があります',
    path: ['minAmount']
  }
)

// フォーム用のスキーマ（文字列入力を数値に変換）
export const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, '金額は必須です')
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive('正の数値を入力してください')),
  description: z
    .string()
    .min(1, '説明は必須です')
    .max(200, '説明は200文字以内です')
    .trim(),
  categoryId: z
    .string()
    .min(1, 'カテゴリを選択してください'),
  expenseDate: z
    .string()
    .min(1, '日付を選択してください')
    .transform((val) => new Date(val))
    .pipe(z.date().max(new Date(), '未来の日付は選択できません'))
})

// 型推論用の型エクスポート
export type ExpenseInputSchema = z.infer<typeof expenseInputSchema>
export type ExpenseUpdateSchema = z.infer<typeof expenseUpdateSchema>
export type ExpenseFiltersSchema = z.infer<typeof expenseFiltersSchema>
export type ExpenseFormSchema = z.infer<typeof expenseFormSchema>