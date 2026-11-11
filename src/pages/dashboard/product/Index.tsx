import { Link } from "react-router-dom"
import { Plus, Package, Layers, AlertTriangle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/common/StatCard"
import { PageContent } from "@/components/common/PageContent"
import { useProduct } from "./useHooks"
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
    searchBy,
    selectedStatuses,
    selectedStockStatuses,
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
      {/* ── Header & Toolbar ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Products
          </h1>
        </div>

        <Link to="/dashboard/product/create">
          <Button
            size="sm"
            className="h-8 shrink-0 cursor-pointer gap-1.5 rounded-full bg-foreground px-3.5 text-xs text-background hover:bg-foreground/90"
          >
            <Plus className="size-3.5" />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>

      {/* ── 4 KPI Cards (Monochrome Icons + Tabular Numbers) ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total SKUs"
          value={total}
          icon={<Package className="size-3.5" />}
          description={`${inStockCount} in stock`}
        />

        <StatCard
          title="Inventory Volume"
          value={totalUnits.toLocaleString()}
          icon={<Layers className="size-3.5" />}
          description="units on hand"
        />

        <StatCard
          title="Low Stock"
          value={lowStockCount}
          icon={<AlertTriangle className="size-3.5" />}
          valueClassName={
            lowStockCount > 0
              ? "text-amber-600 dark:text-amber-400"
              : "text-foreground"
          }
          description="below threshold"
        />

        <StatCard
          title="Out of Stock"
          value={outOfStockCount}
          icon={<XCircle className="size-3.5" />}
          valueClassName={
            outOfStockCount > 0
              ? "text-red-600 dark:text-red-400"
              : "text-foreground"
          }
          description="0 units available"
        />
      </div>

      {/* ── TanStack DataGrid Table with Advanced Filter Popover ── */}
      <ProductTable
        data={products}
        total={total}
        filters={{
          searchBy,
          status: selectedStatuses,
          stockStatus: selectedStockStatuses,
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
