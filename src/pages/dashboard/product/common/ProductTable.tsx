import { useMemo } from "react"
import { Link } from "react-router-dom"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import type { ProductItem } from "@/services/product.services"
import { getStockTextColor, PRODUCT_STATUS_CONFIG } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ProductFilterDrawer,
  type AdvancedFilterState,
} from "./ProductFilterDrawer"

const productColumnHelper = createColumnHelper<DataGridFeatures, ProductItem>()

interface ProductTableProps {
  data: ProductItem[]
  total: number
  filters: AdvancedFilterState
  onApplyFilters: (filters: AdvancedFilterState) => void
  onResetFilters: () => void
  onDelete: (product: ProductItem) => void
  isLoading?: boolean
}

export function ProductTable({
  data,
  total,
  filters,
  onApplyFilters,
  onResetFilters,
  onDelete,
}: ProductTableProps) {
  const getStatusBadge = (status: ProductItem["status"]) => {
    const config = PRODUCT_STATUS_CONFIG[status]
    if (!config) {
      return (
        <span className="text-xs text-muted-foreground capitalize">
          {status}
        </span>
      )
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${config.badgeClass}`}
      >
        <span className={`size-1.5 rounded-full ${config.dotClass}`} />
        {config.label}
      </span>
    )
  }

  const columns = useMemo(
    () => [
      productColumnHelper.accessor("name", {
        header: "Product",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/50 p-1">
              <img
                src={
                  info.row.original.images?.[0] || "/images/detail-purple.png"
                }
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
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {info.getValue() || "-"}
          </span>
        ),
      }),
      productColumnHelper.accessor((row) => row.categories?.[0]?.name || "-", {
        id: "categories",
        header: "Category",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      productColumnHelper.accessor("sellPrice", {
        header: "Price",
        cell: (info) => {
          const price = info.getValue() ?? info.row.original.originalPrice ?? 0
          return (
            <span className="text-xs font-semibold text-foreground tabular-nums">
              ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          )
        },
      }),
      productColumnHelper.accessor("stock", {
        header: "Stock",
        cell: (info) => (
          <span
            className={`text-xs tabular-nums ${getStockTextColor(
              info.getValue()
            )}`}
          >
            {info.getValue().toLocaleString()} units
          </span>
        ),
      }),
      productColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => getStatusBadge(info.getValue()),
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
              <DropdownMenuContent align="end" className="w-36">
                <Link to={`/dashboard/product/edit/${row.original.id}`}>
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <Pencil className="size-3.5 text-muted-foreground" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(row.original)}
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
    [onDelete]
  )

  return (
    <DataGrid
      data={data}
      columns={columns}
      urlSync={true}
      defaultPageSize={10}
      searchPlaceholder="Search..."
      manualPagination={true}
      manualFiltering={true}
      rowCount={total}
      actions={
        <ProductFilterDrawer
          currentFilters={filters}
          onApply={onApplyFilters}
          onReset={onResetFilters}
        />
      }
    />
  )
}
