import { Ticket, CheckCircle2, Clock, Sparkles } from "lucide-react"
import { StatCard } from "@/components/common/StatCard"
import { type CouponStatusSummary } from "../useHubs"

interface CouponStatsGridProps {
  total: number
  summaryByStatus?: CouponStatusSummary[]
}

export function CouponStatsGrid({
  total,
  summaryByStatus = [],
}: CouponStatsGridProps) {
  const getCount = (status: string) =>
    summaryByStatus.find((s) => s.status === status)?.count ?? 0

  const totalRedemptions = summaryByStatus.reduce(
    (sum, s) => sum + (s.redemptions ?? 0),
    0
  )

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Coupons"
        value={total.toLocaleString()}
        icon={<Ticket className="h-4 w-4" />}
        description="All promo codes"
      />
      <StatCard
        title="Active"
        value={getCount("active").toLocaleString()}
        icon={<CheckCircle2 className="h-4 w-4" />}
        description="Currently redeemable"
      />
      <StatCard
        title="Scheduled"
        value={getCount("scheduled").toLocaleString()}
        icon={<Clock className="h-4 w-4" />}
        description="Upcoming campaigns"
      />
      <StatCard
        title="Total Redemptions"
        value={totalRedemptions.toLocaleString()}
        icon={<Sparkles className="h-4 w-4" />}
        description="Times codes were used"
      />
    </div>
  )
}
