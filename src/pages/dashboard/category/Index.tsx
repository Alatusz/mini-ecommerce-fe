/**
 * Categories Dashboard — Unslop Redesign (dashboard-design skill)
 * Question: "Are all categories populated and published, or are any empty/draft?"
 * - Wordless: compact numeric facts in header & KPI cards; zero prose sentences.
 * - Quiet: monochrome KPI icons; warm amber only when empty/draft categories need attention.
 */
import { Link } from "react-router-dom"
import { Plus, Tags, Package, AlertTriangle, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/common/StatCard"
import { PageContent } from "@/components/common/PageContent"
import { useCategory } from "./useHooks"
import { CategoryTable } from "./common/CategoryTable"
import { CategoryDeleteDialog } from "./common/CategoryDeleteDialog"

export default function DashboardCategoryPage() {
  const {
    categories,
    total,
    isLoading,
    deletingCategory,
    setDeletingCategory,
    handleDeleteCategory,
    isDeleting,
    handleStatusChange,
  } = useCategory()

  const activeCount = categories.filter((c) => c.status === "active").length
  const draftCount = categories.filter((c) => c.status === "draft").length
  const archivedCount = categories.filter((c) => c.status === "archived").length
  const totalProducts = categories.reduce(
    (sum, c) => sum + (c.productCount ?? c.itemCount ?? 0),
    0
  )
  const emptyCount = categories.filter(
    (c) => (c.productCount ?? c.itemCount ?? 0) === 0
  ).length
  const avgProducts = total > 0 ? (totalProducts / total).toFixed(1) : "—"

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
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Categories"
          value={total}
          icon={<Tags className="size-3.5" />}
          description={`${activeCount} active · ${archivedCount} archived`}
        />

        <StatCard
          title="Assigned Products"
          value={totalProducts.toLocaleString()}
          icon={<Package className="size-3.5" />}
          description={`${avgProducts} avg / category`}
        />

        <StatCard
          title="Empty Categories"
          value={emptyCount}
          icon={<AlertTriangle className="size-3.5" />}
          valueClassName={
            emptyCount > 0
              ? "text-amber-600 dark:text-amber-400"
              : "text-foreground"
          }
          description={emptyCount > 0 ? "0 products assigned" : "All populated"}
        />

        <StatCard
          title="Drafts & Hidden"
          value={draftCount + archivedCount}
          icon={<EyeOff className="size-3.5" />}
          description={`${draftCount} draft · ${archivedCount} archived`}
        />
      </div>

      {/* ── TanStack DataGrid Table ── */}
      <CategoryTable
        data={categories}
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
