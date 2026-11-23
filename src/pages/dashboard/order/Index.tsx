/**
 * Orders Management — Unslop Redesign (dashboard-design skill)
 * Question: "Which orders are pending fulfillment and what is current GMV?"
 * - Wordless: compact numeric facts in header & KPI cards; zero prose sentences.
 * - Quiet & Salience: healthy statuses are calm; Pending (amber) & Cancelled (red) stand out.
 */
import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Pencil,
  Trash2,
  ShoppingBag,
  DollarSign,
  Clock,
  Truck,
  MoreHorizontal,
} from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import { useOrder, type OrderItem } from "./useHooks"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/common/StatCard"
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

const orderColumnHelper = createColumnHelper<DataGridFeatures, OrderItem>()

export default function DashboardOrderPage() {
  const {
    orders,
    deletingOrder,
    setDeletingOrder,
    handleDeleteOrder,
  } = useOrder()

  const completedCount = orders.filter((o) => o.status === "Completed").length
  const pendingCount = orders.filter((o) => o.status === "Pending").length
  const processingCount = orders.filter((o) => o.status === "Processing").length
  const shippedCount = orders.filter((o) => o.status === "Shipped").length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const avgOrder =
    orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        )
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-zinc-400" />
            Processing
          </span>
        )
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-[#3e63dd]" />
            Shipped
          </span>
        )
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        )
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:text-red-300">
            <span className="size-1.5 rounded-full bg-red-500" />
            Cancelled
          </span>
        )
    }
  }

  const columns = useMemo(
    () => [
      orderColumnHelper.accessor("orderNumber", {
        header: "Order",
        cell: (info) => (
          <span className="font-mono text-xs font-medium tabular-nums text-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      orderColumnHelper.accessor((row) => row.customer.name, {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
              {row.original.customer.avatar}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium text-foreground">
                {row.original.customer.name}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                {row.original.customer.email}
              </span>
            </div>
          </div>
        ),
      }),
      orderColumnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      orderColumnHelper.accessor("itemsCount", {
        header: "Items",
        cell: (info) => (
          <span className="text-xs font-medium tabular-nums text-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      orderColumnHelper.accessor("total", {
        header: "Total",
        cell: (info) => (
          <span className="text-xs font-semibold tabular-nums text-foreground">
            ${info.getValue().toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        ),
      }),
      orderColumnHelper.accessor("paymentMethod", {
        header: "Payment",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      orderColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => getStatusBadge(info.getValue()),
      }),
      orderColumnHelper.display({
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
                <Link to={`/dashboard/order/edit/${row.original.id}`}>
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <Pencil className="size-3.5 text-muted-foreground" />
                    <span>Edit Order</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeletingOrder(row.original)}
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
    [setDeletingOrder]
  )

  return (
    <PageContent>
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Orders
          </h1>
        </div>
      </div>

      {/* ── 4 KPI Cards (Monochrome Icons + Tabular Numbers) ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={<ShoppingBag className="size-3.5" />}
          description={`${completedCount} completed`}
        />

        <StatCard
          title="Gross Volume"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="size-3.5" />}
          description={`$${avgOrder.toLocaleString()} avg order`}
        />

        <StatCard
          title="Pending Action"
          value={pendingCount}
          icon={<Clock className="size-3.5" />}
          valueClassName={
            pendingCount > 0
              ? "text-amber-600 dark:text-amber-400"
              : "text-foreground"
          }
          description="awaiting confirmation"
        />

        <StatCard
          title="In Fulfillment"
          value={processingCount + shippedCount}
          icon={<Truck className="size-3.5" />}
          description={`${processingCount} processing · ${shippedCount} shipped`}
        />
      </div>

      {/* ── TanStack DataGrid ── */}
      <DataGrid
        data={orders}
        columns={columns}
        urlSync={true}
        defaultPageSize={10}
        searchPlaceholder="Search orders or customer..."
      />

      {/* ── Dialog: Delete Order Confirmation ── */}
      <Dialog
        open={!!deletingOrder}
        onOpenChange={(open) => !open && setDeletingOrder(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Remove{" "}
              <strong className="font-mono text-foreground">
                {deletingOrder?.orderNumber}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
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
