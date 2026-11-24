import { useState } from "react"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { StorefrontCategoryItem } from "@/services/storefront.services"

interface FilterSidebarProps {
  categories: StorefrontCategoryItem[]
  selectedCategories: string[]
  onToggleCategory: (categoryId: string) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  isLoadingCategories?: boolean
}

function FilterSidebar({
  categories,
  selectedCategories,
  onToggleCategory,
  priceRange,
  onPriceChange,
  isLoadingCategories = false,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    category: true,
  })

  const [categorySearch, setCategorySearch] = useState("")

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  return (
    <aside className="w-full flex flex-col divide-y divide-border/60 text-xs">
      {/* 1. Price */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between text-left text-sm font-bold text-foreground cursor-pointer"
        >
          <span>Price</span>
          {openSections.price ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1">
              <span className="text-[10px] text-muted-foreground">From</span>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  onPriceChange([Number(e.target.value) || 0, priceRange[1]])
                }
                className="mt-1 h-8 text-xs font-medium"
              />
            </div>

            <span className="mt-4 text-muted-foreground">-</span>

            <div className="flex-1">
              <span className="text-[10px] text-muted-foreground">To</span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceChange([priceRange[0], Number(e.target.value) || 0])
                }
                className="mt-1 h-8 text-xs font-medium"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Categories */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="flex w-full items-center justify-between text-left text-sm font-bold text-foreground cursor-pointer"
        >
          <span>Categories</span>
          {openSections.category ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>

        {openSections.category && (
          <div className="mt-3 flex flex-col gap-2.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search category"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="h-8 pl-8 text-xs bg-muted/40 rounded-lg"
              />
            </div>

            <div className="flex max-h-56 flex-col overflow-y-auto pr-1">
              {isLoadingCategories ? (
                <p className="py-2 text-muted-foreground">Loading...</p>
              ) : filteredCategories.length === 0 ? (
                <p className="py-2 text-muted-foreground">No categories</p>
              ) : (
                filteredCategories.map((category) => {
                  const isChecked = selectedCategories.includes(category.id)
                  return (
                    <label
                      key={category.id}
                      className="flex items-center justify-between py-1.5 text-xs cursor-pointer hover:text-foreground"
                    >
                      <div className="flex items-center gap-2.5">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => onToggleCategory(category.id)}
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {category.name}
                        </span>
                      </div>
                      {category.productCount !== undefined && (
                        <span className="text-[11px] text-muted-foreground">
                          {category.productCount}
                        </span>
                      )}
                    </label>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default FilterSidebar
