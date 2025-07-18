import { FileX, PlusCircle } from 'lucide-react'
import { Button } from '~/components/ui/shadcn/button'
import { cn } from '~/lib/utils'

interface EmptyStateProps {
  icon?: React.ElementType
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon = FileX,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-muted-foreground text-sm">{description}</p>
      {action && (
        <Button className="mt-6" onClick={action.onClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  )
}