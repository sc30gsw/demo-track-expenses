# 設計書

## 概要

家計簿アプリは、Next.js 15とSupabaseを基盤とした現代的なWebアプリケーションとして設計されます。ユーザーが支出を記録・追跡し、統計分析を通じて財務管理を改善できる機能を提供します。レスポンシブデザインにより、デスクトップとモバイルの両方で快適に使用できます。

## アーキテクチャ

### 技術スタック
- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Lucide React
- **状態管理**: TanStack Query (React Query)
- **バックエンド**: Supabase (PostgreSQL, Auth, Real-time)
- **バリデーション**: Zod, Conform
- **チャート**: Recharts
- **日付処理**: date-fns

### アーキテクチャパターン
- **クライアント・サーバーアーキテクチャ**: Next.js App RouterのServer/Client Components
- **レイヤードアーキテクチャ**: Presentation → Business Logic → Data Access
- **Repository パターン**: データアクセスの抽象化

## コンポーネントとインターフェース

### データベーススキーマ

#### expenses テーブル
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  expense_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### categories テーブル
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### budgets テーブル
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month, year)
);
```

### フロントエンドコンポーネント構造

#### ページコンポーネント
- `app/page.tsx` - ダッシュボード（統計概要）
- `app/expenses/page.tsx` - 支出一覧・追加
- `app/statistics/page.tsx` - 詳細統計・グラフ
- `app/budget/page.tsx` - 予算管理

#### 共通コンポーネント
- `components/expense/expense-form.tsx` - 支出入力フォーム
- `components/expense/expense-list.tsx` - 支出一覧表示
- `components/expense/expense-item.tsx` - 支出項目
- `components/category/category-selector.tsx` - カテゴリ選択
- `components/statistics/expense-chart.tsx` - 支出グラフ
- `components/statistics/category-pie-chart.tsx` - カテゴリ別円グラフ
- `components/budget/budget-progress.tsx` - 予算進捗表示
- `components/layout/navigation.tsx` - ナビゲーション

### API設計

#### Server Actions
- `actions/expense-actions.ts`
  - `createExpense(data: ExpenseInput)`
  - `updateExpense(id: string, data: ExpenseInput)`
  - `deleteExpense(id: string)`
  - `getExpenses(filters: ExpenseFilters)`

- `actions/category-actions.ts`
  - `createCategory(data: CategoryInput)`
  - `getCategories()`
  - `updateCategory(id: string, data: CategoryInput)`

- `actions/budget-actions.ts`
  - `setBudget(data: BudgetInput)`
  - `getBudget(month: number, year: number)`

## データモデル

### TypeScript型定義

```typescript
// 支出データ型
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

// カテゴリデータ型
export type Category = {
  id: string
  userId: string
  name: string
  color: string
  isDefault: boolean
  createdAt: Date
}

// 予算データ型
export type Budget = {
  id: string
  userId: string
  amount: number
  month: number
  year: number
  createdAt: Date
}

// 統計データ型
export type ExpenseStatistics = {
  totalAmount: number
  categoryBreakdown: CategoryExpense[]
  monthlyTrend: MonthlyExpense[]
  averageDaily: number
}

export type CategoryExpense = {
  categoryId: string
  categoryName: string
  amount: number
  percentage: number
  color: string
}
```

### バリデーションスキーマ

```typescript
// Zodスキーマ
export const expenseSchema = z.object({
  amount: z.number().positive('金額は正の数値である必要があります'),
  description: z.string().min(1, '説明は必須です').max(200, '説明は200文字以内です'),
  categoryId: z.string().uuid('有効なカテゴリを選択してください'),
  expenseDate: z.date()
})

export const categorySchema = z.object({
  name: z.string().min(1, 'カテゴリ名は必須です').max(100, 'カテゴリ名は100文字以内です'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, '有効な色コードを入力してください')
})
```

## エラーハンドリング

### エラー処理戦略
1. **クライアントサイドエラー**: React Error Boundaryとtoast通知
2. **サーバーサイドエラー**: Server Actionsでのtry-catch処理
3. **データベースエラー**: Supabaseエラーの適切なハンドリング
4. **バリデーションエラー**: Zodスキーマによる入力検証

### エラー表示
- フォームエラー: インライン表示
- システムエラー: Sonner toastによる通知
- ネットワークエラー: 再試行オプション付きメッセージ

## テスト戦略

### テスト種類
1. **単体テスト**: コンポーネントとユーティリティ関数
2. **統合テスト**: Server Actionsとデータベース操作
3. **E2Eテスト**: 主要なユーザーフロー

### テストツール
- **Jest**: 単体テスト
- **React Testing Library**: コンポーネントテスト
- **Playwright**: E2Eテスト

### テスト対象
- 支出の作成・編集・削除
- カテゴリ管理
- 統計計算の正確性
- 予算アラート機能
- レスポンシブデザイン

## パフォーマンス最適化

### フロントエンド最適化
- React Compiler使用による自動最適化
- Server Componentsによる初期レンダリング高速化
- TanStack Queryによるデータキャッシュ
- 画像最適化（Next.js Image）

### データベース最適化
- 適切なインデックス設定
- RLS（Row Level Security）によるセキュリティ
- リアルタイム更新の効率的な実装

## セキュリティ

### 認証・認可
- Supabase Authによるユーザー認証
- Row Level Security（RLS）によるデータアクセス制御
- JWTトークンによるセッション管理

### データ保護
- 入力データのサニタイゼーション
- SQLインジェクション対策（Supabaseの自動対策）
- XSS対策（React標準の対策）

## デプロイメント

### 環境設定
- 開発環境: ローカル開発サーバー
- 本番環境: Vercel推奨
- データベース: Supabase hosted PostgreSQL

### 環境変数
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```