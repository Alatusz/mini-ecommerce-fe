import { useState, useMemo } from "react"
import {
  initialMetrics,
  initialOrders,
  initialTopProducts,
  areaChartData,
  pieChartData,
  areaChartConfig,
  pieChartConfig,
  type MetricData,
  type OrderItem,
  type TopProduct,
  type SalesDataPoint,
  type CategoryDataPoint,
} from "./common/mockDashboard"

export type {
  MetricData,
  OrderItem,
  TopProduct,
  SalesDataPoint,
  CategoryDataPoint,
}

export function useDashboardDefault() {
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month" | "year">("month")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ||
        order.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [statusFilter, searchQuery])

  const handleExport = () => {
    alert("Exporting dashboard report as CSV...")
  }

  return {
    timeframe,
    setTimeframe,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    metrics: initialMetrics,
    orders: filteredOrders,
    topProducts: initialTopProducts,
    areaChartData,
    pieChartData,
    areaChartConfig,
    pieChartConfig,
    handleExport,
  }
}
