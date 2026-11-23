import apiClient from "@/config/axios.config"

export interface IAddToCart {
  productId: string
  quantity?: number
}

// 1. ดึงข้อมูลตะกร้าสินค้าของผู้ใช้ (GET /api/cart)
export const getCart = async () => {
  const response = await apiClient.get("/cart")

  return response.data
}

// 2. เพิ่มสินค้าลงตะกร้า (POST /api/cart/items)
export const addToCart = async (data: IAddToCart) => {
  const response = await apiClient.post("/cart/items", data)

  return response.data
}

// 3. ปรับเปลี่ยนจำนวนสินค้าในตะกร้า (PUT /api/cart/items/:itemId)
export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  const response = await apiClient.put(`/cart/items/${itemId}`, { quantity })

  return response.data
}

// 4. ลบสินค้า 1 รายการออกจากตะกร้า (DELETE /api/cart/items/:itemId)
export const removeCartItem = async (itemId: string) => {
  const response = await apiClient.delete(`/cart/items/${itemId}`)

  return response.data
}

// 5. ล้างตะกร้าสินค้าทั้งหมด (DELETE /api/cart)
export const clearCart = async () => {
  const response = await apiClient.delete("/cart")
  
  return response.data
}
