import { useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"
import {
  getAdminShippingRates,
  createShippingRate,
  updateShippingRate,
  type ShippingRateItem,
  type ShippingRatePayload,
  type UpdateShippingRatePayload,
} from "@/services/shippingRate.services"

export type {
  ShippingRateItem,
  ShippingRatePayload,
  UpdateShippingRatePayload,
}

export function useAdminShippingRatesQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.SHIPPING_RATES],
    queryFn: getAdminShippingRates,
  })
}

export function useCreateShippingRateMutation(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: (payload: ShippingRatePayload) => createShippingRate(payload),
    onSuccess: () => {
      showToast.success("Shipping rate created successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.SHIPPING_RATES],
      })
      onSuccessCallback?.()
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to create shipping rate"
      showToast.error(message)
    },
  })
}

export function useUpdateShippingRateMutation(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateShippingRatePayload
    }) => updateShippingRate(id, payload),
    onSuccess: () => {
      showToast.success("Shipping rate updated successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.SHIPPING_RATES],
      })
      onSuccessCallback?.()
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update shipping rate"
      showToast.error(message)
    },
  })
}
