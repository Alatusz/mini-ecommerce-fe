import React from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"

export interface PageHeaderProps {
  title: string
  description?: string
  badge?: React.ReactNode
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
  className?: string
}

/**
 * PageHeader
 * Universal enterprise page header with title, description, optional badge,
 * back button, and right-aligned actions.
 */
export function PageHeader({
  title,
  description,
  badge,
  backHref,
  backLabel = "Back",
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 pb-1 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {backHref && (
          <Link to={backHref} className="mt-0.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
              title={backLabel}
            >
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
        )}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {children && (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      )}
    </div>
  )
}

export default PageHeader

