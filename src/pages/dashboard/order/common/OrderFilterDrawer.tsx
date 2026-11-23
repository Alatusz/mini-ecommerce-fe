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
  ORDER_SEARCH_TARGET_OPTIONS,
  ORDER_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  type OrderSearchTarget,
} from "../useHubs"

export interface OrderFilterState {
  searchBy: OrderSearchTarget[]
  status: string[]
  paymentStatus: string[]
  paymentMethod: string[]
}

export const DEFAULT_ORDER_FILTERS: OrderFilterState = {
  searchBy: [],
  status: [],
  paymentStatus: [],
  paymentMethod: [],
}

interface OrderFilterDrawerProps {
  currentFilters: OrderFilterState
  onApply: (filters: OrderFilterState) => void
  onReset: () => void
}

export function OrderFilterDrawer({
  currentFilters,
  onApply,
  onReset,
}: OrderFilterDrawerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<OrderFilterState>(currentFilters)

  useEffect(() => {
    if (open) setDraft(currentFilters)
  }, [open, currentFilters])

  const activeFilterCount =
    (currentFilters.searchBy.length > 0 ? 1 : 0) +
    (currentFilters.status.length > 0 ? 1 : 0) +
    (currentFilters.paymentStatus.length > 0 ? 1 : 0) +
    (currentFilters.paymentMethod.length > 0 ? 1 : 0)

  const handleApply = () => {
    onApply(draft)
    setOpen(false)
  }

  const handleReset = () => {
    setDraft(DEFAULT_ORDER_FILTERS)
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
            Order Filters
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Filter orders by search target, fulfillment status, and payment.
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
              onValueChange={(values: OrderSearchTarget[]) =>
                setDraft((prev) => ({ ...prev, searchBy: values }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: OrderSearchTarget[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === ORDER_SEARCH_TARGET_OPTIONS.length
                      ? "All Columns"
                      : value
                          .map(
                            (v) =>
                              ORDER_SEARCH_TARGET_OPTIONS.find((o) => o.value === v)
                                ?.label || v
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {ORDER_SEARCH_TARGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Order Status */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Order Status
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
                    value.length === ORDER_STATUS_OPTIONS.length
                      ? "All Status"
                      : value
                          .map(
                            (id) =>
                              ORDER_STATUS_OPTIONS.find((s) => s.id === id)?.label ||
                              id
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {ORDER_STATUS_OPTIONS.map((st) => (
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

          {/* Payment Status */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Payment Status
            </Label>
            <Select
              multiple
              value={draft.paymentStatus}
              onValueChange={(values: string[]) =>
                setDraft((prev) => ({ ...prev, paymentStatus: values }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === PAYMENT_STATUS_OPTIONS.length
                      ? "All Payment Status"
                      : value
                          .map(
                            (id) =>
                              PAYMENT_STATUS_OPTIONS.find((s) => s.id === id)
                                ?.label || id
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {PAYMENT_STATUS_OPTIONS.map((st) => (
                    <SelectItem key={st.id} value={st.id}>
                      {st.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Payment Method
            </Label>
            <Select
              multiple
              value={draft.paymentMethod}
              onValueChange={(values: string[]) =>
                setDraft((prev) => ({ ...prev, paymentMethod: values }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === PAYMENT_METHOD_OPTIONS.length
                      ? "All Methods"
                      : value
                          .map(
                            (id) =>
                              PAYMENT_METHOD_OPTIONS.find((m) => m.id === id)
                                ?.label || id
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {PAYMENT_METHOD_OPTIONS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
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
