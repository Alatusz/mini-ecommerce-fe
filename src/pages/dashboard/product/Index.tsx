/**
 * Products Catalog — Unslop Redesign (dashboard-design skill)
 * Question: "Which SKUs are low or out of stock and need restocking?"
 * - Wordless: compact numeric facts in header & KPI cards; zero prose sentences.
 * - Quiet & Salience: healthy "In Stock" is calm; "Low Stock" (amber) & "Out of Stock" (red) stand out.
 */
import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Layers,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
} from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import { useProduct, type ProductItem } from "./useHooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { PageContent } from "@/components/common/PageContent"

const productColumnHelper = createColumnHelper<DataGridFeatures, ProductItem>()

export default function DashboardProductPage() {
  const {
    products,
    deletingProduct,
    setDeletingProduct,
    handleDeleteProduct,
  } = useProduct()

  const inStockCount = products.filter((p) => p.status === "In Stock").length
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length
  const outOfStockCount = products.filter(
    (p) => p.status === "Out of Stock"
  ).length
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0)

  const getStockBadge = (status: ProductItem["status"]) => {
    switch (status) {
      case "In Stock":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            In Stock
          </span>
        )
      case "Low Stock":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Low Stock
          </span>
        )
      case "Out of Stock":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:text-red-300">
            <span className="size-1.5 rounded-full bg-red-500" />
            Out of Stock
          </span>
        )
    }
  }

  const columns = useMemo(
    () => [
      productColumnHelper.accessor("name", {
        header: "Product",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/50 p-1">
              <img
                src={info.row.original.image}
                alt={info.getValue()}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="truncate text-xs font-medium text-foreground">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      productColumnHelper.accessor("sku", {
        header: "SKU",
        cell: (info) => (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      productColumnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      productColumnHelper.accessor("price", {
        header: "Price",
        cell: (info) => (
          <span className="text-xs font-semibold tabular-nums text-foreground">
            ${info.getValue().toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        ),
      }),
      productColumnHelper.accessor("stock", {
        header: "Stock",
        cell: (info) => {
          const stock = info.getValue()
          const status = info.row.original.status

          return (
            <span
              className={`text-xs tabular-nums ${
                status === "Out of Stock"
                  ? "font-semibold text-red-600 dark:text-red-400"
                  : status === "Low Stock"
                    ? "font-semibold text-amber-600 dark:text-amber-400"
                    : "font-medium text-foreground"
              }`}
            >
              {stock.toLocaleString()} units
            </span>
          )
        },
      }),
      productColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => getStockBadge(info.getValue()),
      }),
      productColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                    title="Actions"
                  >
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="start" className="w-36">
                <Link to={`/dashboard/product/edit/${row.original.id}`}>
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <Pencil className="size-3.5 text-muted-foreground" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeletingProduct(row.original)}
                  className="cursor-pointer gap-2"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [setDeletingProduct]
  )

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
        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total SKUs
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <Package className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {products.length}
            </div>
            <div className="mt-1 text-xs tabular-nums text-muted-foreground">
              {inStockCount} in stock
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Inventory Volume
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <Layers className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {totalUnits.toLocaleString()}
            </div>
            <div className="mt-1 text-xs tabular-nums text-muted-foreground">
              units on hand
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Low Stock
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <AlertTriangle className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div
              className={`text-2xl font-semibold tracking-tight tabular-nums ${
                lowStockCount > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-foreground"
              }`}
            >
              {lowStockCount}
            </div>
            <div className="mt-1 text-xs tabular-nums text-muted-foreground">
              below threshold
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Out of Stock
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <XCircle className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div
              className={`text-2xl font-semibold tracking-tight tabular-nums ${
                outOfStockCount > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-foreground"
              }`}
            >
              {outOfStockCount}
            </div>
            <div className="mt-1 text-xs tabular-nums text-muted-foreground">
              0 units available
            </div>
          </div>
        </Card>
      </div>

      {/* ── TanStack DataGrid ── */}
      <DataGrid
        data={products}
        columns={columns}
        urlSync={true}
        defaultPageSize={10}
        searchPlaceholder="Search products or SKU..."
      />

      {/* ── Dialog: Delete Product Confirmation ── */}
      <Dialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Remove{" "}
              <strong className="text-foreground">
                {deletingProduct?.name}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
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
              onClick={() => {
                if (deletingProduct) {
                  handleDeleteProduct(deletingProduct.id)
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
