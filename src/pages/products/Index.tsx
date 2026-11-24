import { useState, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  Search,
} from "lucide-react"

import ProductCard from "@/components/shares/ProductCard"
import FilterSidebar from "./components/FilterSidebar"
import {
  useProductsCatalogQuery,
  useProductCategoriesQuery,
} from "./useHubs"
import { mapProductToCard } from "@/pages/home/useHubs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type SortOption = "newest" | "price-asc" | "price-desc" | "name"

const DEFAULT_PRICE_RANGE: [number, number] = [0, 100000]
const ITEMS_PER_PAGE = 15

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [priceRange, setPriceRange] =
    useState<[number, number]>(DEFAULT_PRICE_RANGE)
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1)
  const search = searchParams.get("search") || ""
  const rawCategory = searchParams.get("category") || ""
  const selectedCategories = useMemo(
    () =>
      rawCategory
        ? rawCategory
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    [rawCategory]
  )

  const updateParams = (
    updates: Record<string, string | number | undefined>
  ) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(updates).forEach(([k, v]) => {
          if (v === undefined || v === "" || v === null) {
            next.delete(k)
          } else {
            next.set(k, String(v))
          }
        })
        return next
      },
      { replace: true }
    )
  }

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useProductCategoriesQuery()
  const categories = categoriesData?.data ?? []

  const { data: productsData, isLoading: isLoadingProducts } =
    useProductsCatalogQuery({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: search || undefined,
      category:
        selectedCategories.length > 0
          ? selectedCategories.join(",")
          : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice:
        priceRange[1] < DEFAULT_PRICE_RANGE[1] ? priceRange[1] : undefined,
      sort: sortBy,
    })

  const handleToggleCategory = (categoryId: string) => {
    const next = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]
    updateParams({
      category: next.length > 0 ? next.join(",") : undefined,
      page: 1,
    })
  }

  const handleResetFilters = () => {
    setPriceRange(DEFAULT_PRICE_RANGE)
    setSortBy("newest")
    updateParams({ category: undefined, search: undefined, page: 1 })
  }

  const displayProducts = useMemo(() => {
    return (productsData?.data ?? []).map(mapProductToCard)
  }, [productsData])

  const totalCount = productsData?.total ?? displayProducts.length
  const totalPages = Math.max(1, productsData?.totalPages ?? 1)

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
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            isLoadingCategories={isLoadingCategories}
          />
        </div>

        {/* Right Product Grid Area */}
        <div className="flex flex-1 min-w-0 w-full flex-col gap-6">
          {/* Top Bar: Search, Counter & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
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
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onToggleCategory={handleToggleCategory}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        isLoadingCategories={isLoadingCategories}
                      />
                    </div>
                    <div className="p-4 border-t">
                      <DrawerClose
                        render={
                          <Button className="w-full cursor-pointer">
                            View Results ({displayProducts.length})
                          </Button>
                        }
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>

              <div className="text-sm text-muted-foreground">
                Products:{" "}
                <span className="font-bold text-foreground">{totalCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-44 sm:w-56">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) =>
                    updateParams({
                      search: e.target.value || undefined,
                      page: 1,
                    })
                  }
                  className="h-9 pl-8 text-xs"
                />
              </div>

              <Select
                value={sortBy}
                onValueChange={(val) => setSortBy(val as SortOption)}
              >
                <SelectTrigger className="h-9 min-w-36 text-xs cursor-pointer bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Product Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : displayProducts.length > 0 ? (
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
                ลองปรับช่วงราคา หมวดหมู่ หรือคำค้นหาใหม่
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent className="gap-1 sm:gap-1.5">
                  <PaginationItem>
                    <PaginationPrevious
                      text=""
                      onClick={() =>
                        updateParams({ page: Math.max(1, currentPage - 1) })
                      }
                      className={`cursor-pointer size-8 p-0 flex items-center justify-center ${
                        currentPage === 1
                          ? "pointer-events-none opacity-40"
                          : ""
                      }`}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={currentPage === p}
                          onClick={() => updateParams({ page: p })}
                          className={`size-8 text-xs cursor-pointer ${
                            currentPage === p
                              ? "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black"
                              : ""
                          }`}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      text=""
                      onClick={() =>
                        updateParams({
                          page: Math.min(totalPages, currentPage + 1),
                        })
                      }
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
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductListPage
