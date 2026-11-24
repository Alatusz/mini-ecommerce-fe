import { useState, useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import type { DateRange } from "react-day-picker"
import {
  useOrdersListQuery,
  useUpdateOrderStatusMutation,
  type OrderItem,
  type OrderSearchTarget,
  type OrderStatusSummary,
} from "./useHubs"
import { type OrderFilterState } from "./common/OrderFilterDrawer"

export type { OrderItem, OrderStatusSummary }

const parseCsv = (raw: string) =>
  raw
    ? raw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : []

export function useOrder() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [deletingOrder, setDeletingOrder] = useState<OrderItem | null>(null)

  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10)
  const search = searchParams.get("search") || ""
  const rawSearchBy = searchParams.get("searchBy") || ""
  const rawStatus = searchParams.get("status") || ""
  const rawPaymentStatus = searchParams.get("paymentStatus") || ""
  const rawPaymentMethod = searchParams.get("paymentMethod") || ""
  const startDate = searchParams.get("startDate") || ""
  const endDate = searchParams.get("endDate") || ""
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  const selectedSearchBy = useMemo(
    () =>
      parseCsv(rawSearchBy).filter(
        (s): s is OrderSearchTarget => s === "id" || s === "customer"
      ),
    [rawSearchBy]
  )
  const selectedStatuses = useMemo(() => parseCsv(rawStatus), [rawStatus])
  const selectedPaymentStatuses = useMemo(
    () => parseCsv(rawPaymentStatus),
    [rawPaymentStatus]
  )
  const selectedPaymentMethods = useMemo(
    () => parseCsv(rawPaymentMethod),
    [rawPaymentMethod]
  )

  const { data, isLoading } = useOrdersListQuery({
    page,
    limit,
    search,
    searchBy: rawSearchBy,
    status: rawStatus,
    paymentStatus: rawPaymentStatus,
    paymentMethod: rawPaymentMethod,
    startDate,
    endDate,
    tz,
  })

  const ordersList: OrderItem[] = data?.orders ?? data?.data ?? []
  const total: number = data?.total ?? ordersList.length
  const summaryByStatus: OrderStatusSummary[] = data?.summaryByStatus ?? []

  const updateStatusMutation = useUpdateOrderStatusMutation()

  const updateUrlParams = (
    newParams: Record<string, string | number | undefined>
  ) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(newParams).forEach(([key, val]) => {
          if (val === undefined || val === "" || val === null) {
            next.delete(key)
          } else {
            next.set(key, String(val))
          }
        })
        return next
      },
      { replace: true }
    )
  }

  const handleFilterApply = (filters: OrderFilterState) => {
    updateUrlParams({
      searchBy:
        filters.searchBy.length > 0 ? filters.searchBy.join(",") : undefined,
      status: filters.status.length > 0 ? filters.status.join(",") : undefined,
      paymentStatus:
        filters.paymentStatus.length > 0
          ? filters.paymentStatus.join(",")
          : undefined,
      paymentMethod:
        filters.paymentMethod.length > 0
          ? filters.paymentMethod.join(",")
          : undefined,
      page: 1,
    })
  }

  const handleFilterReset = () => {
    updateUrlParams({
      searchBy: undefined,
      status: undefined,
      paymentStatus: undefined,
      paymentMethod: undefined,
      page: 1,
    })
  }

  const handleDateRangeChange = (range?: DateRange) => {
    if (!range?.from) {
      updateUrlParams({ startDate: undefined, endDate: undefined, page: 1 })
      return
    }
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    updateUrlParams({
      startDate: fmt(range.from),
      endDate: fmt(range.to ?? range.from),
      page: 1,
    })
  }

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({
      id,
      payload: { status: status as any },
    })
  }

  const handleEditOrder = (order: OrderItem) => {
    navigate(`/dashboard/order/edit/${order.id}`)
  }

  const handleDeleteOrder = (_id: string) => {
    setDeletingOrder(null)
  }

  return {
    ordersList,
    total,
    summaryByStatus,
    selectedSearchBy,
    selectedStatuses,
    selectedPaymentStatuses,
    selectedPaymentMethods,
    isLoading,
    isUpdatingStatus: updateStatusMutation.isPending,
    deletingOrder,
    setDeletingOrder,
    handleFilterApply,
    handleFilterReset,
    handleDateRangeChange,
    handleStatusChange,
    handleEditOrder,
    handleDeleteOrder,
  }
}
