import type { Metadata } from 'next'
import { LoginForm } from '~/features/auth/components/login-form'

export const metadata: Metadata = {
  title: 'ログイン | 家計簿アプリ',
  description: 'アカウントにログインして家計簿を管理しましょう',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-foreground tracking-tight">家計簿アプリ</h1>
          <p className="mt-2 text-muted-foreground text-sm">支出管理と予算設定で賢い家計管理を</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
