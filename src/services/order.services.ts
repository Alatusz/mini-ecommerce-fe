import apiClient from "@/config/axios.config"

export interface OrderStatusSummary {
  status: string
  count: number
  total: number
}

export interface GetOrdersParams {
  page?: number
  limit?: number
  search?: string
  searchBy?: string
  status?: string
  paymentStatus?: string
  paymentMethod?: string
  startDate?: string
  endDate?: string
  tz?: string
}

export interface OrderLineItem {
  id: string
  orderId: string
  rating?: number
  review? : string
  productId: string
  quantity: number
  price: number
  product?: {
    id: string
    name: string
    imageUrl?: string | null
    price?: number
  }
}

export interface OrderItem {
  id: string
  orderNumber?: string
  totalAmount?: number
  total?: number
  status: string
  paymentMethod?: string
  paymentStatus?: string
  shippingAddress?: string | null
  shippingPhone?: string | null
  shippingRateId?: string | null
  shippingMethodName?: string
  shippingCost?: number
  couponCode?: string | null
  discountAmount?: number
  createdAt: string
  user?: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
  }
  items?: OrderLineItem[]
  _count?: {
    items: number
  }
}

export interface CreateOrderPayload {
  addressId: string
  paymentMethod?: "cod" | "credit_card" | "promptpay" | string
  shippingRateId?: string
  couponCode?: string
}

export interface UpdateOrderStatusPayload {
  status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  paymentStatus?: "pending" | "completed" | "failed" | "refund"
}

// 1. สร้างคำสั่งซื้อใหม่จากตะกร้าสินค้า (POST /api/orders)
export const createOrder = async (data: CreateOrderPayload) => {
  const response = await apiClient.post("/orders", data)
  return response.data
}

// 2. ดูประวัติคำสั่งซื้อทั้งหมดของตนเอง (GET /api/orders/my-orders)
export const getMyOrders = async () => {
  const response = await apiClient.get("/orders/my-orders")

  return response.data
}

// 3. ดูรายละเอียดคำสั่งซื้อเดี่ยวตาม ID (GET /api/orders/:id)
export const getOrderDetails = async (id: string) => {
  const response = await apiClient.get(`/orders/${id}`)

  return response.data
}

// 4. ยกเลิกคำสั่งซื้อ (PATCH /api/orders/:id/cancel)
export const cancelOrder = async (id: string) => {
  const response = await apiClient.patch(`/orders/${id}/cancel`)
  return response.data
}

// 5. ADMIN: ดูรายการคำสั่งซื้อทั้งหมดในระบบ (GET /api/orders)
export const getOrdersList = async (params?: GetOrdersParams) => {
  const response = await apiClient.get("/orders", { params })

  return response.data
}

// 6. ADMIN: อัปเดตสถานะคำสั่งซื้อหรือการชำระเงิน (PATCH /api/orders/:id/status)
export const updateOrderStatus = async (
  id: string,
  data: UpdateOrderStatusPayload
) => {
  const response = await apiClient.patch(`/orders/${id}/status`, data)

  return response.data
}

export const rateOrderItem = async (
  itemId: string,
  rating: number,
  review?: string
) => {
  const response = await apiClient.patch(`/orders/items/${itemId}/rating`, {
    rating,
    review,
  })
  return response.data
}
