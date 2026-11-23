import { Users, ShieldCheck, UserCheck, ShoppingBag } from "lucide-react"
import { StatCard } from "@/components/common/StatCard"

interface UserStatsGridProps {
  total: number
  staffCount: number
  customerCount: number
  totalOrders: number
}

export function UserStatsGrid({
  total,
  staffCount,
  customerCount,
  totalOrders,
}: UserStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={total}
        icon={<Users className="h-4 w-4" />}
        description="Registered accounts"
      />
      <StatCard
        title="Admin & Staff"
        value={staffCount}
        icon={<ShieldCheck className="h-4 w-4" />}
        description="Privileged team members"
      />
      <StatCard
        title="Customers"
        value={customerCount}
        icon={<UserCheck className="h-4 w-4" />}
        description="Storefront shoppers"
      />
      <StatCard
        title="Total Orders"
        value={totalOrders}
        icon={<ShoppingBag className="h-4 w-4" />}
        description="Across listed users"
      />
    </div>
  )
}

