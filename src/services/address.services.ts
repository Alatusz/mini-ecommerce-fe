import apiClient from "@/config/axios.config"

export interface IAddress {
  title: string
  tag?: "home" | "office" | "condo" | string
  address: string
  phone: string
  isDefault?: boolean
}

// 1. ดึงรายการที่อยู่ทั้งหมดของผู้ใช้ (GET /api/addresses)
export const getAddresses = async () => {
  const response = await apiClient.get("/addresses")

  return response.data
}

// 2. เพิ่มที่อยู่ใหม่ (POST /api/addresses)
export const createAddress = async (data: IAddress) => {
  const response = await apiClient.post("/addresses", data)

  return response.data
}

// 3. แก้ไขข้อมูลที่อยู่ (PUT /api/addresses/:id)
export const updateAddress = async (id: string, data: Partial<IAddress>) => {
  const response = await apiClient.put(`/addresses/${id}`, data)
  return response.data
}

// 4. ลบที่อยู่ (DELETE /api/addresses/:id)
export const deleteAddress = async (id: string) => {
  const response = await apiClient.delete(`/addresses/${id}`)
  
  return response.data
}

// 5. ตั้งค่าที่อยู่นี้เป็นค่าเริ่มต้น (PATCH /api/addresses/:id/default)
export const setDefaultAddress = async (id: string) => {
  const response = await apiClient.patch(`/addresses/${id}/default`)
  
  return response.data
}
