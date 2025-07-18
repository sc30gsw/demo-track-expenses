import { z } from 'zod'

// ログイン用スキーマ
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .max(100, 'メールアドレスは100文字以内である必要があります'),
  password: z
    .string()
    .min(1, 'パスワードは必須です')
    .min(6, 'パスワードは6文字以上である必要があります')
    .max(100, 'パスワードは100文字以内である必要があります'),
})

// サインアップ用スキーマ
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, 'メールアドレスは必須です')
      .email('有効なメールアドレスを入力してください')
      .max(100, 'メールアドレスは100文字以内である必要があります'),
    password: z
      .string()
      .min(1, 'パスワードは必須です')
      .min(6, 'パスワードは6文字以上である必要があります')
      .max(100, 'パスワードは100文字以内である必要があります')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'パスワードは大文字・小文字・数字を含む必要があります'
      ),
    confirmPassword: z
      .string()
      .min(1, 'パスワード確認は必須です'),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, '利用規約に同意してください'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

// パスワードリセット用スキーマ
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください'),
})

// パスワード更新用スキーマ
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'パスワードは6文字以上である必要があります')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'パスワードは大文字・小文字・数字を含む必要があります'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

// 型推論用のエクスポート
export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>

// フォーム用のスキーマ（ブラウザでの文字列入力対応）
export const loginFormSchema = loginSchema
export const signupFormSchema = signupSchema

// 型推論用のフォーム型
export type LoginFormSchema = z.infer<typeof loginFormSchema>
export type SignupFormSchema = z.infer<typeof signupFormSchema>