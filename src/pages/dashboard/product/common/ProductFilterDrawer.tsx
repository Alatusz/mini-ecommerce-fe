import { useState, useEffect, useMemo } from "react"
import { Filter, Search, X, ChevronDown } from "lucide-react"

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useCategoryOptions } from "../useHooks"

export interface AdvancedFilterState {
  searchBy: "all" | "name" | "sku"
  status: string[]
  stockStatus: string[]
  category: string[]
}

interface ProductFilterDrawerProps {
  currentFilters: AdvancedFilterState
  onApply: (filters: AdvancedFilterState) => void
  onReset: () => void
}

const STATUS_OPTIONS = [
  { id: "published", label: "Published", dot: "bg-emerald-500" },
  { id: "draft", label: "Draft", dot: "bg-zinc-400" },
  { id: "archived", label: "Archived", dot: "bg-amber-500" },
]

const STOCK_OPTIONS = [
  { id: "in_stock", label: "In Stock", dot: "bg-emerald-500" },
  { id: "low_stock", label: "Low Stock", dot: "bg-amber-500" },
  { id: "out_of_stock", label: "Out of Stock", dot: "bg-red-500" },
]

export function ProductFilterDrawer({
  currentFilters,
  onApply,
  onReset,
}: ProductFilterDrawerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<AdvancedFilterState>(currentFilters)

  // ── Popover open states สำหรับ Dropdown แต่ละส่วน ──
  const [searchColumnDropdownOpen, setSearchColumnDropdownOpen] =
    useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [stockStatusDropdownOpen, setStockStatusDropdownOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")

  // ── State สำหรับ Search Target Column (เหมือน Status: ว่างเปล่า = Default คือ All) ──
  const [searchTargets, setSearchTargets] = useState<("name" | "sku")[]>(() => {
    if (currentFilters.searchBy === "name") return ["name"]
    if (currentFilters.searchBy === "sku") return ["sku"]
    return [] // เริ่มต้นคือ All (ไม่มีค่าใดถูกติ๊ก เหมือน status)
  })

  // ── ดึงตัวเลือกหมวดหมู่จาก Custom Hook ประจำโมดูล (limit: 100) ──
  const { data: categoryOptions = [], isLoading: isLoadingCategories } =
    useCategoryOptions(100)

  // Sync draft state เมื่อเปิด Drawer หรือเมื่อ currentFilters ใน URL มีการเปลี่ยน
  useEffect(() => {
    if (open) {
      if (currentFilters.searchBy === "name") {
        setSearchTargets(["name"])
      } else if (currentFilters.searchBy === "sku") {
        setSearchTargets(["sku"])
      } else {
        setSearchTargets([]) // สถานะเริ่มต้นคือ All ไม่มีค่าใดถูกติ๊ก
      }
      setDraft(currentFilters)
      setCategorySearch("")
    }
  }, [open, currentFilters])

  // คำนวณ searchBy สำหรับส่งให้ Parent
  const computedSearchBy: "all" | "name" | "sku" = useMemo(() => {
    if (searchTargets.length === 1 && searchTargets[0] === "name") {
      return "name"
    }
    if (searchTargets.length === 1 && searchTargets[0] === "sku") {
      return "sku"
    }
    return "all"
  }, [searchTargets])

  // ── คำนวณความ Active ของแต่ละส่วน (All = ไม่ Active เพราะเป็นค่าเริ่มต้น) ──
  const isSearchActive = searchTargets.length === 1
  const isStatusActive =
    draft.status.length > 0 && draft.status.length < STATUS_OPTIONS.length
  const isStockActive =
    draft.stockStatus.length > 0 &&
    draft.stockStatus.length < STOCK_OPTIONS.length

  // คำนวณจำนวน Filter ที่กำลัง Active
  const activeCount =
    (currentFilters.searchBy !== "all" ? 1 : 0) +
    (currentFilters.status.length > 0 &&
    currentFilters.status.length < STATUS_OPTIONS.length
      ? 1
      : 0) +
    (currentFilters.stockStatus.length > 0 &&
    currentFilters.stockStatus.length < STOCK_OPTIONS.length
      ? 1
      : 0) +
    currentFilters.category.length

  const draftActiveCount =
    (isSearchActive ? 1 : 0) +
    (isStatusActive ? 1 : 0) +
    (isStockActive ? 1 : 0) +
    draft.category.length

  const handleApply = () => {
    onApply({
      ...draft,
      searchBy: computedSearchBy,
    })
    setOpen(false)
  }

  const handleReset = () => {
    setSearchTargets([])
    setDraft({
      searchBy: "all",
      status: [],
      stockStatus: [],
      category: [],
    })
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

  const toggleCategory = (id: string, checked: boolean) => {
    setDraft((prev) => ({
      ...prev,
      category: checked
        ? [...prev.category, id]
        : prev.category.filter((c) => c !== id),
    }))
  }

  // ── ตรรกะ Checkbox สำหรับ Search Target Column (Pattern A: ว่างเปล่า = Default คือ All) ──
  const handleToggleSearchColumn = (
    columnId: "name" | "sku",
    checked: boolean
  ) => {
    setSearchTargets((prev) =>
      checked ? [...prev, columnId] : prev.filter((id) => id !== columnId)
    )
  }

  // ── สรุป Label บน Trigger ของแต่ละ Dropdown (เมื่อไม่มีการเลือก = "All") ──
  const selectedSearchColumnLabel = useMemo(() => {
    if (searchTargets.length === 1 && searchTargets[0] === "name")
      return "Product"
    if (searchTargets.length === 1 && searchTargets[0] === "sku") return "SKU"
    return "All"
  }, [searchTargets])

  const selectedStatusLabel = useMemo(() => {
    if (
      draft.status.length === 0 ||
      draft.status.length === STATUS_OPTIONS.length
    ) {
      return "All"
    }
    if (draft.status.length === 1) {
      return (
        STATUS_OPTIONS.find((s) => s.id === draft.status[0])?.label ||
        draft.status[0]
      )
    }
    return draft.status
      .map((id) => STATUS_OPTIONS.find((s) => s.id === id)?.label || id)
      .join(", ")
  }, [draft.status])

  const selectedStockStatusLabel = useMemo(() => {
    if (
      draft.stockStatus.length === 0 ||
      draft.stockStatus.length === STOCK_OPTIONS.length
    ) {
      return "All"
    }
    if (draft.stockStatus.length === 1) {
      return (
        STOCK_OPTIONS.find((s) => s.id === draft.stockStatus[0])?.label ||
        draft.stockStatus[0]
      )
    }
    return draft.stockStatus
      .map((id) => STOCK_OPTIONS.find((s) => s.id === id)?.label || id)
      .join(", ")
  }, [draft.stockStatus])

  // กรอง Category ตามคำค้นหา (เฉพาะ Category ที่มีช่องค้นหา)
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categoryOptions
    const query = categorySearch.toLowerCase().trim()
    return categoryOptions.filter((cat) =>
      cat.name.toLowerCase().includes(query)
    )
  }, [categoryOptions, categorySearch])

  const selectedCategoryLabel = useMemo(() => {
    if (draft.category.length === 0) return "All"
    if (draft.category.length === 1) {
      const found = categoryOptions.find((c) => c.id === draft.category[0])
      return found?.name || "1 category selected"
    }
    return `${draft.category.length} categories selected`
  }, [draft.category, categoryOptions])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 cursor-pointer gap-1.5 border-border/70 text-xs text-muted-foreground transition-colors hover:text-foreground",
              activeCount > 0 &&
                "border-primary/40 bg-primary/5 font-medium text-foreground"
            )}
          >
            <Filter className="size-3.5 text-muted-foreground" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="text-xs font-semibold text-primary">
                ({activeCount})
              </span>
            )}
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
            <Popover
              open={searchColumnDropdownOpen}
              onOpenChange={setSearchColumnDropdownOpen}
            >
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border bg-card px-3 py-1.5 text-xs transition-colors hover:bg-accent/40 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
                      isSearchActive
                        ? "border-primary/40 bg-primary/5 font-medium text-foreground"
                        : "border-input font-medium text-foreground"
                    )}
                  >
                    <span className="truncate">
                      {selectedSearchColumnLabel}
                    </span>
                    <ChevronDown className="ml-2 size-4 shrink-0 opacity-60" />
                  </button>
                }
              />
              <PopoverContent
                align="start"
                sideOffset={4}
                className="z-60 w-80 space-y-0.5 p-1.5"
              >
                {[
                  { id: "name" as const, label: "Product" },
                  { id: "sku" as const, label: "SKU" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors select-none",
                      searchTargets.includes(item.id)
                        ? "bg-primary/10 font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Checkbox
                      checked={searchTargets.includes(item.id)}
                      onCheckedChange={(checked) =>
                        handleToggleSearchColumn(item.id, Boolean(checked))
                      }
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                  </label>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          {/* Section 2: Product Status Dropdown (No Search) */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Product Status
            </Label>
            <Popover
              open={statusDropdownOpen}
              onOpenChange={setStatusDropdownOpen}
            >
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border border-input bg-card px-3 py-1.5 text-xs transition-colors hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
                      isStatusActive
                        ? "border-primary/40 bg-primary/5 font-medium text-foreground"
                        : "font-medium text-foreground"
                    )}
                  >
                    <span className="truncate">{selectedStatusLabel}</span>
                    <ChevronDown className="ml-2 size-4 shrink-0 opacity-60" />
                  </button>
                }
              />
              <PopoverContent
                align="start"
                sideOffset={4}
                className="z-60 w-80 space-y-0.5 p-1.5"
              >
                {STATUS_OPTIONS.map((st) => (
                  <label
                    key={st.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors select-none",
                      draft.status.includes(st.id)
                        ? "bg-primary/10 font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Checkbox
                      checked={draft.status.includes(st.id)}
                      onCheckedChange={(checked) =>
                        toggleStatus(st.id, Boolean(checked))
                      }
                    />
                    <span className={cn("size-2 rounded-full", st.dot)} />
                    <span className="flex-1 truncate">{st.label}</span>
                  </label>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          {/* Section 3: Stock Status Dropdown (No Search) */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Stock Status
            </Label>
            <Popover
              open={stockStatusDropdownOpen}
              onOpenChange={setStockStatusDropdownOpen}
            >
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border border-input bg-card px-3 py-1.5 text-xs transition-colors hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
                      isStockActive
                        ? "border-primary/40 bg-primary/5 font-medium text-foreground"
                        : "font-medium text-foreground"
                    )}
                  >
                    <span className="truncate">{selectedStockStatusLabel}</span>
                    <ChevronDown className="ml-2 size-4 shrink-0 opacity-60" />
                  </button>
                }
              />
              <PopoverContent
                align="start"
                sideOffset={4}
                className="z-60 w-80 space-y-0.5 p-1.5"
              >
                {STOCK_OPTIONS.map((st) => (
                  <label
                    key={st.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors select-none",
                      draft.stockStatus.includes(st.id)
                        ? "bg-primary/10 font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Checkbox
                      checked={draft.stockStatus.includes(st.id)}
                      onCheckedChange={(checked) =>
                        toggleStockStatus(st.id, Boolean(checked))
                      }
                    />
                    <span className={cn("size-2 rounded-full", st.dot)} />
                    <span className="flex-1 truncate">{st.label}</span>
                  </label>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          {/* Section 4: Category Dropdown (With Search for 100+ items) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Category
              </Label>
              {categoryOptions.length > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  ({categoryOptions.length})
                </span>
              )}
            </div>

            <Popover
              open={categoryDropdownOpen}
              onOpenChange={setCategoryDropdownOpen}
            >
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border border-input bg-card px-3 py-1.5 text-xs transition-colors hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
                      draft.category.length > 0
                        ? "border-primary/40 bg-primary/5 font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="truncate">{selectedCategoryLabel}</span>
                    <ChevronDown className="ml-2 size-4 shrink-0 opacity-60" />
                  </button>
                }
              />
              <PopoverContent
                align="start"
                sideOffset={4}
                className="z-60 w-80 space-y-2 p-2"
              >
                {/* Search input เฉพาะ Category */}
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories..."
                    className="h-8 pr-7 pl-8 text-xs"
                    autoFocus
                  />
                  {categorySearch && (
                    <button
                      type="button"
                      onClick={() => setCategorySearch("")}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer p-0.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>

                {/* Categories Checkbox List */}
                <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
                  {isLoadingCategories ? (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      Loading categories...
                    </div>
                  ) : filteredCategories.length === 0 ? (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      No categories found matching "{categorySearch}"
                    </div>
                  ) : (
                    filteredCategories.map((cat) => {
                      const isChecked = draft.category.includes(cat.id)
                      return (
                        <label
                          key={cat.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors select-none",
                            isChecked
                              ? "bg-primary/10 font-medium text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              toggleCategory(cat.id, Boolean(checked))
                            }
                          />
                          <span className="flex-1 truncate">{cat.name}</span>
                        </label>
                      )
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>
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
              Apply {draftActiveCount > 0 ? `(${draftActiveCount})` : ""}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
