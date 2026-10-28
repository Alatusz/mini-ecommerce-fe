export interface OrderProduct {
  id: string
  name: string
  image: string
  price: number
  quantity: number
  variant?: string
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
  status: "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled"
  date: string
  paymentMethod: "Credit Card" | "PayPal" | "Cash on Delivery" | "Bank Transfer"
  items?: OrderProduct[]
  trackingNumber?: string
  carrier?: string
  shippingAddress?: string
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
    trackingNumber: "TH-FLASH-892104",
    carrier: "Flash Express",
    shippingAddress: "123 Sukhumvit Road, Khlong Toei, Bangkok 10110",
    items: [
      {
        id: "p-1",
        name: "iPhone 16 Pro Max",
        image: "/images/hero-iphone.png",
        price: 1199.0,
        quantity: 1,
        variant: "Space Black • 256GB",
      },
      {
        id: "p-2",
        name: "AirPods Pro 2nd Gen",
        image: "/images/hero-airpods.png",
        price: 249.0,
        quantity: 1,
        variant: "White • MagSafe USB-C",
      },
      {
        id: "p-3",
        name: "Apple Watch Ultra 2",
        image: "/images/cart-watch.png",
        price: 978.0,
        quantity: 1,
        variant: "Titanium Case • Ocean Band",
      },
    ],
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
    trackingNumber: "TH-KERRY-772183",
    carrier: "Kerry Express",
    shippingAddress: "45/2 Nimmanahaeminda Rd, Suthep, Chiang Mai 50200",
    items: [
      {
        id: "p-4",
        name: "MacBook Pro 16-inch M3",
        image: "/images/hero-macbook.png",
        price: 1399.0,
        quantity: 1,
        variant: "Space Gray • 18GB RAM • 512GB SSD",
      },
    ],
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
    trackingNumber: "TH-EMS-391847",
    carrier: "Thailand Post (EMS)",
    shippingAddress: "88 Silom Road, Bang Rak, Bangkok 10500",
    items: [
      {
        id: "p-5",
        name: "PlayStation 5 Slim Edition",
        image: "/images/hero-ps5.png",
        price: 499.0,
        quantity: 1,
        variant: "Digital Edition • 1TB",
      },
      {
        id: "p-6",
        name: "DualSense Wireless Controller",
        image: "/images/showcase-gadgets.png",
        price: 449.0,
        quantity: 1,
        variant: "Midnight Black",
      },
    ],
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
    carrier: "Flash Express",
    shippingAddress: "99 Thonglor Soi 10, Watthana, Bangkok 10110",
    items: [
      {
        id: "p-7",
        name: "Apple Watch Series 9 GPS",
        image: "/images/cart-watch.png",
        price: 399.0,
        quantity: 1,
        variant: "Midnight Aluminum • 45mm",
      },
    ],
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
    status: "Shipped",
    date: "24 Oct 2026, 18:50",
    paymentMethod: "Credit Card",
    trackingNumber: "TH-FLASH-559102",
    carrier: "Flash Express",
    shippingAddress: "12 Vibhavadi Rangsit Rd, Chatuchak, Bangkok 10900",
    items: [
      {
        id: "p-4",
        name: "MacBook Pro 16-inch M3",
        image: "/images/hero-macbook.png",
        price: 2499.0,
        quantity: 1,
        variant: "Silver • 36GB RAM",
      },
      {
        id: "p-2",
        name: "AirPods Pro 2nd Gen",
        image: "/images/hero-airpods.png",
        price: 249.0,
        quantity: 1,
        variant: "White",
      },
      {
        id: "p-8",
        name: "Smart Gadgets Accessories Kit",
        image: "/images/showcase-gadgets.png",
        price: 186.0,
        quantity: 2,
        variant: "Pro Bundle",
      },
    ],
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
    shippingAddress: "77 Sathorn Tai Road, Thung Maha Mek, Sathon, Bangkok 10120",
    items: [
      {
        id: "p-9",
        name: "iPad Air 11-inch M2",
        image: "/images/showcase-ipad.png",
        price: 549.0,
        quantity: 1,
        variant: "Starlight • 128GB Wi-Fi",
      },
    ],
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
    trackingNumber: "TH-KERRY-119284",
    carrier: "Kerry Express",
    shippingAddress: "55 Asoke-Dindaeng Rd, Din Daeng, Bangkok 10400",
    items: [
      {
        id: "p-1",
        name: "iPhone 16 Pro Max",
        image: "/images/hero-iphone.png",
        price: 1199.0,
        quantity: 1,
        variant: "Desert Titanium • 256GB",
      },
      {
        id: "p-5",
        name: "PlayStation 5 Slim Edition",
        image: "/images/hero-ps5.png",
        price: 499.0,
        quantity: 1,
        variant: "Standard Disc Edition",
      },
    ],
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
    trackingNumber: "TH-FLASH-401928",
    carrier: "Flash Express",
    shippingAddress: "302 Phahonyothin Rd, Phaya Thai, Bangkok 10400",
    items: [
      {
        id: "p-2",
        name: "AirPods Pro 2nd Gen",
        image: "/images/hero-airpods.png",
        price: 249.0,
        quantity: 2,
        variant: "White",
      },
      {
        id: "p-8",
        name: "Smart Gadget Hub",
        image: "/images/showcase-gadgets.png",
        price: 329.0,
        quantity: 1,
        variant: "Space Gray",
      },
    ],
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
