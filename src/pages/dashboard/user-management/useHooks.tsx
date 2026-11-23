import { useState } from "react"
import {
  getStoredUsers,
  deleteUserFromStore,
  type UserItem,
} from "./common/mockUser"

export type { UserItem }

export function useUserManagement() {
  const [users, setUsers] = useState<UserItem[]>(() => getStoredUsers())
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null)

  const handleDeleteUser = (id: string) => {
    deleteUserFromStore(id)
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
