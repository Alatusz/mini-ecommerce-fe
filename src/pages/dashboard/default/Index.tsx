import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Download,
  ArrowUpRight,
  Package,
  Eye,
  CheckCircle2,
  Clock,
} from "lucide-react"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { useDashboardDefault, type OrderItem } from "./useHooks"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
    pieChartConfig,
  } = useDashboardDefault()

  const getMetricIcon = (index: number) => {
    switch (index) {
      case 0:
        return <DollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />
      case 1:
        return <ShoppingBag className="size-4 text-blue-600 dark:text-blue-400" />
      case 2:
        return <Users className="size-4 text-purple-600 dark:text-purple-400" />
      default:
        return <TrendingUp className="size-4 text-amber-600 dark:text-amber-400" />
    }
  }

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-50 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="mr-1 size-3" />
            Completed
          </Badge>
        )
      case "Processing":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-50 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          >
            <Clock className="mr-1 size-3" />
            Processing
          </Badge>
        )
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-50 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          >
            <Clock className="mr-1 size-3" />
            Pending
          </Badge>
        )
      case "Cancelled":
        return (
          <Badge
            variant="outline"
            className="border-red-500/30 bg-red-50 text-[11px] font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            Cancelled
          </Badge>
        )
    }
  }

  return (
    <PageContent>
      {/* ── Header Row ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your store performance, transactions, and live inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Picker Filter */}
          <DateRangeFilter />

          {/* Action Button */}
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer gap-1.5"
          >
            <Download className="size-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* ── 1. 4 Stat Cards Row (Equal Height, Fixed 4 Columns) ── */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={metric.title} className="p-5 flex flex-col justify-between h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                {getMetricIcon(idx)}
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-3">
              <div className="text-2xl font-bold text-foreground">
                {metric.value}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs">
                <span className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="mr-0.5 size-3.5" />
                  {metric.change}
                </span>
                <span className="truncate text-muted-foreground">
                  {metric.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── 2. Area Chart & Pie Chart Grid (7:3 ratio, Equal Height) ── */}
      <div className="grid grid-cols-10 gap-6">
        {/* Area Chart: 7 Columns */}
        <Card className="col-span-7 flex flex-col h-full">
          <CardHeader className="border-b border-border/40 p-5 flex flex-row items-center justify-between shrink-0">
            <div>
              <CardTitle className="text-base font-bold">
                Revenue & Orders Growth
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Monthly overview of incoming sales revenue vs order volume.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                <span>Orders</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-6 flex-1 flex flex-col justify-center">
            <ChartContainer
              config={areaChartConfig}
              className="aspect-auto h-[310px] w-full"
            >
              <AreaChart
                data={areaChartData}
                margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-orders)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-orders)"
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
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="orders"
                  type="natural"
                  fill="url(#fillOrders)"
                  stroke="var(--color-orders)"
                  strokeWidth={2}
                  stackId="orders"
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="url(#fillRevenue)"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  stackId="revenue"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart: 3 Columns */}
        <Card className="col-span-3 flex flex-col h-full">
          <CardHeader className="border-b border-border/40 p-5 shrink-0">
            <CardTitle className="text-base font-bold">
              Sales by Category
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Revenue breakdown by department.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center">
              <ChartContainer
                config={pieChartConfig}
                className="mx-auto aspect-square h-[175px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={pieChartData}
                    dataKey="sales"
                    nameKey="category"
                    innerRadius={45}
                    outerRadius={70}
                    strokeWidth={3}
                    className="stroke-card"
                  >
                    {pieChartData.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            {/* Legend Breakdown */}
            <div className="w-full mt-auto flex flex-col gap-2 pt-3 border-t border-border/40">
              {pieChartData.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      ${(item.sales / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Recent Orders & Top Selling Products (8:4 ratio, Equal Height) ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Recent Orders (8 cols) */}
        <Card className="col-span-8 flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 p-5 shrink-0">
            <div>
              <CardTitle className="text-base font-bold">
                Recent Orders
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Review customer orders and transaction statuses.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 flex flex-col">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-5 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((ord) => (
                  <TableRow key={ord.id} className="h-[60px]">
                    <TableCell className="pl-5 font-mono text-xs font-medium">
                      {ord.orderNumber}
                    </TableCell>

                    <TableCell>
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                          {ord.customer.avatar}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-xs font-semibold text-foreground">
                            {ord.customer.name}
                          </span>
                          <span className="truncate text-[10px] text-muted-foreground">
                            {ord.customer.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {ord.date}
                    </TableCell>

                    <TableCell className="text-xs font-semibold">
                      ${ord.total.toFixed(2)}
                    </TableCell>

                    <TableCell>{getStatusBadge(ord.status)}</TableCell>

                    <TableCell className="pr-5 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer text-muted-foreground hover:text-foreground"
                        title="View details"
                      >
                        <Eye className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column: Top Products (4 cols) */}
        <Card className="col-span-4 flex flex-col h-full">
          <CardHeader className="border-b border-border/40 p-5 shrink-0">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Package className="size-4" />
              Top Selling Products
            </CardTitle>
            <CardDescription className="text-xs">
              Best performing hardware this month.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col justify-between flex-1 p-5 gap-3">
            {topProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-muted p-1">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-xs font-semibold text-foreground">
                      {prod.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {prod.category} • {prod.salesCount} sold
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xs font-bold text-foreground">
                    ${prod.price}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
