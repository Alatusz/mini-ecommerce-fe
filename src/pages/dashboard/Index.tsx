import React from "react"
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
  Tags,
  Star,
  TicketPercent,
  Plus,
  Truck,
  Pencil,
  Trash2,
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

import { useDashboard, type OrderItem } from "./useHooks"
import { DashboardSidebar } from "./components/DashboardSidebar"
import { DashboardNavbar } from "./components/DashboardNavbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
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
import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"

const orderColumnHelper = createColumnHelper<DataGridFeatures, OrderItem>()

function DashboardPage() {
  const {
    timeframe,
    setTimeframe,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    activeMenu,
    setActiveMenu,
    metrics,
    orders,
    topProducts,
    categories,
    coupons,
    reviews,
    areaChartData,
    pieChartData,
    areaChartConfig,
    pieChartConfig,
    handleExport,
  } = useDashboard()

  const getMetricIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <DollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />
        )
      case 1:
        return (
          <ShoppingBag className="size-4 text-blue-600 dark:text-blue-400" />
        )
      case 2:
        return <Users className="size-4 text-purple-600 dark:text-purple-400" />
      default:
        return (
          <TrendingUp className="size-4 text-amber-600 dark:text-amber-400" />
        )
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

  const orderColumns = React.useMemo(
    () => [
      orderColumnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="size-4 rounded accent-black dark:accent-white cursor-pointer"
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="size-4 rounded accent-black dark:accent-white cursor-pointer"
            aria-label={`Select row ${row.original.orderNumber}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      orderColumnHelper.accessor("orderNumber", {
        header: "Order ID",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      orderColumnHelper.accessor((row) => row.customer.name, {
        id: "customer",
        header: "Customer",
        cell: (info) => {
          const customer = info.row.original.customer
          return (
            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                {customer.avatar}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {customer.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {customer.email}
                </span>
              </div>
            </div>
          )
        },
      }),
      orderColumnHelper.accessor("itemsCount", {
        header: "Items",
        cell: (info) => `${info.getValue()} items`,
      }),
      orderColumnHelper.accessor("paymentMethod", {
        header: "Payment",
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      orderColumnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      orderColumnHelper.accessor("total", {
        header: "Total",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            ${info.getValue().toFixed(2)}
          </span>
        ),
      }),
      orderColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => getStatusBadge(info.getValue()),
      }),
      orderColumnHelper.display({
        id: "action",
        header: "Action",
        cell: () => (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs cursor-pointer"
          >
            Manage
          </Button>
        ),
        enableSorting: false,
      }),
    ],
    []
  )

  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <SidebarInset>
        {/* ── Top Dashboard Navbar ── */}
        <DashboardNavbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeMenu={activeMenu}
        />

        {/* ── Main Content Area ── */}
        <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          {/* ══════════════════════════════════════════════════════════
              VIEW 1: DASHBOARD OVERVIEW
          ══════════════════════════════════════════════════════════ */}
          {activeMenu === "dashboard" && (
            <>
              {/* Header Row */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Dashboard Overview
                  </h1>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    Monitor your store performance, transactions, and live inventory.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Timeframe Filter Buttons */}
                  <div className="flex items-center rounded-lg border border-border/60 bg-muted/30 p-1">
                    {(["today", "week", "month", "year"] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setTimeframe(period)}
                        className={`cursor-pointer rounded-md px-3 py-1 text-xs font-semibold capitalize transition-all ${
                          timeframe === period
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="cursor-pointer gap-1.5"
                  >
                    <Download className="size-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>

              {/* ── 1. 4 Stat Cards Row ── */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, idx) => (
                  <Card key={metric.title} className="p-4 sm:p-5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        {metric.title}
                      </CardTitle>
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        {getMetricIcon(idx)}
                      </div>
                    </CardHeader>

                    <CardContent className="p-0 pt-3">
                      <div className="text-xl font-bold text-foreground sm:text-2xl">
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

              {/* ── 2. Area Chart & Pie Chart Grid (7:3 ratio) ── */}
              <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-10">
                {/* Area Chart: 7 Columns */}
                <Card className="lg:col-span-7">
                  <CardHeader className="border-b border-border/40 p-4 sm:p-6">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <CardTitle className="text-base font-bold sm:text-lg">
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
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6 pt-6">
                    <ChartContainer
                      config={areaChartConfig}
                      className="aspect-auto h-[300px] w-full"
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
                <Card className="lg:col-span-3 flex flex-col justify-between">
                  <CardHeader className="border-b border-border/40 p-4 sm:p-6">
                    <CardTitle className="text-base font-bold sm:text-lg">
                      Sales by Category
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      Revenue breakdown by department.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center">
                    <ChartContainer
                      config={pieChartConfig}
                      className="mx-auto aspect-square max-h-[200px] w-full"
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
                          innerRadius={50}
                          outerRadius={75}
                          strokeWidth={3}
                          className="stroke-card"
                        >
                          {pieChartData.map((entry) => (
                            <Cell key={entry.category} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>

                    {/* Legend Breakdown */}
                    <div className="w-full mt-4 flex flex-col gap-2 pt-2 border-t border-border/40">
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

              {/* ── 3. Recent Orders & Top Selling Products ── */}
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* Left Column: Recent Orders (8 cols) */}
                <div className="flex flex-col gap-4 lg:col-span-8">
                  <Card>
                    <CardHeader className="flex flex-col justify-between gap-3 border-b border-border/40 p-4 sm:flex-row sm:items-center sm:p-6">
                      <div>
                        <CardTitle className="text-base font-bold sm:text-lg">
                          Recent Orders
                        </CardTitle>
                        <CardDescription className="mt-0.5 text-xs">
                          Review customer orders and transaction statuses.
                        </CardDescription>
                      </div>

                      {/* Status Filter */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {["all", "completed", "processing", "pending"].map(
                          (status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setStatusFilter(status)}
                              className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors ${
                                statusFilter === status
                                  ? "bg-black text-white dark:bg-white dark:text-black"
                                  : "bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {status}
                            </button>
                          )
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      {orders.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="pl-4 sm:pl-6">Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead className="hidden md:table-cell">Date</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="pr-4 text-right sm:pr-6">
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((ord) => (
                              <TableRow key={ord.id}>
                                <TableCell className="pl-4 font-mono text-xs font-medium sm:pl-6">
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

                                <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                                  {ord.date}
                                </TableCell>

                                <TableCell className="text-xs font-semibold sm:text-sm">
                                  ${ord.total.toFixed(2)}
                                </TableCell>

                                <TableCell>{getStatusBadge(ord.status)}</TableCell>

                                <TableCell className="pr-4 text-right sm:pr-6">
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
                      ) : (
                        <div className="p-8 text-center text-xs text-muted-foreground">
                          No orders match the selected filter.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Top Products (4 cols) */}
                <div className="flex flex-col gap-6 lg:col-span-4">
                  <Card>
                    <CardHeader className="border-b border-border/40 p-4 sm:p-5">
                      <CardTitle className="flex items-center gap-2 text-base font-bold">
                        <Package className="size-4" />
                        Top Selling Products
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Best performing hardware this month.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
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
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════
              VIEW 2: ORDERS MANAGEMENT (TanStack Table V9 Headless Data Grid)
          ══════════════════════════════════════════════════════════ */}
          {activeMenu === "orders" && (
            <DataGrid
              title="Orders Management"
              description="Manage customer orders, track payments, and review fulfillment statuses with TanStack Table V9."
              data={orders}
              columns={orderColumns}
              urlSync={true}
              defaultPageSize={10}
              searchPlaceholder="Filter orders by ID, customer name, payment..."
            />
          )}

          {/* ══════════════════════════════════════════════════════════
              VIEW 3: PRODUCTS CATALOG
          ══════════════════════════════════════════════════════════ */}
          {activeMenu === "products" && (
            <Card>
              <CardHeader className="flex flex-col justify-between gap-4 border-b border-border/40 p-4 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <CardTitle className="text-xl font-bold">Products Catalog</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Manage store catalog items, pricing, and live inventory.
                  </CardDescription>
                </div>
                <Button className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer">
                  <Plus className="size-4" />
                  <span>Add Product</span>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((prod) => (
                      <TableRow key={prod.id}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-muted p-1 border border-border/40 flex items-center justify-center shrink-0">
                              <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <span className="font-semibold text-xs sm:text-sm">{prod.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{prod.sku}</TableCell>
                        <TableCell className="text-xs">{prod.category}</TableCell>
                        <TableCell className="text-xs font-semibold sm:text-sm">${prod.price}</TableCell>
                        <TableCell className="text-xs">{prod.salesCount} sold</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-50 text-emerald-700 text-[10px] dark:bg-emerald-950/40 dark:text-emerald-300">
                            In Stock
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon-sm" className="cursor-pointer text-muted-foreground hover:text-foreground">
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="cursor-pointer text-muted-foreground hover:text-destructive">
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* ══════════════════════════════════════════════════════════
              VIEW 4: CATEGORIES
          ══════════════════════════════════════════════════════════ */}
          {activeMenu === "categories" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Product Categories</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Organize your store catalog into browseable collections.
                  </p>
                </div>
                <Button className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer">
                  <Plus className="size-4" />
                  <span>Add Category</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <Card key={cat.id} className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                            <Tags className="size-4 text-foreground" />
                          </div>
                          <span className="font-bold text-sm sm:text-base">{cat.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs font-normal">
                          {cat.itemCount} items
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40 text-xs">
                      <span className="font-mono text-[11px] text-muted-foreground">/{cat.slug}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-sm" className="cursor-pointer text-muted-foreground hover:text-foreground">
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="cursor-pointer text-muted-foreground hover:text-destructive">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              VIEW 5: COUPONS & DISCOUNTS
          ══════════════════════════════════════════════════════════ */}
          {activeMenu === "coupons" && (
            <Card>
              <CardHeader className="flex flex-col justify-between gap-4 border-b border-border/40 p-4 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <CardTitle className="text-xl font-bold">Coupons & Promo Codes</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Create promotional discount vouchers and seasonal incentives.
                  </CardDescription>
                </div>
                <Button className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer">
                  <Plus className="size-4" />
                  <span>Create Coupon</span>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Coupon Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Min Spend</TableHead>
                      <TableHead>Used Count</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-2">
                            <TicketPercent className="size-4 text-muted-foreground" />
                            <span className="font-mono font-bold text-xs bg-muted px-2 py-0.5 rounded">
                              {c.code}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {c.discount}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">${c.minSpend}</TableCell>
                        <TableCell className="text-xs">{c.usageCount} times</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.expiryDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              c.status === "Active"
                                ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "border-zinc-400/30 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                            }`}
                          >
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="ghost" size="icon-sm" className="cursor-pointer text-muted-foreground hover:text-foreground">
                            <Pencil className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* ══════════════════════════════════════════════════════════
              VIEW 6: REVIEWS & RATINGS
          ══════════════════════════════════════════════════════════ */}
          {activeMenu === "reviews" && (
            <Card>
              <CardHeader className="border-b border-border/40 p-4 sm:p-6">
                <CardTitle className="text-xl font-bold">Customer Reviews</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Moderate customer feedback and product star ratings.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((rev) => (
                      <TableRow key={rev.id}>
                        <TableCell className="pl-6 font-semibold text-xs">{rev.customer}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{rev.product}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-amber-500">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="size-3 fill-amber-500" />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs max-w-xs truncate">{rev.comment}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{rev.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              rev.status === "Approved"
                                ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            }`}
                          >
                            {rev.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="outline" size="sm" className="h-7 text-xs cursor-pointer">
                            Moderate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* ══════════════════════════════════════════════════════════
              VIEW 7: SHIPPING RATES
          ══════════════════════════════════════════════════════════ */}
          {activeMenu === "shipping" && (
            <Card>
              <CardHeader className="flex flex-col justify-between gap-4 border-b border-border/40 p-4 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <CardTitle className="text-xl font-bold">Shipping Rates & Logistics</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Configure delivery tiers, shipping fees, and fulfillment partners.
                  </CardDescription>
                </div>
                <Button className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer">
                  <Plus className="size-4" />
                  <span>Add Shipping Tier</span>
                </Button>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="size-4" />
                      <span className="font-bold text-sm">Standard Delivery</span>
                    </div>
                    <p className="text-xs text-muted-foreground">5-7 business days</p>
                    <div className="text-xl font-bold mt-3">Free</div>
                    <Badge variant="outline" className="mt-3 text-[10px] border-emerald-500/30 text-emerald-700">Active</Badge>
                  </Card>

                  <Card className="p-4 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="size-4" />
                      <span className="font-bold text-sm">Regular Delivery</span>
                    </div>
                    <p className="text-xs text-muted-foreground">3-5 business days</p>
                    <div className="text-xl font-bold mt-3">$8.50</div>
                    <Badge variant="outline" className="mt-3 text-[10px] border-emerald-500/30 text-emerald-700">Active</Badge>
                  </Card>

                  <Card className="p-4 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="size-4" />
                      <span className="font-bold text-sm">Express Priority</span>
                    </div>
                    <p className="text-xs text-muted-foreground">1-2 business days (Priority)</p>
                    <div className="text-xl font-bold mt-3">$29.00</div>
                    <Badge variant="outline" className="mt-3 text-[10px] border-emerald-500/30 text-emerald-700">Active</Badge>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ══════════════════════════════════════════════════════════
              VIEW 8: DEFAULT FALLBACK FOR OTHER MENUS (Customers, Settings, etc.)
          ══════════════════════════════════════════════════════════ */}
          {!["dashboard", "orders", "products", "categories", "coupons", "reviews", "shipping"].includes(activeMenu) && (
            <Card className="p-8 sm:p-12 text-center">
              <div className="mx-auto size-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Package className="size-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold capitalize">{activeMenu} Management</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Manage your store configuration, inventory sync, and system preferences.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveMenu("dashboard")}
                className="mt-5 cursor-pointer"
              >
                Back to Dashboard Overview
              </Button>
            </Card>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardPage
