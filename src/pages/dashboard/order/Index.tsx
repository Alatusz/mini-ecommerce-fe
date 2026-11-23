import { PageContent } from "@/components/common/PageContent"
import { DateRangeFilter } from "@/pages/dashboard/default/common/DateRangeFilter"
import { useOrder } from "./useHooks"
import { OrderStatsGrid } from "./common/OrderStatsGrid"
import { OrderTable } from "./common/OrderTable"
import { OrderDeleteDialog } from "./common/OrderDeleteDialog"

export default function DashboardOrderPage() {
  const {
    ordersList,
    total,
    summaryByStatus,
    selectedSearchBy,
    selectedStatuses,
    selectedPaymentStatuses,
    selectedPaymentMethods,
    isUpdatingStatus,
    deletingOrder,
    setDeletingOrder,
    handleFilterApply,
    handleFilterReset,
    handleDateRangeChange,
    handleStatusChange,
    handleDeleteOrder,
  } = useOrder()

  return (
    <PageContent>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer orders, payment status, and fulfillment.
          </p>
        </div>
        <DateRangeFilter onChange={handleDateRangeChange} />
      </div>

      <OrderStatsGrid total={total} summaryByStatus={summaryByStatus} />

      <OrderTable
        data={ordersList}
        total={total}
        selectedSearchBy={selectedSearchBy}
        selectedStatuses={selectedStatuses}
        selectedPaymentStatuses={selectedPaymentStatuses}
        selectedPaymentMethods={selectedPaymentMethods}
        onFilterApply={handleFilterApply}
        onFilterReset={handleFilterReset}
        onStatusChange={handleStatusChange}
        isUpdatingStatus={isUpdatingStatus}
        onDelete={setDeletingOrder}
      />

      <OrderDeleteDialog
        order={deletingOrder}
        onClose={() => setDeletingOrder(null)}
        onConfirm={handleDeleteOrder}
      />
    </PageContent>
  )
}
