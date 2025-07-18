import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/shadcn/card'
import { cn } from '~/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ElementType
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className
}: StatsCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{value}</div>
        {(description || trend) && (
          <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
            {description && <span>{description}</span>}
            {trend && (
              <span className={cn(
                'font-medium',
                trend.isPositive === true && 'text-green-600 dark:text-green-400',
                trend.isPositive === false && 'text-red-600 dark:text-red-400'
              )}>
                {trend.value > 0 && '+'}
                {trend.value}% {trend.label}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}