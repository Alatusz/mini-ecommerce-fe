import apiClient from "@/config/axios.config"

export interface ShippingRateItem {
  id: string
  name: string
  price: number
  freeMinSpend: number | null
  minDays: number
  maxDays: number
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ShippingRatePayload {
  name: string
  price: number
  freeMinSpend?: number | null
  minDays: number
  maxDays: number
  isActive?: boolean
  sortOrder?: number
}

export type UpdateShippingRatePayload = Partial<ShippingRatePayload>

export interface ShippingRatesResponse {
  success: boolean
  data: ShippingRateItem[]
}

export interface ShippingRateMutationResponse {
  success: boolean
  message: string
  data: ShippingRateItem
}

export const getActiveShippingRates = async (): Promise<ShippingRatesResponse> => {
  const response = await apiClient.get("/shipping-rates")
  return response.data
}

export const getAdminShippingRates = async (): Promise<ShippingRatesResponse> => {
  const response = await apiClient.get("/shipping-rates/admin")
  return response.data
}

export const createShippingRate = async (
  data: ShippingRatePayload
): Promise<ShippingRateMutationResponse> => {
  const response = await apiClient.post("/shipping-rates", data)
  return response.data
}

export const updateShippingRate = async (
  id: string,
  data: UpdateShippingRatePayload
): Promise<ShippingRateMutationResponse> => {
  const response = await apiClient.put(`/shipping-rates/${id}`, data)
  return response.data
}
