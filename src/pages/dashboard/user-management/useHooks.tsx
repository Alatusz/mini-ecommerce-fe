import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import {
  type UserItem,
  type UserSearchTarget,
  type UserStatus,
} from "./useHubs"
import { type UserFilterState } from "./common/UserFilterDrawer"

export type { UserItem }

export function useUserManagement() {
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null)

  const handleDeleteUser = (id: string) => {
    setUsers(getStoredUsers())
    setDeletingUser(null)
  }

  return {
    users,
    setUsers,
    deletingUser,
    setDeletingUser,
    handleDeleteUser,
  }
}
