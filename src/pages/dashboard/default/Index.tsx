/**
 * Dashboard Overview — Unslop Redesign (dashboard-design skill)
 * Question: "Is store revenue growing, and what orders/categories drive it?"
 * - Wordless: zero prose sentences; compact numeric facts only.
 * - Quiet: monochrome KPI icons, #3e63dd entity accent, warm amber only on Pending orders.
 * - Encoding ladder: Ranked category breakdown with 3px share bars replaces pie chart.
 */
import { Link } from "react-router-dom"
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Download,
  ArrowUpRight,
  ArrowRight,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { useDashboardDefault, type OrderItem } from "./useHooks"
import { StatCard } from "@/components/common/StatCard"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageContent } from "@/components/common/PageContent"
import { DateRangeFilter } from "@/components/common/DateRangeFilter"

export default function DashboardPage() {
  const {
    metrics,
    orders,
    topProducts,
    areaChartData,
    pieChartData,
    areaChartConfig,
  } = useDashboardDefault()

  const maxProductSales = Math.max(...topProducts.map((p) => p.salesCount), 1)

  const getMetricIcon = (index: number) => {
    switch (index) {
      case 0:
        return <DollarSign className="size-3.5 text-muted-foreground" />
      case 1:
        return <ShoppingBag className="size-3.5 text-muted-foreground" />
      case 2:
        return <Users className="size-3.5 text-muted-foreground" />
      default:
        return <TrendingUp className="size-3.5 text-muted-foreground" />
    }
  }

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

  return (
    <PageContent>
      {/* ── Header & Toolbar ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <DateRangeFilter />

          <Button
            variant="outline"
            size="sm"
            className="h-8 cursor-pointer gap-1.5 rounded-full border-border/60 bg-card px-3 text-xs"
          >
            <Download className="size-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* ── 1. KPI Cards Row (Calm monochrome icon squares + tabular numbers + 1-word baseline) ── */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <StatCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            icon={getMetricIcon(idx)}
            description={
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="mr-0.5 size-3" />
                  {metric.change}
                </span>
                <span className="text-muted-foreground">
                  {metric.description}
                </span>
              </div>
            }
          />
        ))}
      </div>

      {/* ── 2. Revenue Trend & Ranked Category Breakdown (7:3 ratio) ── */}
      <div className="grid grid-cols-10 gap-5">
        {/* Area Chart: 7 Columns */}
        <Card className="col-span-7 flex h-full flex-col border-border/60 bg-card shadow-2xs">
          <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b border-border/40 px-5 py-3.5">
            <div className="flex items-baseline gap-2.5">
              <CardTitle className="text-sm font-semibold">
                Revenue & Orders
              </CardTitle>
              <span className="text-xs tabular-nums text-muted-foreground">
                Jan – Oct · $346.3k YTD
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#3e63dd]" />
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-3 border-t-2 border-dashed border-slate-400" />
                <span>Orders</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col justify-center p-5 pt-4">
            <ChartContainer
              config={areaChartConfig}
              className="aspect-auto h-[270px] w-full"
            >
              <AreaChart
                data={areaChartData}
                margin={{ left: 4, right: 8, top: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.22}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs tabular-nums"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  className="text-xs tabular-nums"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="orders"
                  type="monotone"
                  fill="none"
                  stroke="var(--color-orders)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="url(#fillRevenue)"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Ranked Category Breakdown with 3px Share Bars: 3 Columns */}
        <Card className="col-span-3 flex h-full flex-col border-border/60 bg-card shadow-2xs">
          <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b border-border/40 px-5 py-3.5">
            <CardTitle className="text-sm font-semibold">
              By Category
            </CardTitle>
            <span className="text-xs tabular-nums text-muted-foreground">
              $48.3k total
            </span>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col justify-between p-5">
            <div className="flex flex-col gap-4">
              {pieChartData.map((item, idx) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {item.category}
                    </span>
                    <div className="flex items-baseline gap-2 tabular-nums">
                      <span className="font-semibold text-foreground">
                        ${(item.sales / 1000).toFixed(1)}k
                      </span>
                      <span className="w-8 text-right text-[11px] text-muted-foreground">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Slim 3px rounded share bar */}
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: idx === 0 ? "#3e63dd" : "#94a3b8",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs tabular-nums text-muted-foreground">
              <span>Top share</span>
              <span className="font-medium text-foreground">
                Smartphones · 45%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Recent Orders & Top Products (8:4 ratio) ── */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column: Recent Orders (8 cols) */}
        <Card className="col-span-8 flex h-full flex-col border-border/60 bg-card shadow-2xs">
          <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b border-border/40 px-5 py-3.5">
            <div className="flex items-baseline gap-2.5">
              <CardTitle className="text-sm font-semibold">
                Recent Orders
              </CardTitle>
              <span className="text-xs tabular-nums text-muted-foreground">
                {orders.length} latest · $8,292 total
              </span>
            </div>
            <Link
              to="/dashboard/order"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <span>All orders</span>
              <ArrowRight className="size-3" />
            </Link>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-9 pl-5 text-xs">Order</TableHead>
                  <TableHead className="h-9 text-xs">Customer</TableHead>
                  <TableHead className="h-9 text-xs">Date</TableHead>
                  <TableHead className="h-9 text-right text-xs">Items</TableHead>
                  <TableHead className="h-9 text-right text-xs">Total</TableHead>
                  <TableHead className="h-9 text-xs">Status</TableHead>
                  <TableHead className="h-9 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((ord) => (
                  <TableRow key={ord.id} className="h-12">
                    <TableCell className="pl-5 font-mono text-xs font-medium tabular-nums">
                      {ord.orderNumber}
                    </TableCell>

                    <TableCell>
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                          {ord.customer.avatar}
                        </div>
                        <span className="truncate text-xs font-medium text-foreground">
                          {ord.customer.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs tabular-nums text-muted-foreground">
                      {ord.date}
                    </TableCell>

                    <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                      {ord.itemsCount}
                    </TableCell>

                    <TableCell className="text-right text-xs font-semibold tabular-nums text-foreground">
                      ${ord.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </TableCell>

                    <TableCell>{getStatusBadge(ord.status)}</TableCell>

                    <TableCell>
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
                          <Link to={`/dashboard/order/edit/${ord.id}`}>
                            <DropdownMenuItem className="cursor-pointer gap-2">
                              <Eye className="size-3.5 text-muted-foreground" />
                              <span>Inspect Order</span>
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column: Top Selling Products (4 cols) */}
        <Card className="col-span-4 flex h-full flex-col border-border/60 bg-card shadow-2xs">
          <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b border-border/40 px-5 py-3.5">
            <CardTitle className="text-sm font-semibold">
              Top Products
            </CardTitle>
            <span className="text-xs tabular-nums text-muted-foreground">
              By units sold
            </span>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col justify-between p-5">
            <div className="flex flex-col gap-4">
              {topProducts.map((prod, idx) => {
                const share = Math.round((prod.salesCount / maxProductSales) * 100)
                const revenue = prod.price * prod.salesCount
                return (
                  <div key={prod.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/50 p-1">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-xs font-medium text-foreground">
                            {prod.name}
                          </span>
                          <span className="text-[11px] tabular-nums text-muted-foreground">
                            {prod.category} · ${prod.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right tabular-nums">
                        <div className="text-xs font-semibold text-foreground">
                          ${(revenue / 1000).toFixed(1)}k
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {prod.salesCount} sold
                        </div>
                      </div>
                    </div>

                    {/* Slim 3px rounded share bar */}
                    <div className="h-[3px] w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${share}%`,
                          backgroundColor: idx === 0 ? "#3e63dd" : "#94a3b8",
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs">
              <span className="text-muted-foreground">Top 3 volume</span>
              <span className="font-medium tabular-nums text-foreground">
                327 units · $287.2k
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
