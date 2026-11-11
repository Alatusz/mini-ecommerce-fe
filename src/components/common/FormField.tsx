import React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "cn"
import { Label } from "@/components/ui/label"

export interface FormFieldProps {
  label?: React.ReactNode
  htmlFor?: string
  required?: boolean
  error?: string | null
  hint?: React.ReactNode
  className?: string
  children: React.ReactNode
}

/**
 * FormField
 * Enterprise declarative form field wrapper.
 * Encapsulates label typography, required asterisk indicator, optional hint/toggle,
 * and unified accessible error messaging with icon.
 */
export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </Label>
          {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
        </div>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-destructive">
          <AlertCircle className="size-3 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

export default FormField

