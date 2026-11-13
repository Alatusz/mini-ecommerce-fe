import { useState, useEffect, useMemo } from "react"
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
import { Separator } from "@/components/ui/separator"
import { useCategoryOptions } from "../useHooks"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
export interface AdvancedFilterState {
  searchBy: string[]
  status: string[]
  stockStatus: string[]
  category: string[]
}

interface ProductFilterDrawerProps {
  currentFilters: AdvancedFilterState
  onApply: (filters: AdvancedFilterState) => void
  onReset: () => void
}

// ── Centralized Default Filters ──
export const DEFAULT_FILTERS: AdvancedFilterState = {
  searchBy: [],
  status: [],
  stockStatus: [],
  category: [],
}

export const SEARCH_TARGET_OPTIONS = [
  { value: "name", label: "Product Name" },
  { value: "sku", label: "Product SKU" },
] as const

export const STATUS_OPTIONS = [
  { id: "published", label: "Published", dot: "bg-emerald-500" },
  { id: "draft", label: "Draft", dot: "bg-zinc-400" },
  { id: "archived", label: "Archived", dot: "bg-amber-500" },
]

export const STOCK_OPTIONS = [
  { id: "in_stock", label: "In Stock", dot: "bg-emerald-500" },
  { id: "low_stock", label: "Low Stock", dot: "bg-amber-500" },
  { id: "out_of_stock", label: "Out of Stock", dot: "bg-red-500" },
]

export function ProductFilterDrawer({
  currentFilters = DEFAULT_FILTERS,
  onApply,
  onReset,
}: ProductFilterDrawerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<AdvancedFilterState>(currentFilters)
  const [categorySearch, setCategorySearch] = useState("")

  // ── ดึงตัวเลือกหมวดหมู่จาก Custom Hook
  const { data: categoryOptions = [] } = useCategoryOptions()

  const filteredCategoryOptions = useMemo(() => {
    const query = categorySearch.toLocaleLowerCase().trim()

    if (!query) return categoryOptions

    return categoryOptions.filter((cat) =>
      cat.name.toLocaleLowerCase().includes(query)
    )
  }, [categoryOptions, categorySearch])

  // Sync draft state เมื่อเปิด Drawer หรือเมื่อ currentFilters ใน URL มีการเปลี่ยน
  useEffect(() => {
    if (open) {
      setDraft(currentFilters ?? DEFAULT_FILTERS)
    }
  }, [open, currentFilters])

  const handleApply = () => {
    onApply(draft)

    setOpen(false)
  }

  const handleReset = () => {
    setDraft(DEFAULT_FILTERS)

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
        {/* ── 1. Header ── */}
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-base font-semibold">
                Product Filters
              </SheetTitle>
            </div>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Filter products by search column, lifecycle status, stock level, and
            category.
          </SheetDescription>
        </SheetHeader>

        {/* ── 2. Scrollable Body ── */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Section 1: Search Target Column Dropdown */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Search Target Column
            </Label>
            <Select
              multiple
              value={draft.searchBy}
              onValueChange={(values) => {
                setDraft((prev) => ({ ...prev, searchBy: values }))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    value?.length === 1
                      ? SEARCH_TARGET_OPTIONS.find(
                          (opt) => opt.value === value[0]
                        )?.label || value[0]
                      : "All Columns"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {SEARCH_TARGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Section 2: Product Status Dropdown */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Product Status
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
                    value.length === STATUS_OPTIONS.length
                      ? "All Status"
                      : value
                          .map(
                            (id) =>
                              STATUS_OPTIONS.find((s) => s.id === id)?.label ||
                              id
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {STATUS_OPTIONS.map((st) => (
                    <SelectItem key={st.id} value={st.label}>
                      <span className="flex items-center gap-2">
                        <span
                          className={`size-2 shrink-0 rounded-full ${st.dot}`}
                        />
                        <span>{st.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Section 3: Stock Status Dropdown */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Stock Status
            </Label>
            <Select
              multiple
              value={draft.stockStatus}
              onValueChange={(values: string[]) => {
                setDraft((prev) => ({ ...prev, stockStatus: values }))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === STOCK_OPTIONS.length
                      ? "All Status"
                      : value
                          .map(
                            (id) =>
                              STOCK_OPTIONS.find((s) => s.id === id)?.label ||
                              id
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {STOCK_OPTIONS.map((sto) => (
                    <SelectItem key={sto.id} value={sto.label}>
                      <span className="flex items-center gap-2">
                        <span
                          className={`size-2 shrink-0 rounded-full ${sto.dot}`}
                        />
                        <span>{sto.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Section 4: Category Dropdown */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label>Category</Label>
            </div>
            <Select
              multiple
              value={draft.category}
              onValueChange={(values: string[]) => {
                setDraft((prev) => ({ ...prev, category: values }))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === categoryOptions.length
                      ? "All Categories"
                      : value.length === 1
                        ? value[0]
                        : `${value.length} Categories`
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {/* Sticky Search Input */}
                <div className="border-b p-1.5">
                  <div className="relative">
                    <Field>
                      <Input
                        id="input-field-username"
                        type="text"
                        placeholder="Search..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </Field>
                  </div>
                </div>

                {/* Scrollable Category List */}
                <SelectGroup className="max-h-56 overflow-y-auto p-1">
                  {filteredCategoryOptions.length === 0 ? (
                    <div className="py-3 text-center text-xs text-muted-foreground">
                      No categories found
                    </div>
                  ) : (
                    filteredCategoryOptions.map((cto) => (
                      <SelectItem key={cto.id} value={cto.name}>
                        <span>{cto.name}</span>
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── 3. Footer ── */}
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
