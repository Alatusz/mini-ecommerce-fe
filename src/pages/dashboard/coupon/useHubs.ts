import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { QUERY_KEYS } from "@/lib/constants"
import {
  getCouponsList,
  getCouponById,
  createCoupon,
  updateCoupon,
  patchCouponStatus,
  deleteCoupon,
  type CouponItem,
  type CouponDiscountType,
  type CouponStatus,
  type CouponStatusSummary,
  type CreateCouponPayload,
  type UpdateCouponPayload,
} from "@/services/coupon.services"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"

export type {
  CouponItem,
  CouponDiscountType,
  CouponStatus,
  CouponStatusSummary,
  CreateCouponPayload,
  UpdateCouponPayload,
}

export type CouponSearchTarget = "code" | "description"

export const COUPON_SEARCH_TARGET_OPTIONS = [
  { value: "code", label: "Code Name" },
  { value: "description", label: "Description" },
] as const

export const COUPON_TYPE_OPTIONS = [
  { id: "percent", label: "Percent (%)" },
  { id: "fixed", label: "Fixed (฿)" },
] as const

export const COUPON_STATUS_OPTIONS = [
  { id: "active", label: "Active", dot: "bg-emerald-500" },
  { id: "scheduled", label: "Scheduled", dot: "bg-sky-500" },
  { id: "expired", label: "Expired", dot: "bg-zinc-400" },
  { id: "disabled", label: "Disabled", dot: "bg-red-500" },
] as const

export function useCouponsListQuery(params: {
  page: number
  limit: number
  search: string
  searchBy: string
  type: string
  status: string
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.COUPONS_LIST, params],
    queryFn: () =>
      getCouponsList({
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        searchBy: params.searchBy || undefined,
        type: params.type || undefined,
        status: params.status || undefined,
      }),
    placeholderData: keepPreviousData,
  })
}

export function useCouponDetailQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.COUPONS_LIST, "detail", id],
    queryFn: () => getCouponById(id!),
    enabled: Boolean(id),
  })
}

export function useCreateCouponMutation() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload: CreateCouponPayload) => createCoupon(payload),
    onSuccess: () => {
      showToast.success("Coupon created successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.COUPONS_LIST],
      })
      navigate("/dashboard/coupons")
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || "Failed to create coupon")
    },
  })
}

export function useUpdateCouponMutation(id: string) {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload: UpdateCouponPayload) => updateCoupon(id, payload),
    onSuccess: () => {
      showToast.success("Coupon updated successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.COUPONS_LIST],
      })
      navigate("/dashboard/coupons")
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || "Failed to update coupon")
    },
  })
}

export function usePatchCouponStatusMutation() {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CouponStatus }) =>
      patchCouponStatus(id, status),
    onSuccess: () => {
      showToast.success("Coupon status updated")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.COUPONS_LIST],
      })
    },
    onError: (err: any) => {
      showToast.error(
        err?.response?.data?.message || "Failed to update coupon status"
      )
    },
  })
}

export function useDeleteCouponMutation(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => {
      showToast.success("Coupon deleted successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.COUPONS_LIST],
      })
      onSuccessCallback?.()
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || "Failed to delete coupon")
    },
  })
}
