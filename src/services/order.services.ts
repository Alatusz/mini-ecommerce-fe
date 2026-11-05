import apiClient from "@/config/axios.config"

export interface CreateOrderPayload {
  addressId: string
  paymentMethod?: "cod" | "credit_card" | "promptpay" | string
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
export const getOrders = async () => {
  const response = await apiClient.get("/orders")

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
