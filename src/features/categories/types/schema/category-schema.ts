import { z } from 'zod'

// カテゴリ入力スキーマ
export const categoryInputSchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名は必須です')
    .max(100, 'カテゴリ名は100文字以内である必要があります')
    .trim(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, '有効な色コード（#RRGGBB）を入力してください')
    .default('#6366f1')
})

// カテゴリ更新スキーマ
export const categoryUpdateSchema = categoryInputSchema.partial()

// フォーム用のカテゴリスキーマ
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名は必須です')
    .max(100, 'カテゴリ名は100文字以内です')
    .trim(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, '有効な色コードを選択してください')
    .default('#6366f1')
})

// デフォルトカテゴリのスキーマ
export const defaultCategorySchema = z.object({
  name: z.string(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  isDefault: z.literal(true)
})

// カテゴリ一覧のレスポンススキーマ
export const categoriesResponseSchema = z.array(
  z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    name: z.string(),
    color: z.string(),
    isDefault: z.boolean(),
    createdAt: z.date()
  })
)

// 型推論用の型エクスポート
export type CategoryInputSchema = z.infer<typeof categoryInputSchema>
export type CategoryUpdateSchema = z.infer<typeof categoryUpdateSchema>
export type CategoryFormSchema = z.infer<typeof categoryFormSchema>
export type DefaultCategorySchema = z.infer<typeof defaultCategorySchema>
export type CategoriesResponseSchema = z.infer<typeof categoriesResponseSchema>

// デフォルトカテゴリ定義
export const DEFAULT_CATEGORIES: DefaultCategorySchema[] = [
  { name: '食費', color: '#ef4444', isDefault: true },
  { name: '交通費', color: '#3b82f6', isDefault: true },
  { name: '娯楽費', color: '#8b5cf6', isDefault: true },
  { name: '光熱費', color: '#f59e0b', isDefault: true },
  { name: '医療費', color: '#10b981', isDefault: true },
  { name: '衣類', color: '#ec4899', isDefault: true },
  { name: 'その他', color: '#6b7280', isDefault: true }
]