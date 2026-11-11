import { cn } from "cn"

export type ProductLifecycleStatus = "published" | "draft" | "archived"

interface StatusOption {
  value: ProductLifecycleStatus
  label: string
  dot: string
  tag: string
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "published",
    label: "Published",
    dot: "bg-emerald-500",
    tag: "Visible",
  },
  {
    value: "draft",
    label: "Draft",
    dot: "bg-zinc-400",
    tag: "Hidden",
  },
  {
    value: "archived",
    label: "Archived",
    dot: "bg-amber-500",
    tag: "Archived",
  },
]

export interface ProductStatusSelectorProps {
  value: ProductLifecycleStatus
  onChange: (value: ProductLifecycleStatus) => void
  disabled?: boolean
  className?: string
}

/**
 * ProductStatusSelector
 * Segmented selection control for product lifecycle statuses.
 */
export function ProductStatusSelector({
  value,
  onChange,
  disabled = false,
  className,
}: ProductStatusSelectorProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-3 pt-0.5", className)}>
      {STATUS_OPTIONS.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all",
              selected
                ? "border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/20"
                : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("size-2 rounded-full", opt.dot)} />
              <span className="text-xs font-medium text-foreground">
                {opt.label}
              </span>
            </div>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {opt.tag}
            </span>
          </button>
        )
      })}
    </div>
  )
}

