import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  className?: string
  gradient?: 'blue' | 'green' | 'amber' | 'red' | 'purple'
}

const gradientStyles = {
  blue: 'gradient-blue',
  green: 'gradient-green',
  amber: 'gradient-amber',
  red: 'gradient-red',
  purple: 'gradient-purple',
}

export function StatsCard({ title, value, icon: Icon, description, className, gradient }: StatsCardProps) {
  if (gradient) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl p-5 text-white shadow-lg", gradientStyles[gradient], className)}>
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -right-2 bottom-0 h-16 w-16 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white/80">{title}</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {description && <p className="mt-1 text-xs text-white/70">{description}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border bg-white p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
