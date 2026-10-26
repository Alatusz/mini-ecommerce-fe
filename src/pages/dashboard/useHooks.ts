import { useState, useMemo } from "react"
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

export interface ActivityItem {
  id: string
  title: string
  time: string
  type: "order" | "stock" | "user"
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

export const topProducts: TopProduct[] = [
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

export const recentActivities: ActivityItem[] = [
  {
    id: "act-1",
    title: "New order #ORD-98214 placed by Sarah Williams ($2,426)",
    time: "2 minutes ago",
    type: "order",
  },
  {
    id: "act-2",
    title: "Low stock alert: AirPods Max (Silver) has only 4 units remaining",
    time: "24 minutes ago",
    type: "stock",
  },
  {
    id: "act-3",
    title: "New customer registered: David Miller (david.m@example.com)",
    time: "1 hour ago",
    type: "user",
  },
  {
    id: "act-4",
    title: "Payment confirmed for order #ORD-98213 via PayPal",
    time: "2 hours ago",
    type: "order",
  },
]

export interface CategoryItem {
  id: string
  name: string
  slug: string
  itemCount: number
  description: string
}

export interface CouponItem {
  id: string
  code: string
  discount: string
  type: "percentage" | "fixed"
  minSpend: number
  usageCount: number
  status: "Active" | "Expired"
  expiryDate: string
}

export interface ReviewItem {
  id: string
  customer: string
  product: string
  rating: number
  comment: string
  date: string
  status: "Approved" | "Pending"
}

export const initialCategories: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Smartphones",
    slug: "smartphones",
    itemCount: 12,
    description: "Latest flagship phones & mobile devices",
  },
  {
    id: "cat-2",
    name: "Audio & Headphones",
    slug: "audio",
    itemCount: 8,
    description: "Noise cancelling headphones and earbuds",
  },
  {
    id: "cat-3",
    name: "Wearables & Watches",
    slug: "wearables",
    itemCount: 6,
    description: "Smartwatches, fitness bands and trackers",
  },
  {
    id: "cat-4",
    name: "Computers & Laptops",
    slug: "computers",
    itemCount: 5,
    description: "High performance laptops and desktops",
  },
  {
    id: "cat-5",
    name: "Gaming & Consoles",
    slug: "gaming",
    itemCount: 4,
    description: "PlayStation, Xbox and gaming peripherals",
  },
  {
    id: "cat-6",
    name: "Accessories",
    slug: "accessories",
    itemCount: 15,
    description: "Chargers, cables, cases and docks",
  },
]

export const initialCoupons: CouponItem[] = [
  {
    id: "c-1",
    code: "DISCOUNT10",
    discount: "10% OFF",
    type: "percentage",
    minSpend: 50,
    usageCount: 142,
    status: "Active",
    expiryDate: "31 Dec 2026",
  },
  {
    id: "c-2",
    code: "WELCOME50",
    discount: "$50 OFF",
    type: "fixed",
    minSpend: 200,
    usageCount: 88,
    status: "Active",
    expiryDate: "30 Nov 2026",
  },
  {
    id: "c-3",
    code: "FREESHIP",
    discount: "Free Shipping",
    type: "fixed",
    minSpend: 100,
    usageCount: 310,
    status: "Active",
    expiryDate: "31 Dec 2026",
  },
  {
    id: "c-4",
    code: "SUMMER2026",
    discount: "20% OFF",
    type: "percentage",
    minSpend: 80,
    usageCount: 65,
    status: "Expired",
    expiryDate: "31 Aug 2026",
  },
]

export const initialReviews: ReviewItem[] = [
  {
    id: "rev-1",
    customer: "Sarah Williams",
    product: "Apple iPhone 14 Pro Max",
    rating: 5,
    comment: "Incredible camera and battery life. Highly recommended!",
    date: "25 Oct 2026",
    status: "Approved",
  },
  {
    id: "rev-2",
    customer: "Michael Chen",
    product: "AirPods Max Silver",
    rating: 5,
    comment: "Best noise cancellation I have ever experienced.",
    date: "24 Oct 2026",
    status: "Approved",
  },
  {
    id: "rev-3",
    customer: "Emma Davis",
    product: "Apple Watch Series 9",
    rating: 4,
    comment: "Love the sleek design and fast charging speed.",
    date: "23 Oct 2026",
    status: "Approved",
  },
  {
    id: "rev-4",
    customer: "James Wilson",
    product: "Sony PlayStation 5",
    rating: 5,
    comment: "Fast loading times and immersive haptic feedback.",
    date: "22 Oct 2026",
    status: "Pending",
  },
]

export function useDashboard() {
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month" | "year">("month")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeMenu, setActiveMenu] = useState<string>("dashboard")

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
    activeMenu,
    setActiveMenu,
    metrics: initialMetrics,
    orders: filteredOrders,
    topProducts,
    activities: recentActivities,
    categories: initialCategories,
    coupons: initialCoupons,
    reviews: initialReviews,
    areaChartData,
    pieChartData,
    areaChartConfig,
    pieChartConfig,
    handleExport,
  }
}
