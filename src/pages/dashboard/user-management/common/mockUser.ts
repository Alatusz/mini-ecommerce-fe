export interface UserItem {
  id: string
  name: string
  email: string
  role: "Admin" | "Customer" | "Staff"
  status: "Active" | "Inactive" | "Suspended"
  ordersCount: number
  totalSpent: number
  joinedDate: string
  avatar: string
}

export const initialUsers: UserItem[] = [
  {
    id: "usr-1",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "Customer",
    status: "Active",
    ordersCount: 8,
    totalSpent: 4890.5,
    joinedDate: "12 Jan 2026",
    avatar: "SW",
  },
  {
    id: "usr-2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    role: "Admin",
    status: "Active",
    ordersCount: 14,
    totalSpent: 9240.0,
    joinedDate: "05 Nov 2025",
    avatar: "MC",
  },
  {
    id: "usr-3",
    name: "Emma Davis",
    email: "emma.d@example.com",
    role: "Customer",
    status: "Active",
    ordersCount: 5,
    totalSpent: 2180.0,
    joinedDate: "20 Feb 2026",
    avatar: "ED",
  },
  {
    id: "usr-4",
    name: "James Wilson",
    email: "j.wilson@example.com",
    role: "Staff",
    status: "Active",
    ordersCount: 2,
    totalSpent: 798.0,
    joinedDate: "14 Mar 2026",
    avatar: "JW",
  },
  {
    id: "usr-5",
    name: "Olivia Taylor",
    email: "olivia.t@example.com",
    role: "Customer",
    status: "Inactive",
    ordersCount: 1,
    totalSpent: 399.0,
    joinedDate: "02 Apr 2026",
    avatar: "OT",
  },
  {
    id: "usr-6",
    name: "David Miller",
    email: "david.m@example.com",
    role: "Customer",
    status: "Suspended",
    ordersCount: 0,
    totalSpent: 0,
    joinedDate: "27 May 2026",
    avatar: "DM",
  },
  {
    id: "usr-7",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    role: "Customer",
    status: "Active",
    ordersCount: 6,
    totalSpent: 3450.0,
    joinedDate: "18 Jun 2026",
    avatar: "SM",
  },
  {
    id: "usr-8",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    role: "Staff",
    status: "Active",
    ordersCount: 3,
    totalSpent: 1250.0,
    joinedDate: "09 Jul 2026",
    avatar: "AJ",
  },
]

export const userRoles: UserItem["role"][] = ["Customer", "Staff", "Admin"]
export const userStatuses: UserItem["status"][] = ["Active", "Inactive", "Suspended"]

let userStore: UserItem[] = [...initialUsers]

export const getStoredUsers = (): UserItem[] => {
  return [...userStore]
}

export const getUserById = (id: string): UserItem | undefined => {
  return userStore.find((u) => u.id === id)
}

export const addUserToStore = (user: UserItem): void => {
  userStore = [user, ...userStore]
}

export const updateUserInStore = (
  id: string,
  updated: Partial<UserItem>
): UserItem | null => {
  const index = userStore.findIndex((u) => u.id === id)
  if (index === -1) return null
  const newItem = { ...userStore[index], ...updated }
  userStore[index] = newItem
  return newItem
}

export const deleteUserFromStore = (id: string): boolean => {
  const initialLen = userStore.length
  userStore = userStore.filter((u) => u.id !== id)
  return userStore.length < initialLen
}
