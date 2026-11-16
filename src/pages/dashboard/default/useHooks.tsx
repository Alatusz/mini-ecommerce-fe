import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import { dashboardOverView } from "@/services/dashboard.services"
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
import type { DateRange } from "react-day-picker"

export type {
  MetricData,
  OrderItem,
  TopProduct,
  SalesDataPoint,
  CategoryDataPoint,
}

function formatYMD(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function useDashboardDefault() {
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date()
    const start = new Date()

    start.setDate(end.getDate() - 30)
    return {
      startDate: formatYMD(start),
      endDate: formatYMD(end),
    }
  })

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  const { data: dashboardOverview, isLoading } = useQuery({
    queryKey: [
      QUERY_KEYS.DASHBOARD.OVERVIEW,
      dateRange.startDate,
      dateRange.endDate,
      tz,
    ],
    queryFn: () =>
      dashboardOverView({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        tz,
      }),
  })

  const handleDateRangeChange = (range?: DateRange) => {
    if (!range?.from) return
    setDateRange({
      startDate: formatYMD(range.from),
      endDate: formatYMD(range.to ?? range.from),
    })
  }

  return {
    dashboardOverview,
    isLoading,
    dateRange,
    setDateRange,
    handleDateRangeChange,
    metrics: initialMetrics,
    orders: initialOrders,
    topProducts: initialTopProducts,
    areaChartData,
    pieChartData,
    areaChartConfig,
    pieChartConfig,
  }
}
