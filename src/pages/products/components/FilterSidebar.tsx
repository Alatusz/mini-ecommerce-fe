import { useState } from "react"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { brandCounts } from "../mockProductList"

interface FilterSidebarProps {
  selectedBrands: string[]
  onToggleBrand: (brand: string) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  onClearFilters?: () => void
}

function FilterSidebar({
  selectedBrands,
  onToggleBrand,
  priceRange,
  onPriceChange,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    brand: true,
  })

  const [brandSearch, setBrandSearch] = useState("")

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const filteredBrands = brandCounts.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  )

  return (
    <aside className="w-full flex flex-col divide-y divide-border/60 text-xs">
      {/* 1. Price (กำหนดราคา) */}
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

      {/* 2. Brand (แบรนด์) */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          className="flex w-full items-center justify-between text-left text-sm font-bold text-foreground cursor-pointer"
        >
          <span>Brand</span>
          {openSections.brand ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>

        {openSections.brand && (
          <div className="mt-3 flex flex-col gap-2.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="h-8 pl-8 text-xs bg-muted/40 rounded-lg"
              />
            </div>

            <div className="flex max-h-56 flex-col overflow-y-auto pr-1">
              {filteredBrands.map((brand) => {
                const isChecked = selectedBrands.includes(brand.name)
                return (
                  <label
                    key={brand.name}
                    className="flex items-center justify-between py-1.5 text-xs cursor-pointer hover:text-foreground"
                  >
                    <div className="flex items-center gap-2.5">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => onToggleBrand(brand.name)}
                      />
                      <span
                        className={`${
                          isChecked
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {brand.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {brand.count}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default FilterSidebar
