import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, SlidersHorizontal, RotateCcw } from "lucide-react"

import { mockProductList } from "./mockProductList"
import ProductCard from "@/components/shares/ProductCard"
import FilterSidebar from "./components/FilterSidebar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type SortOption = "rating" | "price-asc" | "price-desc" | "name"

function ProductListPage() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(["Apple"])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 70000])
  const [sortBy, setSortBy] = useState<SortOption>("rating")
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  const handleResetFilters = () => {
    setSelectedBrands([])
    setPriceRange([0, 70000])
    setSortBy("rating")
    setCurrentPage(1)
  }

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return mockProductList
      .filter((product) => {
        // Brand filter
        if (
          selectedBrands.length > 0 &&
          !selectedBrands.includes(product.brand)
        ) {
          return false
        }
        // Price filter
        if (
          product.price < priceRange[0] ||
          product.price > priceRange[1]
        ) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating
        if (sortBy === "price-asc") return a.price - b.price
        if (sortBy === "price-desc") return b.price - a.price
        if (sortBy === "name") return a.name.localeCompare(b.name)
        return 0
      })
  }, [selectedBrands, priceRange, sortBy])

  // Pagination slice (e.g. 18 items per page)
  const itemsPerPage = 18
  const totalPages = 12 // Matches attachment mockup with pages up to 12
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const displayProducts =
    paginatedProducts.length > 0 ? paginatedProducts : filteredProducts

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium">Products</span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Desktop Left Sidebar Filter */}
        <div className="hidden lg:block w-64 xl:w-72 shrink-0">
          <FilterSidebar
            selectedBrands={selectedBrands}
            onToggleBrand={handleToggleBrand}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            onClearFilters={handleResetFilters}
          />
        </div>

        {/* Right Product Grid Area */}
        <div className="flex flex-1 min-w-0 w-full flex-col gap-6">
          {/* Top Bar: Counter & Sort */}
          <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Drawer Trigger */}
              <div className="lg:hidden">
                <Drawer swipeDirection="down">
                  <DrawerTrigger
                    render={
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer gap-2"
                      >
                        <SlidersHorizontal className="size-3.5" />
                        Filters
                      </Button>
                    }
                  />
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Filters</DrawerTitle>
                    </DrawerHeader>
                    <div className="max-h-[70vh] overflow-y-auto px-4 py-2">
                      <FilterSidebar
                        selectedBrands={selectedBrands}
                        onToggleBrand={handleToggleBrand}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        onClearFilters={handleResetFilters}
                      />
                    </div>
                    <div className="p-4 border-t">
                      <DrawerClose
                        render={
                          <Button className="w-full cursor-pointer">
                            View Results ({filteredProducts.length})
                          </Button>
                        }
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>

              {/* Selected Products Count */}
              <div className="text-sm text-muted-foreground">
                Selected Products:{" "}
                <span className="font-bold text-foreground">
                  {filteredProducts.length}
                </span>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(val) => setSortBy(val as SortOption)}
              >
                <SelectTrigger className="h-9 min-w-36 text-xs cursor-pointer bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="rating">By rating</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Product Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid - 6 Columns on Desktop */}
          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
              <p className="text-base font-semibold text-foreground">
                ไม่พบสินค้าตามเงื่อนไขที่เลือก
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                ลองปรับช่วงราคาหรือตัวเลือกแบรนด์เพื่อค้นหาสินค้า
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-4 gap-2 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                รีเซ็ตตัวกรองทั้งหมด
              </Button>
            </div>
          )}

          {/* Pagination Matching Attachment */}
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent className="gap-1 sm:gap-1.5">
                <PaginationItem>
                  <PaginationPrevious
                    text=""
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={`cursor-pointer size-8 p-0 flex items-center justify-center ${
                      currentPage === 1 ? "pointer-events-none opacity-40" : ""
                    }`}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    isActive={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className={`size-8 text-xs cursor-pointer ${
                      currentPage === 1
                        ? "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black"
                        : ""
                    }`}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    isActive={currentPage === 2}
                    onClick={() => setCurrentPage(2)}
                    className={`size-8 text-xs cursor-pointer ${
                      currentPage === 2
                        ? "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black"
                        : ""
                    }`}
                  >
                    2
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    isActive={currentPage === 3}
                    onClick={() => setCurrentPage(3)}
                    className={`size-8 text-xs cursor-pointer ${
                      currentPage === 3
                        ? "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black"
                        : ""
                    }`}
                  >
                    3
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    isActive={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className={`size-8 text-xs cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black"
                        : ""
                    }`}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    text=""
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={`cursor-pointer size-8 p-0 flex items-center justify-center ${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-40"
                        : ""
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListPage
