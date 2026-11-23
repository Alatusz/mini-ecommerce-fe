import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "cn"

export interface StatCardProps {
  title: string
  value: ReactNode
  icon?: ReactNode
  description?: ReactNode
  valueClassName?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon,
  description,
  valueClassName,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col justify-between border-border/60 bg-card p-4 shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
        {icon && (
          <div className="flex size-7 items-center justify-center rounded-md bg-muted/70 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>

      <div className="pt-2.5">
        <div
          className={cn(
            "text-2xl font-semibold tracking-tight text-foreground tabular-nums",
            valueClassName
          )}
        >
          {value}
        </div>
        {description && (
          <div className="mt-1 text-xs text-muted-foreground tabular-nums">
            {description}
          </div>
        )}
      </div>
    </Card>
  )
}
