import { useMemo } from "react"
import { Eye, MoreHorizontal, Trash2 } from "lucide-react"
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
  OrderFilterDrawer,
  type OrderFilterState,
} from "./OrderFilterDrawer"
import {
  ORDER_STATUS_OPTIONS,
  type OrderItem,
  type OrderSearchTarget,
} from "../useHubs"

const orderColumnHelper = createColumnHelper<DataGridFeatures, OrderItem>()

interface OrderTableProps {
  data: OrderItem[]
  total: number
  selectedSearchBy: OrderSearchTarget[]
  selectedStatuses: string[]
  selectedPaymentStatuses: string[]
  selectedPaymentMethods: string[]
  onFilterApply: (filters: OrderFilterState) => void
  onFilterReset: () => void
  onStatusChange: (id: string, status: string) => void
  isUpdatingStatus?: boolean
  onEdit: (order: OrderItem) => void
  onDelete: (order: OrderItem) => void
}

export function OrderTable({
  data,
  total,
  selectedSearchBy,
  selectedStatuses,
  selectedPaymentStatuses,
  selectedPaymentMethods,
  onFilterApply,
  onFilterReset,
  onStatusChange,
  isUpdatingStatus = false,
  onEdit,
  onDelete,
}: OrderTableProps) {
  const columns = useMemo(
    () => [
      orderColumnHelper.accessor("id", {
        header: "Order ID",
        cell: (info) => (
          <span className="font-mono text-xs font-medium text-foreground">
            {info.getValue().slice(0, 12)}...
          </span>
        ),
      }),
      orderColumnHelper.accessor((row) => row.user?.email ?? "", {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => {
          const user = row.original.user
          const name = [user?.firstName, user?.lastName]
            .filter(Boolean)
            .join(" ")
            .trim()
          return (
            <span className="truncate font-medium text-foreground">
              {name || "—"}
            </span>
          )
        },
      }),
      orderColumnHelper.accessor((row) => row._count?.items ?? 0, {
        id: "itemsCount",
        header: "Items",
        cell: (info) => (
          <span className="text-xs text-muted-foreground tabular-nums">
            {info.getValue()} items
          </span>
        ),
      }),
      orderColumnHelper.accessor("totalAmount", {
        header: "Total",
        cell: (info) => (
          <span className="font-medium tabular-nums">
            ฿{Number(info.getValue() ?? 0).toLocaleString()}
          </span>
        ),
      }),
      orderColumnHelper.accessor("paymentStatus", {
        header: "Payment",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="uppercase text-muted-foreground">
              {row.original.paymentMethod || "cod"}
            </span>
            <span>·</span>
            <span className="capitalize font-medium">
              {row.original.paymentStatus || "pending"}
            </span>
          </div>
        ),
      }),
      orderColumnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => {
          const order = row.original
          const current = order.status || "pending"
          const statusOpt = ORDER_STATUS_OPTIONS.find((s) => s.id === current)
          return (
            <Select
              value={current}
              disabled={isUpdatingStatus}
              onValueChange={(val) => val && onStatusChange(order.id, val)}
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
                {ORDER_STATUS_OPTIONS.map((opt) => (
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
      orderColumnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => {
          const raw = info.getValue()
          const formatted = raw
            ? new Date(raw).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"
          return (
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatted}
            </span>
          )
        },
      }),
      orderColumnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const order = row.original
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
                    onClick={() => onEdit(order)}
                  >
                    <Eye className="mr-2 h-3.5 w-3.5" />
                    View / Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => onDelete(order)}
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
      searchPlaceholder="Search orders or customer..."
      manualPagination={true}
      manualFiltering={true}
      rowCount={total}
      actions={
        <OrderFilterDrawer
          currentFilters={{
            searchBy: selectedSearchBy,
            status: selectedStatuses,
            paymentStatus: selectedPaymentStatuses,
            paymentMethod: selectedPaymentMethods,
          }}
          onApply={onFilterApply}
          onReset={onFilterReset}
        />
      }
    />
  )
}
