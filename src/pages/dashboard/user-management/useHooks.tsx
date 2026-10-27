import { useState, useMemo } from "react"
import {
  initialUsers,
  type UserItem,
} from "./common/mockUser"

export type { UserItem }

export function useUserManagement() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"All" | "Admin" | "Customer" | "Staff">("All")
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "Suspended">("All")

  // Modal dialog states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Customer" as UserItem["role"],
    status: "Active" as UserItem["status"],
  })
  const [formError, setFormError] = useState("")

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        searchQuery === "" ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === "All" || u.role === roleFilter
      const matchesStatus = statusFilter === "All" || u.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, roleFilter, statusFilter])

  // Computed stats
  const stats = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === "Active").length
    const totalSpending = users.reduce((acc, u) => acc + u.totalSpent, 0)
    const adminStaffCount = users.filter((u) => u.role === "Admin" || u.role === "Staff").length

    return {
      totalUsers,
      activeUsers,
      totalSpending,
      adminStaffCount,
    }
  }, [users])

  const openAddDialog = () => {
    setFormData({
      name: "",
      email: "",
      role: "Customer",
      status: "Active",
    })
    setFormError("")
    setIsAddOpen(true)
  }

  const openEditDialog = (user: UserItem) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    setFormError("")
  }

  const openDeleteDialog = (user: UserItem) => {
    setDeletingUser(user)
  }

  const handleAddUser = () => {
    if (!formData.name.trim()) {
      setFormError("Full name is required")
      return
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("A valid email address is required")
      return
    }

    const initials = formData.name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"

    const newUser: UserItem = {
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      status: formData.status,
      ordersCount: 0,
      totalSpent: 0,
      joinedDate: "Just now",
      avatar: initials,
    }

    setUsers((prev) => [newUser, ...prev])
    setIsAddOpen(false)
  }

  const handleUpdateUser = () => {
    if (!editingUser) return
    if (!formData.name.trim()) {
      setFormError("Full name is required")
      return
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("A valid email address is required")
      return
    }

    const initials = formData.name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: formData.name.trim(),
              email: formData.email.trim(),
              role: formData.role,
              status: formData.status,
              avatar: initials,
            }
          : u
      )
    )
    setEditingUser(null)
  }

  const handleDeleteUser = () => {
    if (!deletingUser) return
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id))
    setDeletingUser(null)
  }

  return {
    users: filteredUsers,
    rawUsers: users,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    stats,
    // Dialogs
    isAddOpen,
    setIsAddOpen,
    editingUser,
    setEditingUser,
    deletingUser,
    setDeletingUser,
    formData,
    setFormData,
    formError,
    // Actions
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  }
}
