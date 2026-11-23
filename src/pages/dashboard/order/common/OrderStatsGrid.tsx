import { ShoppingBag, Clock, DollarSign, XCircle } from "lucide-react"
import { StatCard } from "@/components/common/StatCard"
import { type OrderStatusSummary } from "../useHubs"

interface OrderStatsGridProps {
  total?: number
  summaryByStatus?: OrderStatusSummary[]
}

export function OrderStatsGrid({
  summaryByStatus = [],
}: OrderStatsGridProps) {
  const getCount = (status: string) =>
    summaryByStatus.find((s) => s.status === status)?.count ?? 0

  const totalOrders = summaryByStatus.reduce((sum, s) => sum + s.count, 0)
  const pendingCount = getCount("pending")
  const paidCount = getCount("paid")
  const cancelledCount = getCount("cancelled")

  const totalRevenue = summaryByStatus
    .filter((s) => s.status !== "cancelled")
    .reduce((sum, s) => sum + (s.total ?? 0), 0)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Orders"
        value={totalOrders.toLocaleString()}
        icon={<ShoppingBag className="h-4 w-4" />}
        description="All orders in selected range"
      />
      <StatCard
        title="To Process"
        value={(pendingCount + paidCount).toLocaleString()}
        icon={<Clock className="h-4 w-4" />}
        description={`${pendingCount.toLocaleString()} pending · ${paidCount.toLocaleString()} paid`}
      />
      <StatCard
        title="Total Revenue"
        value={`฿${totalRevenue.toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4" />}
        description="Excluding cancelled orders"
      />
      <StatCard
        title="Cancelled"
        value={cancelledCount.toLocaleString()}
        icon={<XCircle className="h-4 w-4" />}
        description="Cancelled orders"
      />
    </div>
  )
}
