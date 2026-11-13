import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageContent } from "@/components/common/PageContent"
import { PageHeader } from "@/components/common/PageHeader"
import { useProduct } from "./useHooks"
import { ProductStatsGrid } from "./common/ProductStatsGrid"
import { ProductTable } from "./common/ProductTable"
import { ProductDeleteDialog } from "./common/ProductDeleteDialog"

export default function DashboardProductPage() {
  const {
    products,
    total,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    totalUnits,
    selectedSearchBy,
    selectedStatuses,
    selectedStockStatuses,
    selectedCategories,
    handleApplyAdvancedFilters,
    handleResetFilters,
    deletingProduct,
    setDeletingProduct,
    handleDeleteProduct,
    isDeleting,
    isLoading,
  } = useProduct()

  return (
    <PageContent>
      {/* ── Page Header ── */}
      <PageHeader
        title="Products"
        description="Manage product catalog, live inventory, and multi-channel pricing."
      >
        <Link to="/dashboard/product/create">
          <Button
            size="sm"
            className="h-8 shrink-0 cursor-pointer gap-1.5 bg-foreground px-3.5 text-xs text-background hover:bg-foreground/90"
          >
            <Plus className="size-3.5" />
            <span>Add Product</span>
          </Button>
        </Link>
      </PageHeader>

      {/* ── Inventory KPI Metrics ── */}
      <ProductStatsGrid
        total={total}
        totalUnits={totalUnits}
        inStockCount={inStockCount}
        lowStockCount={lowStockCount}
        outOfStockCount={outOfStockCount}
      />

      {/* ── TanStack DataGrid Table with Advanced Filter Popover ── */}
      <ProductTable
        data={products}
        total={total}
        filters={{
          searchBy: selectedSearchBy,
          status: selectedStatuses,
          stockStatus: selectedStockStatuses,
          category: selectedCategories,
        }}
        onApplyFilters={handleApplyAdvancedFilters}
        onResetFilters={handleResetFilters}
        onDelete={setDeletingProduct}
        isLoading={isLoading}
      />

      {/* ── Dialog: Delete Product Confirmation ── */}
      <ProductDeleteDialog
        product={deletingProduct}
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
        isDeleting={isDeleting}
      />
    </PageContent>
  )
}
