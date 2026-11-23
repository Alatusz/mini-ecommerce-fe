import { useState, useEffect } from "react"
import { SlidersHorizontal, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  COUPON_SEARCH_TARGET_OPTIONS,
  COUPON_STATUS_OPTIONS,
  COUPON_TYPE_OPTIONS,
  type CouponSearchTarget,
} from "../useHubs"

export interface CouponFilterState {
  searchBy: CouponSearchTarget[]
  type: string[]
  status: string[]
}

export const DEFAULT_COUPON_FILTERS: CouponFilterState = {
  searchBy: [],
  type: [],
  status: [],
}

interface CouponFilterDrawerProps {
  currentFilters: CouponFilterState
  onApply: (filters: CouponFilterState) => void
  onReset: () => void
}

export function CouponFilterDrawer({
  currentFilters,
  onApply,
  onReset,
}: CouponFilterDrawerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<CouponFilterState>(currentFilters)

  useEffect(() => {
    if (open) setDraft(currentFilters)
  }, [open, currentFilters])

  const activeFilterCount =
    (currentFilters.searchBy.length > 0 ? 1 : 0) +
    (currentFilters.type.length > 0 ? 1 : 0) +
    (currentFilters.status.length > 0 ? 1 : 0)

  const handleApply = () => {
    onApply(draft)
    setOpen(false)
  }

  const handleReset = () => {
    setDraft(DEFAULT_COUPON_FILTERS)
    onReset()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-9 cursor-pointer gap-2 border-dashed border-border/80 bg-background/60 px-3 text-xs font-medium hover:bg-muted/60"
          />
        }
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge
            variant="secondary"
            className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-bold text-primary tabular-nums"
          >
            {activeFilterCount}
          </Badge>
        )}
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Coupon Filters
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Filter promo codes by search target, discount type, and status.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Search Target */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Search Target Column
            </Label>
            <Select
              multiple
              value={draft.searchBy}
              onValueChange={(values: CouponSearchTarget[]) =>
                setDraft((prev) => ({ ...prev, searchBy: values }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: CouponSearchTarget[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === COUPON_SEARCH_TARGET_OPTIONS.length
                      ? "All Columns"
                      : value
                          .map(
                            (v) =>
                              COUPON_SEARCH_TARGET_OPTIONS.find(
                                (o) => o.value === v
                              )?.label || v
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {COUPON_SEARCH_TARGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Type */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Discount Type
            </Label>
            <Select
              multiple
              value={draft.type}
              onValueChange={(values: string[]) =>
                setDraft((prev) => ({ ...prev, type: values }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === COUPON_TYPE_OPTIONS.length
                      ? "All Types"
                      : value
                          .map(
                            (id) =>
                              COUPON_TYPE_OPTIONS.find((t) => t.id === id)
                                ?.label || id
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {COUPON_TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Coupon Status
            </Label>
            <Select
              multiple
              value={draft.status}
              onValueChange={(values: string[]) =>
                setDraft((prev) => ({ ...prev, status: values }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === COUPON_STATUS_OPTIONS.length
                      ? "All Status"
                      : value
                          .map(
                            (id) =>
                              COUPON_STATUS_OPTIONS.find((s) => s.id === id)
                                ?.label || id
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {COUPON_STATUS_OPTIONS.map((st) => (
                    <SelectItem key={st.id} value={st.id}>
                      <span className="flex items-center gap-2">
                        <span className={`size-2 shrink-0 rounded-full ${st.dot}`} />
                        <span>{st.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="mt-auto border-t bg-muted/20 px-6 py-4">
          <div className="flex w-full items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-9 flex-1 cursor-pointer text-xs"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              className="h-9 flex-1 cursor-pointer text-xs"
            >
              Apply Filters
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
