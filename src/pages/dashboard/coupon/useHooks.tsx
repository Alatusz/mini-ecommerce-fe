import { useState, useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  useCouponsListQuery,
  usePatchCouponStatusMutation,
  useDeleteCouponMutation,
  type CouponItem,
  type CouponSearchTarget,
  type CouponStatus,
  type CouponStatusSummary,
} from "./useHubs"
import { type CouponFilterState } from "./common/CouponFilterDrawer"

export type { CouponItem, CouponStatusSummary }

const parseCsv = (raw: string) =>
  raw
    ? raw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : []

export function useCoupon() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [deletingCoupon, setDeletingCoupon] = useState<CouponItem | null>(null)

  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10)
  const search = searchParams.get("search") || ""
  const rawSearchBy = searchParams.get("searchBy") || ""
  const rawType = searchParams.get("type") || ""
  const rawStatus = searchParams.get("status") || ""

  const selectedSearchBy = useMemo(
    () =>
      parseCsv(rawSearchBy).filter(
        (s): s is CouponSearchTarget => s === "code" || s === "description"
      ),
    [rawSearchBy]
  )
  const selectedTypes = useMemo(() => parseCsv(rawType), [rawType])
  const selectedStatuses = useMemo(() => parseCsv(rawStatus), [rawStatus])

  const { data, isLoading } = useCouponsListQuery({
    page,
    limit,
    search,
    searchBy: rawSearchBy,
    type: rawType,
    status: rawStatus,
  })

  const coupons: CouponItem[] = data?.coupons ?? data?.data ?? []
  const total: number = data?.total ?? coupons.length
  const summaryByStatus: CouponStatusSummary[] = data?.summaryByStatus ?? []

  const patchStatusMutation = usePatchCouponStatusMutation()
  const deleteMutation = useDeleteCouponMutation(() => setDeletingCoupon(null))

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

  const handleFilterApply = (filters: CouponFilterState) => {
    updateUrlParams({
      searchBy:
        filters.searchBy.length > 0 ? filters.searchBy.join(",") : undefined,
      type: filters.type.length > 0 ? filters.type.join(",") : undefined,
      status: filters.status.length > 0 ? filters.status.join(",") : undefined,
      page: 1,
    })
  }

  const handleFilterReset = () => {
    updateUrlParams({
      searchBy: undefined,
      type: undefined,
      status: undefined,
      page: 1,
    })
  }

  const handleStatusChange = (id: string, status: CouponStatus) => {
    patchStatusMutation.mutate({ id, status })
  }

  const handleCreate = () => navigate("/dashboard/coupons/create")
  const handleEdit = (coupon: CouponItem) =>
    navigate(`/dashboard/coupons/edit/${coupon.id}`)
  const handleDeleteConfirm = (id: string) => deleteMutation.mutate(id)

  return {
    coupons,
    total,
    summaryByStatus,
    selectedSearchBy,
    selectedTypes,
    selectedStatuses,
    isLoading,
    isUpdatingStatus: patchStatusMutation.isPending,
    deletingCoupon,
    setDeletingCoupon,
    isDeleting: deleteMutation.isPending,
    handleFilterApply,
    handleFilterReset,
    handleStatusChange,
    handleCreate,
    handleEdit,
    handleDeleteConfirm,
  }
}
