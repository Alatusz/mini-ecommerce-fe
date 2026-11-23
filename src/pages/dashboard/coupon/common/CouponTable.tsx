import { useMemo } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CouponFilterDrawer,
  type CouponFilterState,
} from "./CouponFilterDrawer"
import {
  COUPON_STATUS_OPTIONS,
  type CouponItem,
  type CouponSearchTarget,
  type CouponStatus,
} from "../useHubs"

const couponColumnHelper = createColumnHelper<DataGridFeatures, CouponItem>()

interface CouponTableProps {
  data: CouponItem[]
  total: number
  selectedSearchBy: CouponSearchTarget[]
  selectedTypes: string[]
  selectedStatuses: string[]
  onFilterApply: (filters: CouponFilterState) => void
  onFilterReset: () => void
  onStatusChange: (id: string, status: CouponStatus) => void
  isUpdatingStatus?: boolean
  onEdit: (coupon: CouponItem) => void
  onDelete: (coupon: CouponItem) => void
}

function formatShortDate(raw?: string) {
  if (!raw) return "—"
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function CouponTable({
  data,
  total,
  selectedSearchBy,
  selectedTypes,
  selectedStatuses,
  onFilterApply,
  onFilterReset,
  onStatusChange,
  isUpdatingStatus = false,
  onEdit,
  onDelete,
}: CouponTableProps) {
  const columns = useMemo(
    () => [
      couponColumnHelper.accessor("code", {
        header: "Code Name",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold text-foreground">
              {row.original.code}
            </p>
            {row.original.description && (
              <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                {row.original.description}
              </p>
            )}
          </div>
        ),
      }),
      couponColumnHelper.accessor("discountType", {
        header: "Type",
        cell: ({ row }) => {
          const { discountType, discountValue } = row.original
          return (
            <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs font-medium tabular-nums">
              {discountType === "percent"
                ? `${discountValue}%`
                : `฿${discountValue.toLocaleString()}`}
            </span>
          )
        },
      }),
      couponColumnHelper.accessor("minSpend", {
        header: "Min Spent",
        cell: (info) => {
          const val = Number(info.getValue() ?? 0)
          return (
            <span className="text-xs text-muted-foreground tabular-nums">
              {val > 0 ? `฿${val.toLocaleString()}` : "No min"}
            </span>
          )
        },
      }),
      couponColumnHelper.accessor("usageCount", {
        header: "Redemptions",
        cell: ({ row }) => {
          const { usageCount, usageLimit } = row.original
          return (
            <span className="text-xs font-medium tabular-nums">
              {usageCount.toLocaleString()}
              {usageLimit ? ` / ${usageLimit.toLocaleString()}` : " / ∞"}
            </span>
          )
        },
      }),
      couponColumnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => {
          const coupon = row.original
          const current = coupon.status || "active"
          const statusOpt = COUPON_STATUS_OPTIONS.find((s) => s.id === current)
          return (
            <Select
              value={current}
              disabled={isUpdatingStatus}
              onValueChange={(val) =>
                val && onStatusChange(coupon.id, val as CouponStatus)
              }
            >
              <SelectTrigger className="h-7 w-[125px] text-xs">
                <SelectValue>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`size-2 shrink-0 rounded-full ${statusOpt?.dot ?? "bg-zinc-400"}`}
                    />
                    <span>{statusOpt?.label ?? current}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COUPON_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-2 shrink-0 rounded-full ${opt.dot}`}
                      />
                      <span>{opt.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      }),
      couponColumnHelper.accessor("startDate", {
        header: "Date Range",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatShortDate(row.original.startDate)} –{" "}
            {formatShortDate(row.original.expiredDate)}
          </span>
        ),
      }),
      couponColumnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const coupon = row.original
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
                    />
                  }
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => onEdit(coupon)}
                  >
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => onDelete(coupon)}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      }),
    ],
    [onStatusChange, isUpdatingStatus, onEdit, onDelete]
  )

  return (
    <DataGrid
      data={data}
      columns={columns}
      urlSync={true}
      defaultPageSize={10}
      searchPlaceholder="Search coupon code..."
      manualPagination={true}
      manualFiltering={true}
      rowCount={total}
      actions={
        <CouponFilterDrawer
          currentFilters={{
            searchBy: selectedSearchBy,
            type: selectedTypes,
            status: selectedStatuses,
          }}
          onApply={onFilterApply}
          onReset={onFilterReset}
        />
      }
    />
  )
}
