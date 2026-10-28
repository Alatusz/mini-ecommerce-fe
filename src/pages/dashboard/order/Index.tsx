import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Truck,
} from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import { useOrder, type OrderItem } from "./useHooks"
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

const orderColumnHelper = createColumnHelper<DataGridFeatures, OrderItem>()

export default function DashboardOrderPage() {
  const {
    orders,
    deletingOrder,
    setDeletingOrder,
    handleDeleteOrder,
  } = useOrder()

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-50 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="mr-1 size-3" />
            Completed
          </Badge>
        )
      case "Processing":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-50 text-[10px] font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          >
            <Clock className="mr-1 size-3" />
            Processing
          </Badge>
        )
      case "Shipped":
        return (
          <Badge
            variant="outline"
            className="border-purple-500/30 bg-purple-50 text-[10px] font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
          >
            <Truck className="mr-1 size-3" />
            Shipped
          </Badge>
        )
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-50 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          >
            <AlertCircle className="mr-1 size-3" />
            Pending
          </Badge>
        )
      case "Cancelled":
        return (
          <Badge
            variant="outline"
            className="border-red-500/30 bg-red-50 text-[10px] font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            <XCircle className="mr-1 size-3" />
            Cancelled
          </Badge>
        )
    }
  }

  // TanStack columns
  const columns = useMemo(
    () => [
      orderColumnHelper.accessor("orderNumber", {
        header: "Order ID",
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      orderColumnHelper.accessor((row) => row.customer.name, {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-[11px] text-foreground">
              {row.original.customer.avatar}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-foreground truncate">
                {row.original.customer.name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {row.original.customer.email}
              </span>
            </div>
          </div>
        ),
      }),
      orderColumnHelper.accessor("date", {
        header: "Date Placed",
        cell: (info) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      }),
      orderColumnHelper.accessor("itemsCount", {
        header: "Items",
        cell: (info) => (
          <span className="text-xs text-foreground font-medium">
            {info.getValue()} items
          </span>
        ),
      }),
      orderColumnHelper.accessor("total", {
        header: "Total",
        cell: (info) => (
          <span className="text-xs sm:text-sm font-bold text-foreground">
            ${info.getValue().toFixed(2)}
          </span>
        ),
      }),
      orderColumnHelper.accessor("paymentMethod", {
        header: "Payment",
        cell: (info) => (
          <Badge variant="secondary" className="text-[11px] font-normal">
            {info.getValue()}
          </Badge>
        ),
      }),
      orderColumnHelper.accessor("status", {
        header: "Order Status",
        cell: (info) => getStatusBadge(info.getValue()),
      }),
      orderColumnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Link to={`/dashboard/order/edit/${row.original.id}`}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                title="Edit order"
              >
                <Pencil className="size-3.5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDeletingOrder(row.original)}
              className="cursor-pointer text-muted-foreground hover:text-destructive"
              title="Delete order"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [setDeletingOrder]
  )

  return (
    <PageContent>
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Orders Management
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Track transactions, monitor fulfillment status, and supervise payment processing.
        </p>
      </div>

      {/* ── TanStack DataGrid ── */}
      <DataGrid
        data={orders}
        columns={columns}
        urlSync={true}
        defaultPageSize={10}
        searchPlaceholder="Filter order rows..."
      />

      {/* ── Dialog: Delete Order Confirmation ── */}
      <Dialog
        open={!!deletingOrder}
        onOpenChange={(open) => !open && setDeletingOrder(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Order Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <strong className="text-foreground">
                {deletingOrder?.orderNumber}
              </strong>{" "}
              from the system?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingOrder(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                if (deletingOrder) {
                  handleDeleteOrder(deletingOrder.id)
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
