import type { ChartConfig } from "@/components/ui/chart"

export interface MetricData {
  title: string
  value: string
  change: string
  isPositive: boolean
  description: string
}

export interface OrderItem {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    avatar: string
  }
  itemsCount: number
  total: number
  status: "Completed" | "Processing" | "Pending" | "Cancelled"
  date: string
  paymentMethod: string
}

export interface TopProduct {
  id: string
  name: string
  sku: string
  category: string
  price: number
  salesCount: number
  image: string
}

export interface SalesDataPoint {
  month: string
  revenue: number
  orders: number
}

export interface CategoryDataPoint {
  category: string
  sales: number
  percentage: number
  color: string
}

export const areaChartData: SalesDataPoint[] = [
  { month: "Jan", revenue: 18500, orders: 420 },
  { month: "Feb", revenue: 22400, orders: 510 },
  { month: "Mar", revenue: 29800, orders: 680 },
  { month: "Apr", revenue: 26200, orders: 590 },
  { month: "May", revenue: 34500, orders: 810 },
  { month: "Jun", revenue: 41200, orders: 940 },
  { month: "Jul", revenue: 38900, orders: 890 },
  { month: "Aug", revenue: 44100, orders: 1050 },
  { month: "Sep", revenue: 42300, orders: 980 },
  { month: "Oct", revenue: 48290, orders: 1248 },
]

export const pieChartData: CategoryDataPoint[] = [
  { category: "Smartphones", sales: 21730, percentage: 45, color: "#18181b" },
  { category: "Audio", sales: 12070, percentage: 25, color: "#52525b" },
  { category: "Wearables", sales: 9650, percentage: 20, color: "#71717a" },
  { category: "Accessories", sales: 4840, percentage: 10, color: "#a1a1aa" },
]

export const areaChartConfig: ChartConfig = {
  revenue: {
    label: "Revenue ($)",
    theme: {
      light: "#18181b",
      dark: "#f4f4f5",
    },
  },
  orders: {
    label: "Orders",
    theme: {
      light: "#71717a",
      dark: "#a1a1aa",
    },
  },
}

export const pieChartConfig: ChartConfig = {
  sales: {
    label: "Sales ($)",
  },
  Smartphones: {
    label: "Smartphones",
    theme: {
      light: "#18181b",
      dark: "#f4f4f5",
    },
  },
  Audio: {
    label: "Audio",
    theme: {
      light: "#3f3f46",
      dark: "#d4d4d8",
    },
  },
  Wearables: {
    label: "Wearables",
    theme: {
      light: "#71717a",
      dark: "#a1a1aa",
    },
  },
  Accessories: {
    label: "Accessories",
    theme: {
      light: "#a1a1aa",
      dark: "#71717a",
    },
  },
}

export const initialMetrics: MetricData[] = [
  {
    title: "Total Revenue",
    value: "$48,290.50",
    change: "+12.5%",
    isPositive: true,
    description: "Compared to last month",
  },
  {
    title: "Total Orders",
    value: "1,248",
    change: "+8.2%",
    isPositive: true,
    description: "Compared to last week",
  },
  {
    title: "Active Customers",
    value: "3,842",
    change: "+18.4%",
    isPositive: true,
    description: "New accounts this month",
  },
  {
    title: "Conversion Rate",
    value: "3.42%",
    change: "+0.6%",
    isPositive: true,
    description: "Average across online visits",
  },
]

export const initialOrders: OrderItem[] = [
  {
    id: "ord-1",
    orderNumber: "#ORD-98214",
    customer: {
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      avatar: "SW",
    },
    itemsCount: 3,
    total: 2426.0,
    status: "Completed",
    date: "25 Oct 2026, 14:20",
    paymentMethod: "Credit Card",
  },
  {
    id: "ord-2",
    orderNumber: "#ORD-98213",
    customer: {
      name: "Michael Chen",
      email: "m.chen@example.com",
      avatar: "MC",
    },
    itemsCount: 1,
    total: 1399.0,
    status: "Processing",
    date: "25 Oct 2026, 13:45",
    paymentMethod: "PayPal",
  },
  {
    id: "ord-3",
    orderNumber: "#ORD-98212",
    customer: {
      name: "Emma Davis",
      email: "emma.d@example.com",
      avatar: "ED",
    },
    itemsCount: 2,
    total: 948.0,
    status: "Completed",
    date: "25 Oct 2026, 11:15",
    paymentMethod: "Credit Card",
  },
  {
    id: "ord-4",
    orderNumber: "#ORD-98211",
    customer: {
      name: "James Wilson",
      email: "j.wilson@example.com",
      avatar: "JW",
    },
    itemsCount: 1,
    total: 399.0,
    status: "Pending",
    date: "25 Oct 2026, 09:30",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "ord-5",
    orderNumber: "#ORD-98210",
    customer: {
      name: "Olivia Taylor",
      email: "olivia.t@example.com",
      avatar: "OT",
    },
    itemsCount: 4,
    total: 3120.0,
    status: "Completed",
    date: "24 Oct 2026, 18:50",
    paymentMethod: "Credit Card",
  },
]

export const initialTopProducts: TopProduct[] = [
  {
    id: "prod-1",
    name: "Apple iPhone 14 Pro Max 128GB",
    sku: "IPH14-128-PUR",
    category: "Smartphones",
    price: 1399,
    salesCount: 142,
    image: "/images/detail-purple.png",
  },
  {
    id: "prod-2",
    name: "AirPods Max Silver Edition",
    sku: "AIRMAX-SLV",
    category: "Audio",
    price: 549,
    salesCount: 98,
    image: "/images/hero-airpods.png",
  },
  {
    id: "prod-3",
    name: "Apple Watch Series 9 GPS 41mm",
    sku: "AW9-41-STAR",
    category: "Wearables",
    price: 399,
    salesCount: 87,
    image: "/images/cart-watch.png",
  },
]
