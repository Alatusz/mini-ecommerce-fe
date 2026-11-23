import apiClient from "@/config/axios.config"

export interface IProfile {
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  bio?: string | null
}

export interface IChangePassword {
  currentPassword: string
  newPassword: string
}

// 1. ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน (GET /api/users/profile)
export const getProfile = async () => {
  const response = await apiClient.get("/users/profile")

  return response.data
}

// 2. อัปเดตข้อมูลโปรไฟล์ผู้ใช้ (PUT /api/users/profile)
export const updateProfile = async (data: IProfile) => {
  const response = await apiClient.put("/users/profile", data)
  
  return response.data
}

// 3. เปลี่ยนรหัสผ่าน (PUT /api/users/change-password)
export const changePassword = async (data: IChangePassword) => {
  const response = await apiClient.put("/users/change-password", data)
  
  return response.data
}
