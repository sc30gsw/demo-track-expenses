import type { Category, CategoryRow } from '~/types/expense'

// データベース行をCategory型に変換するユーティリティ
export function transformCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    color: row.color,
    isDefault: row.is_default,
    createdAt: new Date(row.created_at),
  }
}