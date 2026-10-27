import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import { useCategory, type CategoryItem } from "./useHooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { PageContent } from "@/components/common/PageContent"

const categoryColumnHelper = createColumnHelper<
  DataGridFeatures,
  CategoryItem
>()

export default function DashboardCategoryPage() {
  const {
    categories,
    deletingCategory,
    setDeletingCategory,
    handleDeleteCategory,
  } = useCategory()

  // Columns for TanStack Table DataGrid
  const columns = useMemo(
    () => [
      categoryColumnHelper.accessor("name", {
        header: "Category Name",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 p-1 border border-border/40 overflow-hidden">
              {info.row.original.image ? (
                <img
                  src={info.row.original.image}
                  alt={info.getValue()}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <Tags className="size-4 text-foreground" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground sm:text-sm truncate">
                {info.getValue()}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {info.row.original.id}
              </span>
            </div>
          </div>
        ),
      }),
      categoryColumnHelper.accessor("slug", {
        header: "Slug / Route",
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground font-semibold">
            /{info.getValue()}
          </span>
        ),
      }),
      categoryColumnHelper.accessor("itemCount", {
        header: "Catalog Items",
        cell: (info) => (
          <span className="text-xs font-medium text-foreground">
            {info.getValue()} products
          </span>
        ),
      }),
      categoryColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue() || "Active"
          return (
            <Badge
              variant="outline"
              className={
                status === "Active"
                  ? "border-emerald-500/30 bg-emerald-50 text-[10px] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-zinc-400/30 bg-zinc-100 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }
            >
              {status}
            </Badge>
          )
        },
      }),
      categoryColumnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Link to={`/dashboard/category/edit/${row.original.id}`}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                title="Edit category page"
              >
                <Pencil className="size-3.5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDeletingCategory(row.original)}
              className="cursor-pointer text-muted-foreground hover:text-destructive"
              title="Delete category"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [setDeletingCategory]
  )

  return (
    <PageContent>
      {/* ── Page Header with Add Action ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Product Categories
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage product collections, taxonomy hierarchies, and storefront routing slugs.
          </p>
        </div>
        <Link to="/dashboard/category/create">
          <Button className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer shrink-0">
            <Plus className="size-4" />
            <span>Add Category</span>
          </Button>
        </Link>
      </div>

      {/* ── TanStack DataGrid ── */}
      <DataGrid
        data={categories}
        columns={columns}
        urlSync={true}
        defaultPageSize={10}
        searchPlaceholder="Filter category rows..."
      />

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                {deletingCategory?.name}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingCategory(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                if (deletingCategory) {
                  handleDeleteCategory(deletingCategory.id)
                }
              }}
              className="cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContent>
  )
}
