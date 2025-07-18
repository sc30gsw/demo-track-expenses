import { cn } from '~/lib/utils'

interface AmountDisplayProps {
  amount: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'positive' | 'negative'
  className?: string
}

export function AmountDisplay({
  amount,
  currency = '¥',
  size = 'md',
  variant = 'default',
  className
}: AmountDisplayProps) {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ja-JP').format(value)
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold'
  }

  const variantClasses = {
    default: '',
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400'
  }

  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {currency}{formatAmount(amount)}
    </span>
  )
}