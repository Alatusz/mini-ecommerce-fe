import { useState, useEffect } from "react"
import { Filter } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CategorySearchTarget = "name" | "slug"

export const CATEGORY_SEARCH_TARGET_OPTIONS = [
  { value: "name", label: "Category Name" },
  { value: "slug", label: "Slug" },
] as const

export interface CategoryFilterState {
  status: string[]
  searchBy: CategorySearchTarget[]
}

interface CategoryFilterDrawerProps {
  currentFilters: CategoryFilterState
  onApply: (filters: CategoryFilterState) => void
  onReset: () => void
}

export const CATEGORY_STATUS_OPTIONS = [
  { id: "active", label: "Active", dot: "bg-emerald-500" },
  { id: "draft", label: "Draft", dot: "bg-zinc-400" },
  { id: "archived", label: "Archived", dot: "bg-amber-500" },
] as const

export const DEFAULT_CATEGORY_FILTERS: CategoryFilterState = {
  status: [],
  searchBy: [],
}

export function CategoryFilterDrawer({
  currentFilters = DEFAULT_CATEGORY_FILTERS,
  onApply,
  onReset,
}: CategoryFilterDrawerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<CategoryFilterState>(currentFilters)

  useEffect(() => {
    if (open) {
      setDraft(currentFilters ?? DEFAULT_CATEGORY_FILTERS)
    }
  }, [open, currentFilters])

  const handleApply = () => {
    onApply(draft)
    setOpen(false)
  }

  const handleReset = () => {
    setDraft(DEFAULT_CATEGORY_FILTERS)
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
            className="h-9 cursor-pointer gap-1.5 border-border/70 text-xs"
          >
            <Filter className="size-3.5 text-muted-foreground" />
            <span>Filters</span>
          </Button>
        }
      />

      <SheetContent
        side="right"
        className="flex h-full w-full flex-col p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-base font-semibold">
            Category Filters
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Filter categories by lifecycle status.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Search Target Column */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Search Target Column
            </Label>
            <Select
              multiple
              value={draft.searchBy}
              onValueChange={(values: CategorySearchTarget[]) => {
                setDraft((prev) => ({ ...prev, searchBy: values }))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: CategorySearchTarget[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === CATEGORY_SEARCH_TARGET_OPTIONS.length
                      ? "All Columns (Default)"
                      : value
                          .map(
                            (v) =>
                              CATEGORY_SEARCH_TARGET_OPTIONS.find((o) => o.value === v)
                                ?.label || v
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {CATEGORY_SEARCH_TARGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Category Status
            </Label>
            <Select
              multiple
              value={draft.status}
              onValueChange={(values: string[]) => {
                setDraft((prev) => ({ ...prev, status: values }))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === CATEGORY_STATUS_OPTIONS.length
                      ? "All Status"
                      : value
                          .map(
                            (id) =>
                              CATEGORY_STATUS_OPTIONS.find((s) => s.id === id)
                                ?.label || id
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {CATEGORY_STATUS_OPTIONS.map((st) => (
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
              Reset Filters
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              className="h-9 flex-1 cursor-pointer text-xs font-medium"
            >
              Apply
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
