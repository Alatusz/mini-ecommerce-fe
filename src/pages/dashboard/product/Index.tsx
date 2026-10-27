import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Plus,
  Pencil,
  Trash2,
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
  type ProductItem,
} from "./useHooks"
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

const productColumnHelper = createColumnHelper<DataGridFeatures, ProductItem>()

export default function DashboardProductPage() {
  const {
    products,
    deletingProduct,
    setDeletingProduct,
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
        header: "Stock Units",
        cell: (info) => (
          <span className="text-xs font-medium text-foreground">
            {info.getValue().toLocaleString()} units
          </span>
        ),
      }),
      productColumnHelper.accessor("status", {
        header: "Stock Status",
        cell: (info) => getStockBadge(info.getValue()),
      }),
      productColumnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Link to={`/dashboard/product/edit/${row.original.id}`}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                title="Edit product"
              >
                <Pencil className="size-3.5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDeletingProduct(row.original)}
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
    [setDeletingProduct]
  )

  return (
    <PageContent>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Products Catalog
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage inventory stocks, pricing structures, and merchandise across your store.
          </p>
        </div>
        <Link to="/dashboard/product/create">
          <Button
            className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer shrink-0"
          >
            <Plus className="size-4" />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>

      {/* ── TanStack DataGrid ── */}
      <DataGrid
        data={products}
        columns={columns}
        urlSync={true}
        defaultPageSize={10}
        searchPlaceholder="Filter product rows..."
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
