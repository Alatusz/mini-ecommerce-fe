import { useState, useEffect } from "react"
import { Filter, RotateCcw } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface AdvancedFilterState {
  searchBy: "all" | "name" | "sku"
  status: string[]
  stockStatus: string[]
}

interface ProductFilterPopoverProps {
  currentFilters: AdvancedFilterState
  onApply: (filters: AdvancedFilterState) => void
  onReset: () => void
}

export function ProductFilterPopover({
  currentFilters,
  onApply,
  onReset,
}: ProductFilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<AdvancedFilterState>(currentFilters)

  // Sync draft เมื่อเปิด Popover หรือค่าปัจจุบันเปลี่ยน
  useEffect(() => {
    if (open) {
      setDraft(currentFilters)
    }
  }, [open, currentFilters])

  // คำนวณจำนวน Filter ที่กำลัง Active
  const activeCount =
    (currentFilters.searchBy !== "all" ? 1 : 0) +
    currentFilters.status.length +
    currentFilters.stockStatus.length

  const handleApply = () => {
    onApply(draft)
    setOpen(false)
  }

  const handleReset = () => {
    onReset()
    setOpen(false)
  }

  const toggleStatus = (id: string, checked: boolean) => {
    setDraft((prev) => ({
      ...prev,
      status: checked
        ? [...prev.status, id]
        : prev.status.filter((s) => s !== id),
    }))
  }

  const toggleStockStatus = (id: string, checked: boolean) => {
    setDraft((prev) => ({
      ...prev,
      stockStatus: checked
        ? [...prev.stockStatus, id]
        : prev.stockStatus.filter((s) => s !== id),
    }))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 cursor-pointer gap-1.5 border-border/70 text-xs text-muted-foreground hover:text-foreground",
            activeCount > 0 &&
              "border-foreground/30 bg-muted/60 font-medium text-foreground"
          )}
        >
          <Filter className="size-3.5" />
          <span>Filters</span>
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-0.5 rounded-full px-1.5 py-0 text-[10px] font-semibold"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 space-y-4 p-4 text-xs">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">Filters</span>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="size-3" />
              Reset all
            </button>
          )}
        </div>

        <Separator />

        {/* ── 1. Search Column Target ── */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-foreground">
            Search In Column
          </Label>
          <RadioGroup
            value={draft.searchBy}
            onValueChange={(val: "all" | "name" | "sku") =>
              setDraft((prev) => ({ ...prev, searchBy: val }))
            }
            className="grid grid-cols-3 gap-2"
          >
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="all" id="target-all" />
              <Label htmlFor="target-all" className="cursor-pointer text-xs">
                All
              </Label>
            </div>
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="name" id="target-name" />
              <Label htmlFor="target-name" className="cursor-pointer text-xs">
                Name
              </Label>
            </div>
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="sku" id="target-sku" />
              <Label htmlFor="target-sku" className="cursor-pointer text-xs">
                SKU
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* ── 2. Product Lifecycle Status ── */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-foreground">
            Product Status
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "published", label: "Published", dot: "bg-emerald-500" },
              { id: "draft", label: "Draft", dot: "bg-zinc-400" },
              { id: "archived", label: "Archived", dot: "bg-amber-500" },
            ].map((st) => (
              <label
                key={st.id}
                className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Checkbox
                  checked={draft.status.includes(st.id)}
                  onCheckedChange={(checked) =>
                    toggleStatus(st.id, Boolean(checked))
                  }
                />
                <span className={cn("size-1.5 rounded-full", st.dot)} />
                <span>{st.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* ── 3. Stock Level Status ── */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-foreground">
            Stock Status
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "in_stock", label: "In Stock", dot: "bg-emerald-500" },
              { id: "low_stock", label: "Low Stock", dot: "bg-amber-500" },
              { id: "out_of_stock", label: "Out of Stock", dot: "bg-red-500" },
            ].map((st) => (
              <label
                key={st.id}
                className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Checkbox
                  checked={draft.stockStatus.includes(st.id)}
                  onCheckedChange={(checked) =>
                    toggleStockStatus(st.id, Boolean(checked))
                  }
                />
                <span className={cn("size-1.5 rounded-full", st.dot)} />
                <span>{st.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* ── Actions ── */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8 flex-1 cursor-pointer text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            className="h-8 flex-1 cursor-pointer text-xs"
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
