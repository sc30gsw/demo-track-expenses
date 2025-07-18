import { Badge } from '~/components/ui/shadcn/badge'
import { cn } from '~/lib/utils'

interface CategoryBadgeProps {
  name: string
  color: string
  size?: 'sm' | 'md'
  className?: string
}

export function CategoryBadge({ name, color, size = 'md', className }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5'
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        'inline-flex items-center gap-1.5',
        sizeClasses[size],
        className
      )}
    >
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {name}
    </Badge>
  )
}