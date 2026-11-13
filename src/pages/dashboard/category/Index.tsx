/**
 * Categories Dashboard — Unslop Redesign (dashboard-design skill)
 * Question: "Are all categories populated and published, or are any empty/draft?"
 * - Wordless: compact numeric facts in header & KPI cards; zero prose sentences.
 * - Quiet: monochrome KPI icons; warm amber only when empty/draft categories need attention.
 */
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageContent } from "@/components/common/PageContent"
import { useCategory } from "./useHooks"
import { CategoryStatsGrid } from "./common/CategoryStatsGrid"
import { CategoryTable } from "./common/CategoryTable"
import { CategoryDeleteDialog } from "./common/CategoryDeleteDialog"

export default function DashboardCategoryPage() {
  const {
    categories,
    total,
    isLoading,
    activeCount,
    draftCount,
    archivedCount,
    totalProducts,
    emptyCount,
    avgProducts,
    deletingCategory,
    setDeletingCategory,
    handleDeleteCategory,
    isDeleting,
    handleStatusChange,
    selectedStatuses,
    handleStatusFilterChange,
  } = useCategory()

  return (
    <PageContent>
      {/* ── Header & Toolbar ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Categories
          </h1>
        </div>

        <Link to="/dashboard/category/create">
          <Button
            size="sm"
            className="h-8 shrink-0 cursor-pointer gap-1.5 rounded-full bg-foreground px-3.5 text-xs text-background hover:bg-foreground/90"
          >
            <Plus className="size-3.5" />
            <span>Add Category</span>
          </Button>
        </Link>
      </div>

      {/* ── KPI Strip (4 Monochrome-Icon Cards) ── */}
      <CategoryStatsGrid
        total={total}
        activeCount={activeCount}
        draftCount={draftCount}
        archivedCount={archivedCount}
        totalProducts={totalProducts}
        emptyCount={emptyCount}
        avgProducts={avgProducts}
      />

      {/* ── TanStack DataGrid Table ── */}
      <CategoryTable
        data={categories}
        total={total}
        selectedStatuses={selectedStatuses}
        onStatusFilterChange={handleStatusFilterChange}
        onDelete={setDeletingCategory}
        onStatusChange={handleStatusChange}
        isLoading={isLoading}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <CategoryDeleteDialog
        category={deletingCategory}
        open={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        isDeleting={isDeleting}
      />
    </PageContent>
  )
}
