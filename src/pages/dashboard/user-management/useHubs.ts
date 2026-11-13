import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { QUERY_KEYS } from "@/lib/constants"
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  type UserItem,
  type UserRole,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "@/services/user.services"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"

export type { UserItem, UserRole, CreateUserPayload, UpdateUserPayload }

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
      }),
    placeholderData: keepPreviousData,
  })
}

export function useUserDetailQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD.USERS_LIST, "detail", id],
    queryFn: () => getUserById(id!),
    enabled: Boolean(id),
  })
}

export function useCreateUserMutation() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      showToast.success("User created successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.USERS_LIST],
      })
      navigate("/dashboard/users")
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || "Failed to create user")
    },
  })
}

export function useUpdateUserMutation(id: string) {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(id, payload),
    onSuccess: () => {
      showToast.success("User updated successfully")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.USERS_LIST],
      })
      navigate("/dashboard/users")
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || "Failed to update user")
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
