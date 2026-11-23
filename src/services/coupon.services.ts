import apiClient from "@/config/axios.config"

export type CouponDiscountType = "percent" | "fixed"
export type CouponStatus = "active" | "scheduled" | "expired" | "disabled"

export interface CouponItem {
  id: string
  code: string
  description?: string | null
  discountType: CouponDiscountType
  discountValue: number
  minSpend: number
  usageLimit?: number | null
  usageCount: number
  startDate: string
  expiredDate: string
  status: CouponStatus
  createdAt: string
  updatedAt: string
}

export interface CouponStatusSummary {
  status: string
  count: number
  redemptions: number
}

export interface GetCouponsParams {
  page?: number
  limit?: number
  search?: string
  searchBy?: string
  type?: string
  status?: string
}

export interface CreateCouponPayload {
  code: string
  description?: string
  discountType: CouponDiscountType
  discountValue: number
  minSpend?: number
  usageLimit?: number | null
  startDate: string
  expiredDate: string
  status?: CouponStatus
}

export type UpdateCouponPayload = Partial<CreateCouponPayload>

export const getCouponsList = async (params?: GetCouponsParams) => {
  const response = await apiClient.get("/coupons", { params })
  return response.data
}

export const getCouponById = async (id: string) => {
  const response = await apiClient.get(`/coupons/${id}`)
  return response.data
}

export const createCoupon = async (data: CreateCouponPayload) => {
  const response = await apiClient.post("/coupons", data)
  return response.data
}

export const updateCoupon = async (id: string, data: UpdateCouponPayload) => {
  const response = await apiClient.put(`/coupons/${id}`, data)
  return response.data
}

export const patchCouponStatus = async (id: string, status: CouponStatus) => {
  const response = await apiClient.patch(`/coupons/${id}/status`, { status })
  return response.data
}

export const deleteCoupon = async (id: string) => {
  const response = await apiClient.delete(`/coupons/${id}`)
  return response.data
}
