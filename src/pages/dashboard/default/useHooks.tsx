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
  return {
    metrics: initialMetrics,
    orders: initialOrders,
    topProducts: initialTopProducts,
    areaChartData,
    pieChartData,
    areaChartConfig,
    pieChartConfig,
  }
}
