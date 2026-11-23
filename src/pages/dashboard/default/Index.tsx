import { PageContent } from "@/components/common/PageContent"
import { DateRangeFilter } from "./common/DateRangeFilter"
import { DashboardStatsGrid } from "./common/DashboardStatsGrid"
import { SalesAreaChart } from "./common/SalesAreaChart"
import { CategoryRankedBar } from "./common/CategoryRankedBar"
import { RecentOrdersCard } from "./common/RecentOrdersCard"
import { TopProductsCard } from "./common/TopProductsCard"
import { useDashboardDefault } from "./useHooks"
import type { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const { dashboardOverview, handleDateRangeChange } = useDashboardDefault()


  return (
    <PageContent>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your store performance.
          </p>
        </div>
        <DateRangeFilter onChange={handleDateRangeChange} />
      </div>

      <DashboardStatsGrid kpis={dashboardOverview?.data?.kpis} />

      <div className="grid grid-cols-12 gap-4">
        <SalesAreaChart
          data={dashboardOverview?.data?.salesTrend}
          config={chartConfig}
        />
        <CategoryRankedBar data={dashboardOverview?.data?.salesByCategory} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <RecentOrdersCard data={dashboardOverview?.data?.recentOrders} />
        <TopProductsCard data={dashboardOverview?.data?.topProducts} />
      </div>
    </PageContent>
  )
}
