import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import {
  getUsers,
  deleteUser,
  patchUserStatus,
  type UserItem,
  type UserRole,
  type UserStatus,
} from "@/services/user.services"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"

export type { UserItem, UserRole, UserStatus }

export type UserSearchTarget = "name" | "email"

export const USER_SEARCH_TARGET_OPTIONS = [
  { value: "name", label: "Full Name" },
  { value: "email", label: "Email" },
] as const

export const USER_ROLE_OPTIONS = [
  { id: "admin", label: "Admin" },
  { id: "staff", label: "Staff" },
  { id: "customer", label: "Customer" },
] as const

export const USER_STATUS_OPTIONS = [
  { id: "active", label: "Active", dot: "bg-emerald-500" },
  { id: "inactive", label: "Inactive", dot: "bg-zinc-400" },
  { id: "suspended", label: "Suspended", dot: "bg-red-500" },
] as const

export function useUsersListQuery(params: {
  page: number
  limit: number
  search: string
  searchBy: string
  role: string
  status: string
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.USERS_LIST, params],
    queryFn: () =>
      getUsers({
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        searchBy: params.searchBy || undefined,
        role: params.role || undefined,
        status: params.status || undefined,
      }),
    placeholderData: keepPreviousData,
  })
}

export function usePatchUserStatusMutation() {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      patchUserStatus(id, status),
    onSuccess: () => {
      showToast.success("User status updated")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.USERS_LIST],
      })
    },
    onError: (err: any) => {
      showToast.error(
        err?.response?.data?.message || "Failed to update user status"
      )
    },
  })
}

export function useDeleteUserMutation(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      showToast.success("User deleted successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.USERS_LIST],
      })
      onSuccessCallback?.()
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || "Failed to delete user")
    },
  })
}
