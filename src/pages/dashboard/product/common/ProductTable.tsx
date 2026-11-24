import { useMemo } from "react"
import { Link } from "react-router-dom"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import type {
  ProductItem,
  ProductPublishStatus,
} from "@/services/product.services"
import { FALLBACK_IMAGE } from "@/lib/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STOCK_STATUS_COLORS = {
  in_stock: {
    textClass: "text-emerald-600 dark:text-emerald-400 font-medium",
  },
  low_stock: {
    textClass: "text-amber-600 dark:text-amber-400 font-semibold",
  },
  out_of_stock: {
    textClass: "text-red-600 dark:text-red-400 font-semibold",
  },
} as const

const getStockTextColor = (stock: number): string => {
  if (stock <= 0) return STOCK_STATUS_COLORS.out_of_stock.textClass
  if (stock <= 10) return STOCK_STATUS_COLORS.low_stock.textClass
  return STOCK_STATUS_COLORS.in_stock.textClass
}
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

const PRODUCT_STATUS_OPTIONS: {
  id: ProductPublishStatus
  label: string
  dot: string
}[] = [
  { id: "published", label: "Published", dot: "bg-emerald-500" },
  { id: "draft", label: "Draft", dot: "bg-zinc-400" },
  { id: "archived", label: "Archived", dot: "bg-amber-500" },
]

const productColumnHelper = createColumnHelper<DataGridFeatures, ProductItem>()

interface ProductTableProps {
  data: ProductItem[]
  total: number
  filters: AdvancedFilterState
  onApplyFilters: (filters: AdvancedFilterState) => void
  onResetFilters: () => void
  onStatusChange: (id: string, status: ProductPublishStatus) => void
  isUpdatingStatus?: boolean
  onDelete: (product: ProductItem) => void
  isLoading?: boolean
}

export function ProductTable({
  data,
  total,
  filters,
  onApplyFilters,
  onResetFilters,
  onStatusChange,
  isUpdatingStatus = false,
  onDelete,
}: ProductTableProps) {

  const columns = useMemo(
    () => [
      productColumnHelper.accessor("name", {
        header: "Product",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/50 p-1">
              <img
                src={info.row.original.images?.[0] || FALLBACK_IMAGE}
                alt={info.getValue()}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = FALLBACK_IMAGE
                }}
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
        cell: (info) => {
          const product = info.row.original
          const currentStatus = info.getValue() || "draft"
          const statusOpt = PRODUCT_STATUS_OPTIONS.find(
            (s) => s.id === currentStatus
          )
          const categoryStatus = product.categories?.[0]?.status ?? "active"
          const hasValidPrice = (product.sellPrice ?? 0) > 0
          const canPublish = categoryStatus === "active" && hasValidPrice
          const publishBlockReason =
            categoryStatus !== "active"
              ? "Category must be active"
              : !hasValidPrice
                ? "Price must be > 0"
                : undefined

          return (
            <Select
              value={currentStatus}
              disabled={isUpdatingStatus}
              onValueChange={(val) =>
                onStatusChange(product.id, val as ProductPublishStatus)
              }
            >
              <SelectTrigger className="h-7 w-[124px] text-xs">
                <SelectValue>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`size-2 shrink-0 rounded-full ${statusOpt?.dot ?? "bg-zinc-400"}`}
                    />
                    <span>{statusOpt?.label ?? currentStatus}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_STATUS_OPTIONS.map((opt) => {
                  const isDisabled = opt.id === "published" && !canPublish
                  return (
                    <SelectItem
                      key={opt.id}
                      value={opt.id}
                      disabled={isDisabled}
                      title={isDisabled ? publishBlockReason : undefined}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`size-2 shrink-0 rounded-full ${opt.dot}`}
                        />
                        <span>{opt.label}</span>
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        },
      }),
      productColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const hasOrders = (row.original.ordersCount ?? 0) > 0
          const isPublished = row.original.status === "published"
          const deleteDisabled = hasOrders || isPublished
          const deleteHint = hasOrders
            ? "Has orders · Archive instead"
            : isPublished
              ? "Unpublish before deleting"
              : undefined

          return (
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
                <DropdownMenuContent align="end" className="w-44">
                  <Link to={`/dashboard/product/edit/${row.original.id}`}>
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <Pencil className="size-3.5 text-muted-foreground" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={deleteDisabled}
                    title={deleteHint}
                    onClick={() => onDelete(row.original)}
                    className="cursor-pointer gap-2"
                  >
                    <Trash2 className="size-3.5" />
                    <div className="flex flex-col">
                      <span>Delete</span>
                      {deleteHint && (
                        <span className="text-[10px] font-normal text-muted-foreground">
                          {deleteHint}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
        enableSorting: false,
      }),
    ],
    [onStatusChange, isUpdatingStatus, onDelete]
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
