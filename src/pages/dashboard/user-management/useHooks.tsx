import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import {
  useUsersListQuery,
  usePatchUserStatusMutation,
  useDeleteUserMutation,
  type UserItem,
  type UserSearchTarget,
  type UserStatus,
} from "./useHubs"
import { type UserFilterState } from "./common/UserFilterDrawer"

export type { UserItem }

export function useUserManagement() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null)

  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10)
  const search = searchParams.get("search") || ""
  const rawSearchBy = searchParams.get("searchBy") || ""
  const rawRole = searchParams.get("role") || ""
  const rawStatus = searchParams.get("status") || ""

  const selectedSearchBy = useMemo(() => {
    return rawSearchBy
      ? rawSearchBy
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter((s): s is UserSearchTarget => s === "name" || s === "email")
      : []
  }, [rawSearchBy])

  const selectedRoles = useMemo(() => {
    return rawRole
      ? rawRole
          .split(",")
          .map((r) => r.trim().toLowerCase())
          .filter(Boolean)
      : []
  }, [rawRole])

  const selectedStatuses = useMemo(() => {
    return rawStatus
      ? rawStatus
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : []
  }, [rawStatus])

  const { data, isLoading } = useUsersListQuery({
    page,
    limit,
    search,
    searchBy: rawSearchBy,
    role: rawRole,
    status: rawStatus,
  })

  const users: UserItem[] = Array.isArray(data) ? data : (data?.data ?? [])
  const total: number = Array.isArray(data)
    ? data.length
    : (data?.total ?? users.length)

  const staffCount = users.filter(
    (u) => u.role === "admin" || u.role === "staff"
  ).length
  const customerCount = users.filter((u) => u.role === "customer").length
  const totalOrders = users.reduce((sum, u) => sum + (u.ordersCount ?? 0), 0)

  const patchStatusMutation = usePatchUserStatusMutation()
  const deleteMutation = useDeleteUserMutation(() => setDeletingUser(null))

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

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage })
  }

  const handleLimitChange = (newLimit: number) => {
    updateUrlParams({ limit: newLimit, page: 1 })
  }

  const handleSearchChange = (newSearch: string) => {
    updateUrlParams({ search: newSearch, page: 1 })
  }

  const handleFilterApply = (filters: UserFilterState) => {
    updateUrlParams({
      searchBy:
        filters.searchBy.length > 0 ? filters.searchBy.join(",") : undefined,
      role: filters.roles.length > 0 ? filters.roles.join(",") : undefined,
      status: filters.status.length > 0 ? filters.status.join(",") : undefined,
      page: 1,
    })
  }

  const handleFilterReset = () => {
    updateUrlParams({
      searchBy: undefined,
      role: undefined,
      status: undefined,
      page: 1,
    })
  }

  const handleStatusChange = (id: string, status: UserStatus) => {
    patchStatusMutation.mutate({ id, status })
  }

  const handleDeleteConfirm = (id: string) => {
    deleteMutation.mutate(id)
  }

  return {
    users,
    total,
    page,
    limit,
    search,
    selectedSearchBy,
    selectedRoles,
    selectedStatuses,
    isLoading,
    staffCount,
    customerCount,
    totalOrders,
    deletingUser,
    setDeletingUser,
    isDeleting: deleteMutation.isPending,
    isUpdatingStatus: patchStatusMutation.isPending,
    handlePageChange,
    handleLimitChange,
    handleSearchChange,
    handleFilterApply,
    handleFilterReset,
    handleStatusChange,
    handleDeleteConfirm,
  }
}
