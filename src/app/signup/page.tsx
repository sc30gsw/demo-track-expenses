import { Metadata } from 'next'
import { SignupForm } from '~/features/auth/components/signup-form'

export const metadata: Metadata = {
  title: '新規登録 | 家計簿アプリ',
  description: 'アカウントを作成して家計簿管理を始めましょう',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            家計簿アプリ
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            支出管理と予算設定で賢い家計管理を
          </p>
        </div>
        
        <SignupForm />
      </div>
    </div>
  )
}