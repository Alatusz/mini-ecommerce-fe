/**
 * Categories Dashboard — Unslop Redesign (dashboard-design skill)
 * Question: "Are all categories populated and published, or are any empty/draft?"
 * - Wordless: compact numeric facts in header & KPI cards; zero prose sentences.
 * - Quiet: monochrome KPI icons; warm amber only when empty/draft categories need attention.
 */
import { Link } from "react-router-dom"
import { Plus, Tags, Package, AlertTriangle, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

  const activeCount = categories.filter(
    (c) => (c.status || "active").toLowerCase() === "active"
  ).length
  const draftCount = categories.filter(
    (c) => (c.status || "").toLowerCase() === "draft"
  ).length
  const archivedCount = categories.filter(
    (c) => (c.status || "").toLowerCase() === "archived"
  ).length
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
        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total Categories
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <Tags className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {total}
            </div>
            <div className="mt-1 text-xs text-muted-foreground tabular-nums">
              {activeCount} active · {archivedCount} archived
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Assigned Products
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <Package className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {totalProducts.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-muted-foreground tabular-nums">
              {avgProducts} avg / category
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Empty Categories
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <AlertTriangle className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div
              className={`text-2xl font-semibold tracking-tight tabular-nums ${
                emptyCount > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-foreground"
              }`}
            >
              {emptyCount}
            </div>
            <div className="mt-1 text-xs text-muted-foreground tabular-nums">
              {emptyCount > 0 ? "0 products assigned" : "All populated"}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Drafts & Hidden
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <EyeOff className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {draftCount + archivedCount}
            </div>
            <div className="mt-1 text-xs text-muted-foreground tabular-nums">
              {draftCount} draft · {archivedCount} archived
            </div>
          </div>
        </Card>
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
