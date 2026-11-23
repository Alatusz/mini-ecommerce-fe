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

// ── Admin / Dashboard User Management ──
export type UserRole = "admin" | "staff" | "customer"
export type UserStatus = "active" | "inactive" | "suspended"

export interface UserItem {
  id: string
  email: string
  role: UserRole
  status: UserStatus
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  bio?: string | null
  ordersCount?: number
  createdAt: string
  updatedAt: string
}

export interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
  searchBy?: string
  role?: string
  status?: string
}

export interface CreateUserPayload {
  email: string
  password: string
  role?: UserRole
  firstName?: string
  lastName?: string
  phone?: string
  bio?: string
}

export interface UpdateUserPayload {
  email?: string
  password?: string
  role?: UserRole
  firstName?: string
  lastName?: string
  phone?: string
  bio?: string
}

export const getUsers = async (params?: GetUsersParams) => {
  const response = await apiClient.get("/users", { params })
  return response.data
}

export const getUserById = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`)
  return response.data
}

export const createUser = async (data: CreateUserPayload) => {
  const response = await apiClient.post("/users", data)
  return response.data
}

export const updateUser = async (id: string, data: UpdateUserPayload) => {
  const response = await apiClient.put(`/users/${id}`, data)
  return response.data
}

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`)
  return response.data
}

export const patchUserStatus = async (id: string, status: UserStatus) => {
  const response = await apiClient.patch(`/users/${id}/status`, { status })
  return response.data
}
