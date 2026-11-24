import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/common/StatCard"

export interface DashboardKpis {
  revenue: number
  ordersCount: number
  newCustomers: number
  aov: number
}

interface DashboardStatsGridProps {
  kpis?: DashboardKpis
}

export function DashboardStatsGrid({ kpis }: DashboardStatsGridProps) {
  const revenue = kpis?.revenue ?? 0
  const ordersCount = kpis?.ordersCount ?? 0
  const newCustomers = kpis?.newCustomers ?? 0
  const aov = kpis?.aov ?? 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={`฿${revenue.toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4" />}
        description="Total sales in selected range"
      />
      <StatCard
        title="Total Orders"
        value={ordersCount.toLocaleString()}
        icon={<ShoppingBag className="h-4 w-4" />}
        description="Completed & active orders"
      />
      <StatCard
        title="New Customers"
        value={newCustomers.toLocaleString()}
        icon={<Users className="h-4 w-4" />}
        description="Registered in selected range"
      />
      <StatCard
        title="Avg. Order Value"
        value={`฿${aov.toLocaleString()}`}
        icon={<TrendingUp className="h-4 w-4" />}
        description="Average revenue per order"
      />
    </div>
  )
}

