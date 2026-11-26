import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import {
  getOrdersList,
  getOrderDetails,
  updateOrderStatus,
  type OrderItem,
  type OrderLineItem,
  type OrderStatusSummary,
  type UpdateOrderStatusPayload,
} from "@/services/order.services"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"

export type {
  OrderItem,
  OrderLineItem,
  OrderStatusSummary,
  UpdateOrderStatusPayload,
}

export const ORDER_STATUS_OPTIONS = [
  { id: "pending", label: "Pending", dot: "bg-amber-500" },
  { id: "paid", label: "Paid", dot: "bg-sky-500" },
  { id: "shipped", label: "Shipped", dot: "bg-indigo-500" },
  { id: "delivered", label: "Delivered", dot: "bg-emerald-500" },
  { id: "cancelled", label: "Cancelled", dot: "bg-red-500" },
] as const

export interface OrderNextAction {
  nextStatus: "paid" | "shipped" | "delivered"
  label: string
}

export function getNextOrderAction(
  status?: string,
  paymentMethod?: string
): OrderNextAction | null {
  if (status === "pending") {
    return paymentMethod === "cod"
      ? { nextStatus: "shipped", label: "จัดส่งสินค้า" }
      : { nextStatus: "paid", label: "ยืนยันชำระเงิน" }
  }
  if (status === "paid") {
    return { nextStatus: "shipped", label: "จัดส่งสินค้า" }
  }
  if (status === "shipped") {
    return { nextStatus: "delivered", label: "ส่งสำเร็จ" }
  }
  return null
}

export type OrderSearchTarget = "id" | "customer"

export const ORDER_SEARCH_TARGET_OPTIONS = [
  { value: "id", label: "Order ID" },
  { value: "customer", label: "Customer" },
] as const

export const PAYMENT_STATUS_OPTIONS = [
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
  { id: "failed", label: "Failed" },
  { id: "refund", label: "Refund" },
] as const

export const PAYMENT_METHOD_OPTIONS = [
  { id: "cod", label: "COD" },
  { id: "credit_card", label: "Credit Card" },
  { id: "promptpay", label: "PromptPay" },
] as const

export function useOrdersListQuery(params: {
  page: number
  limit: number
  search: string
  searchBy: string
  status: string
  paymentStatus: string
  paymentMethod: string
  startDate?: string
  endDate?: string
  tz: string
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.ORDERS_LIST, params],
    queryFn: () =>
      getOrdersList({
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        searchBy: params.searchBy || undefined,
        status: params.status || undefined,
        paymentStatus: params.paymentStatus || undefined,
        paymentMethod: params.paymentMethod || undefined,
        startDate: params.startDate || undefined,
        endDate: params.endDate || undefined,
        tz: params.startDate && params.endDate ? params.tz : undefined,
      }),
    placeholderData: keepPreviousData,
  })
}

export function useOrderDetailQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.ORDERS_LIST, "detail", id],
    queryFn: () => getOrderDetails(id!),
    enabled: Boolean(id),
  })
}

export function useUpdateOrderStatusMutation() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateOrderStatusPayload
    }) => updateOrderStatus(id, payload),
    onSuccess: () => {
      showToast.success("Order status updated")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.ORDERS_LIST],
      })
    },
    onError: (err: any) => {
      showToast.error(
        err?.response?.data?.message || "Failed to update order status"
      )
    },
  })
}
