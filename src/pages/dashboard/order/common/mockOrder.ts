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
  status: "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled"
  date: string
  paymentMethod: "Credit Card" | "PayPal" | "Cash on Delivery" | "Bank Transfer"
}

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
  {
    id: "ord-6",
    orderNumber: "#ORD-98209",
    customer: {
      name: "David Miller",
      email: "david.m@example.com",
      avatar: "DM",
    },
    itemsCount: 1,
    total: 549.0,
    status: "Cancelled",
    date: "24 Oct 2026, 15:10",
    paymentMethod: "Credit Card",
  },
  {
    id: "ord-7",
    orderNumber: "#ORD-98208",
    customer: {
      name: "Sophia Martinez",
      email: "sophia.m@example.com",
      avatar: "SM",
    },
    itemsCount: 2,
    total: 1698.0,
    status: "Completed",
    date: "23 Oct 2026, 16:35",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "ord-8",
    orderNumber: "#ORD-98207",
    customer: {
      name: "Alex Johnson",
      email: "alex.j@example.com",
      avatar: "AJ",
    },
    itemsCount: 3,
    total: 827.0,
    status: "Processing",
    date: "23 Oct 2026, 10:05",
    paymentMethod: "PayPal",
  },
]

export const orderStatuses: OrderItem["status"][] = [
  "Pending",
  "Processing",
  "Shipped",
  "Completed",
  "Cancelled",
]

export const paymentMethods: OrderItem["paymentMethod"][] = [
  "Credit Card",
  "PayPal",
  "Cash on Delivery",
  "Bank Transfer",
]

let orderStore: OrderItem[] = [...initialOrders]

export const getStoredOrders = (): OrderItem[] => {
  return [...orderStore]
}

export const getOrderById = (id: string): OrderItem | undefined => {
  return orderStore.find((o) => o.id === id)
}

export const addOrderToStore = (order: OrderItem): void => {
  orderStore = [order, ...orderStore]
}

export const updateOrderInStore = (
  id: string,
  updated: Partial<OrderItem>
): OrderItem | null => {
  const index = orderStore.findIndex((o) => o.id === id)
  if (index === -1) return null
  const newItem = { ...orderStore[index], ...updated }
  orderStore[index] = newItem
  return newItem
}

export const deleteOrderFromStore = (id: string): boolean => {
  const initialLen = orderStore.length
  orderStore = orderStore.filter((o) => o.id !== id)
  return orderStore.length < initialLen
}
