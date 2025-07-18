'use client'

import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '~/components/ui/shadcn/alert'
import { Button } from '~/components/ui/shadcn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/shadcn/card'
import { Input } from '~/components/ui/shadcn/input'
import { Label } from '~/components/ui/shadcn/label'
import { loginAction } from '../actions/login-action'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loginAction(formData)

      if (result.success) {
        toast.success('ログインしました')
        router.push('/')
      } else {
        setError(result.error ?? null)
      }
    } catch (_) {
      setError('予期しないエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center font-bold text-2xl">ログイン</CardTitle>
        <CardDescription className="text-center">
          アカウントにログインして家計簿を管理しましょう
        </CardDescription>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="パスワードを入力"
                required
                disabled={isLoading}
                className="w-full pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">
                  {showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/reset-password"
              className="text-muted-foreground text-sm underline-offset-4 hover:text-primary hover:underline"
            >
              パスワードを忘れた方
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ログイン中...
              </>
            ) : (
              'ログイン'
            )}
          </Button>

          <div className="text-center text-muted-foreground text-sm">
            アカウントをお持ちでない方は{' '}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              新規登録
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
