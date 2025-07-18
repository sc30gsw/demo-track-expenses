'use client'

import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
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
import { Checkbox } from '~/components/ui/shadcn/checkbox'
import { Input } from '~/components/ui/shadcn/input'
import { Label } from '~/components/ui/shadcn/label'
import { signupAction } from '../actions/signup-action'

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await signupAction(formData)

      if (result.success) {
        setSuccess(result.message || 'アカウントを作成しました')
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
        <CardTitle className="text-center font-bold text-2xl">新規登録</CardTitle>
        <CardDescription className="text-center">
          アカウントを作成して家計簿管理を始めましょう
        </CardDescription>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
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
            <p className="text-muted-foreground text-xs">大文字・小文字・数字を含む6文字以上</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード確認</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="パスワードを再入力"
                required
                disabled={isLoading}
                className="w-full pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">
                  {showConfirmPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                </span>
              </Button>
            </div>
          </div>

          <div className="my-4 flex items-center space-x-2">
            <Checkbox id="agreeToTerms" name="agreeToTerms" required disabled={isLoading} />
            <Label
              htmlFor="agreeToTerms"
              className="font-normal text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                利用規約
              </Link>
              および
              <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                プライバシーポリシー
              </Link>
              に同意する
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                アカウント作成中...
              </>
            ) : (
              'アカウント作成'
            )}
          </Button>

          <div className="text-center text-muted-foreground text-sm">
            既にアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              ログイン
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
