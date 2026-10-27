import React from "react"
import { cn } from "@/lib/utils"

export interface NotificationBadgeProps {
  /**
   * The notification count. If provided, badge automatically closes when count <= 0.
   */
  count?: number
  /**
   * Explicitly control open state (overrides count > 0 logic).
   */
  open?: boolean
  /**
   * Maximum count before displaying "+" (e.g., 99+). Defaults to 99.
   */
  maxCount?: number
  /**
   * Optional custom classes for the .t-badge wrapper.
   */
  className?: string
  /**
   * Optional custom classes for the inner .t-badge-dot.
   */
  dotClassName?: string
  /**
   * Optional trigger element wrapped by the badge.
   */
  children?: React.ReactNode
}

/**
 * Notification Badge Component powered by Transitions.dev motion tokens.
 *
 * Motion Specifications:
 * - Slide in duration: 260ms (--badge-slide-dur) with cubic-bezier(0.22, 1, 0.36, 1)
 * - Pop open duration: 500ms (--badge-pop-dur) with cubic-bezier(0.34, 1.36, 0.64, 1) spring bounce
 * - Close fade/scale duration: 180ms with 2px blur exit
 * - Accessible: respects prefers-reduced-motion
 */
export function NotificationBadge({
  count,
  open,
  maxCount = 99,
  className,
  dotClassName,
  children,
}: NotificationBadgeProps) {
  const isOpen =
    open !== undefined
      ? open
      : count !== undefined
      ? count > 0
      : true

  const displayCount =
    count !== undefined
      ? count > maxCount
        ? `${maxCount}+`
        : count > 0
        ? String(count)
        : ""
      : ""

  const badgeElement = (
    <span
      className={cn("t-badge", className)}
      data-open={isOpen ? "true" : "false"}
      aria-hidden={!isOpen}
    >
      <span className={cn("t-badge-dot", dotClassName)}>
        {displayCount}
      </span>
    </span>
  )

  if (!children) {
    return badgeElement
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      {children}
      {badgeElement}
    </div>
  )
}
