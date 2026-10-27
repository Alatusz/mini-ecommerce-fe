import { useMemo } from "react"
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import {
  useProduct,
  productCategories,
  type ProductItem,
} from "./useHooks"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const productColumnHelper = createColumnHelper<DataGridFeatures, ProductItem>()

export default function DashboardProductPage() {
  const {
    products,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    stats,
    // Dialogs
    isAddOpen,
    setIsAddOpen,
    editingProduct,
    setEditingProduct,
    deletingProduct,
    setDeletingProduct,
    formData,
    setFormData,
    formError,
    // Actions
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  } = useProduct()

  const getStockBadge = (status: ProductItem["status"]) => {
    switch (status) {
      case "In Stock":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-50 text-[10px] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="mr-1 size-3" />
            In Stock
          </Badge>
        )
      case "Low Stock":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-50 text-[10px] text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          >
            <AlertCircle className="mr-1 size-3" />
            Low Stock
          </Badge>
        )
      case "Out of Stock":
        return (
          <Badge
            variant="outline"
            className="border-red-500/30 bg-red-50 text-[10px] text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            <XCircle className="mr-1 size-3" />
            Out of Stock
          </Badge>
        )
    }
  }

  // TanStack Table columns
  const columns = useMemo(
    () => [
      productColumnHelper.display({
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
      productColumnHelper.accessor("name", {
        header: "Product",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted p-1 border border-border/40 flex items-center justify-center shrink-0">
              <img
                src={info.row.original.image}
                alt={info.getValue()}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-foreground truncate">
                {info.getValue()}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {info.row.original.id}
              </span>
            </div>
          </div>
        ),
      }),
      productColumnHelper.accessor("sku", {
        header: "SKU",
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground font-semibold">
            {info.getValue()}
          </span>
        ),
      }),
      productColumnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <Badge variant="secondary" className="text-xs font-normal">
            {info.getValue()}
          </Badge>
        ),
      }),
      productColumnHelper.accessor("price", {
        header: "Price",
        cell: (info) => (
          <span className="text-xs sm:text-sm font-bold text-foreground">
            ${info.getValue().toFixed(2)}
          </span>
        ),
      }),
      productColumnHelper.accessor("stock", {
        header: "Stock Level",
        cell: (info) => (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-foreground">
              {info.getValue()} units
            </span>
            {getStockBadge(info.row.original.status)}
          </div>
        ),
      }),
      productColumnHelper.accessor("salesCount", {
        header: "Sales",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue()} sold
          </span>
        ),
      }),
      productColumnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openEditDialog(row.original)}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
              title="Edit product"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openDeleteDialog(row.original)}
              className="cursor-pointer text-muted-foreground hover:text-destructive"
              title="Delete product"
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
            Products Catalog
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage inventory stocks, pricing structures, and merchandise across your store.
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer shrink-0"
        >
          <Plus className="size-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Package className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-xl font-bold text-foreground sm:text-2xl">
              {stats.totalProducts}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              SKUs across 6 departments
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Inventory Value
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <DollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-xl font-bold text-foreground sm:text-2xl">
              ${stats.totalInventoryValue.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Calculated at retail pricing
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Stock Warnings
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-xl font-bold text-foreground sm:text-2xl">
              {stats.lowStockCount} items
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Require replenishment soon
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Best Seller
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <TrendingUp className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-base font-bold text-foreground truncate sm:text-lg">
              {stats.topSellerName}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.topSellerSales} units purchased
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-8 text-xs bg-muted/40 rounded-lg border-border/60"
          />
        </div>

        {/* Filter Badges / Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1 overflow-x-auto max-w-full">
            {productCategories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors shrink-0 ${
                  categoryFilter === cat
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
            {(["All", "In Stock", "Low Stock", "Out of Stock"] as const).map(
              (stock) => (
                <button
                  key={stock}
                  type="button"
                  onClick={() => setStockFilter(stock)}
                  className={`cursor-pointer rounded-md px-2 py-1 text-[11px] font-semibold transition-colors shrink-0 ${
                    stockFilter === stock
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {stock}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── TanStack DataGrid ── */}
      <DataGrid
        title="Products Inventory"
        description="Comprehensive product inventory table with multi-column sorting and filtering."
        data={products}
        columns={columns}
        urlSync={true}
        defaultPageSize={10}
        searchPlaceholder="Filter product rows..."
      />

      {/* ── Dialog 1: Add Product ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new item in your inventory catalog.
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
              <Label htmlFor="prod-name" className="text-xs font-semibold">
                Product Title *
              </Label>
              <Input
                id="prod-name"
                placeholder="e.g. Sony WH-1000XM5"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prod-sku" className="text-xs font-semibold">
                  SKU Code *
                </Label>
                <Input
                  id="prod-sku"
                  placeholder="e.g. WH-XM5-BLK"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className="text-xs font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-cat" className="text-xs font-semibold">
                  Category
                </Label>
                <select
                  id="prod-cat"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none"
                >
                  {productCategories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prod-price" className="text-xs font-semibold">
                  Price ($)
                </Label>
                <Input
                  id="prod-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-stock" className="text-xs font-semibold">
                  Stock Units
                </Label>
                <Input
                  id="prod-stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  className="text-xs"
                />
              </div>
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
              onClick={handleAddProduct}
              className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer"
            >
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 2: Edit Product ── */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update pricing, inventory levels, and classification.
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
              <Label htmlFor="edit-pname" className="text-xs font-semibold">
                Product Title *
              </Label>
              <Input
                id="edit-pname"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-psku" className="text-xs font-semibold">
                  SKU Code *
                </Label>
                <Input
                  id="edit-psku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className="text-xs font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-pcat" className="text-xs font-semibold">
                  Category
                </Label>
                <select
                  id="edit-pcat"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none"
                >
                  {productCategories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-pprice" className="text-xs font-semibold">
                  Price ($)
                </Label>
                <Input
                  id="edit-pprice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-pstock" className="text-xs font-semibold">
                  Stock Units
                </Label>
                <Input
                  id="edit-pstock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingProduct(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUpdateProduct}
              className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 3: Delete Product ── */}
      <Dialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <strong className="text-foreground">
                {deletingProduct?.name}
              </strong>{" "}
              from the store catalog?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingProduct(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteProduct}
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
