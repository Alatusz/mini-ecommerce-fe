import React from "react"
import { cn } from "cn"

export interface PageContentProps {
  children?: React.ReactNode
  className?: string
}

/**
 * PageContent
 * Common layout component to manage page content.
 * Standardizes padding, vertical spacing, and desktop layout width.
 * Single layout and single size with zero configuration props.
 */
export function PageContent({ children, className }: PageContentProps) {
  return (
    <div
      data-slot="page-content"
      className={cn("flex-1 space-y-6 p-6 min-w-[1200px]", className)}
    >
      {children}
    </div>
  )
}

export default PageContent
