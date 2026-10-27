import { useMemo } from "react"
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  LayoutGrid,
  Table2,
  FolderTree,
  Sparkles,
  Layers,
  AlertCircle,
  Search,
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
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const categoryColumnHelper = createColumnHelper<DataGridFeatures, CategoryItem>()

export default function DashboardCategoryPage() {
  const {
    categories,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    stats,
    // Dialogs
    isAddOpen,
    setIsAddOpen,
    editingCategory,
    setEditingCategory,
    deletingCategory,
    setDeletingCategory,
    formData,
    setFormData,
    formError,
    // Actions
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  } = useCategory()

  // Columns for TanStack Table DataGrid
  const columns = useMemo(
    () => [
      categoryColumnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="size-4 rounded accent-black dark:accent-white cursor-pointer"
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="size-4 rounded accent-black dark:accent-white cursor-pointer"
            aria-label={`Select row ${row.original.name}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      categoryColumnHelper.accessor("name", {
        header: "Category Name",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
              <Tags className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-xs sm:text-sm">
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
          <Badge
            variant="outline"
            className="font-mono text-[11px] font-normal text-muted-foreground"
          >
            /{info.getValue()}
          </Badge>
        ),
      }),
      categoryColumnHelper.accessor("itemCount", {
        header: "Catalog Items",
        cell: (info) => (
          <Badge variant="secondary" className="text-xs font-medium">
            {info.getValue()} products
          </Badge>
        ),
      }),
      categoryColumnHelper.accessor("description", {
        header: "Description",
        cell: (info) => (
          <span
            className="text-xs text-muted-foreground max-w-xs truncate block"
            title={info.getValue()}
          >
            {info.getValue()}
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
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openEditDialog(row.original)}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
              title="Edit category"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openDeleteDialog(row.original)}
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
    []
  )

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Product Categories
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Organize catalog inventory, hierarchy taxonomy, and storefront collections.
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer shrink-0"
        >
          <Plus className="size-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Categories
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <FolderTree className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-xl font-bold text-foreground sm:text-2xl">
              {stats.totalCategories}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Active taxonomy groups
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Assigned Products
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Layers className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-xl font-bold text-foreground sm:text-2xl">
              {stats.totalItems}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Live items across store
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Status
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-xl font-bold text-foreground sm:text-2xl">
              {stats.activeCount} / {stats.totalCategories}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Visible on customer storefront
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Top Category
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Tags className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-base font-bold text-foreground truncate sm:text-lg">
              {stats.topCategoryName}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.topCategoryCount} products indexed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Toolbar: Search & View Mode Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search category name, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-8 text-xs bg-muted/40 rounded-lg border-border/60"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 self-end sm:self-auto rounded-lg border border-border/60 bg-muted/40 p-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("table")}
            className={`h-7 px-2.5 text-xs font-medium cursor-pointer ${
              viewMode === "table"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table2 className="mr-1.5 size-3.5" />
            Table View
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`h-7 px-2.5 text-xs font-medium cursor-pointer ${
              viewMode === "grid"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="mr-1.5 size-3.5" />
            Grid View
          </Button>
        </div>
      </div>

      {/* ── Content View ── */}
      {viewMode === "table" ? (
        <DataGrid
          title="Categories Directory"
          description="Browse and organize product collections powered by TanStack Table."
          data={categories}
          columns={columns}
          urlSync={true}
          defaultPageSize={10}
          searchPlaceholder="Filter table rows..."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="p-5 flex flex-col justify-between hover:border-foreground/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
                      <Tags className="size-4 text-foreground" />
                    </div>
                    <div>
                      <span className="font-bold text-sm sm:text-base block">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {cat.id}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {cat.itemCount} items
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mt-3 leading-relaxed min-h-[36px]">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40 text-xs">
                <span className="font-mono text-[11px] text-muted-foreground">
                  /{cat.slug}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEditDialog(cat)}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    title="Edit category"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openDeleteDialog(cat)}
                    className="cursor-pointer text-muted-foreground hover:text-destructive"
                    title="Delete category"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Dialog 1: Add Category ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to group related catalog products.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="add-name" className="text-xs font-semibold">
                Category Name *
              </Label>
              <Input
                id="add-name"
                placeholder="e.g. Smart Watches"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="add-slug" className="text-xs font-semibold">
                Slug (URL identifier)
              </Label>
              <Input
                id="add-slug"
                placeholder="e.g. smart-watches (auto-generated if empty)"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="add-desc" className="text-xs font-semibold">
                Description
              </Label>
              <Textarea
                id="add-desc"
                placeholder="Brief summary of products in this category..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="text-xs resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAddCategory}
              className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer"
            >
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 2: Edit Category ── */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details, taxonomy slug, or description.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-xs font-semibold">
                Category Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-slug" className="text-xs font-semibold">
                Slug (URL identifier)
              </Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-desc" className="text-xs font-semibold">
                Description
              </Label>
              <Textarea
                id="edit-desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="text-xs resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingCategory(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUpdateCategory}
              className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 3: Delete Confirmation ── */}
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

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
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
              onClick={handleDeleteCategory}
              className="cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
