import { AlertCircle, X } from 'lucide-react'
import { Button } from '~/components/ui/shadcn/button'
import { cn } from '~/lib/utils'

interface ErrorAlertProps {
  title?: string
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  variant?: 'error' | 'warning'
  className?: string
}

export function ErrorAlert({
  title = 'エラーが発生しました',
  message,
  onRetry,
  onDismiss,
  variant = 'error',
  className
}: ErrorAlertProps) {
  const variantStyles = {
    error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800/30 dark:bg-red-900/10 dark:text-red-300',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800/30 dark:bg-yellow-900/10 dark:text-yellow-300'
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4',
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          <div className="mt-2 text-sm">{message}</div>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-inherit hover:text-inherit"
              >
                再試行
              </Button>
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-6 w-6 text-inherit hover:text-inherit"
              >
                <span className="sr-only">閉じる</span>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}