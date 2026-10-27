import { useMemo } from "react"
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  ShieldCheck,
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import { useUserManagement, type UserItem } from "./useHooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { PageContent } from "@/components/common/PageContent"

const userColumnHelper = createColumnHelper<DataGridFeatures, UserItem>()

export default function DashboardUserManagementPage() {
  const {
    users,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isAddOpen,
    setIsAddOpen,
    editingUser,
    setEditingUser,
    deletingUser,
    setDeletingUser,
  } = useUserManagement()

  const getRoleBadge = (role: UserItem["role"]) => {
    switch (role) {
      case "Admin":
        return (
          <Badge
            variant="outline"
            className="border-purple-500/30 bg-purple-50 text-[10px] font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
          >
            <ShieldCheck className="mr-1 size-3" />
            Admin
          </Badge>
        )
      case "Staff":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-50 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          >
            Staff
          </Badge>
        )
      case "Customer":
        return (
          <Badge
            variant="outline"
            className="border-border bg-muted/60 text-[10px] font-normal text-muted-foreground"
          >
            Customer
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: UserItem["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-50 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="mr-1 size-3" />
            Active
          </Badge>
        )
      case "Inactive":
        return (
          <Badge
            variant="outline"
            className="border-zinc-400/30 bg-zinc-100 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            <Clock className="mr-1 size-3" />
            Inactive
          </Badge>
        )
      case "Suspended":
        return (
          <Badge
            variant="outline"
            className="border-red-500/30 bg-red-50 text-[10px] font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            <XCircle className="mr-1 size-3" />
            Suspended
          </Badge>
        )
    }
  }

  // TanStack columns
  const columns = useMemo(
    () => [
      userColumnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="size-4 rounded accent-black dark:accent-white cursor-pointer"
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="size-4 rounded accent-black dark:accent-white cursor-pointer"
            aria-label={`Select row ${row.original.name}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      userColumnHelper.accessor("name", {
        header: "User Account",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-xs text-foreground">
              {info.row.original.avatar}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-foreground truncate">
                {info.getValue()}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {info.row.original.email}
              </span>
            </div>
          </div>
        ),
      }),
      userColumnHelper.accessor("role", {
        header: "Role",
        cell: (info) => getRoleBadge(info.getValue()),
      }),
      userColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => getStatusBadge(info.getValue()),
      }),
      userColumnHelper.accessor("ordersCount", {
        header: "Orders",
        cell: (info) => (
          <span className="text-xs text-foreground font-medium">
            {info.getValue()} orders
          </span>
        ),
      }),
      userColumnHelper.accessor("totalSpent", {
        header: "Total Spent",
        cell: (info) => (
          <span className="text-xs sm:text-sm font-semibold text-foreground">
            ${info.getValue().toFixed(2)}
          </span>
        ),
      }),
      userColumnHelper.accessor("joinedDate", {
        header: "Joined Date",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      userColumnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setEditingUser(row.original)}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
              title="Edit user"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDeletingUser(row.original)}
              className="cursor-pointer text-muted-foreground hover:text-destructive"
              title="Delete user"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [setEditingUser, setDeletingUser]
  )

  return (
    <PageContent>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Control registered customer profiles, administrative privileges, and account security.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer shrink-0"
        >
          <Plus className="size-4" />
          <span>Add User</span>
        </Button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Accounts
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Users className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-2xl font-bold text-foreground">
              {users.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Registered platform profiles
            </p>
          </CardContent>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-2xl font-bold text-foreground">
              {users.filter((u) => u.status === "Active").length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              In good standing & verified
            </p>
          </CardContent>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Cumulative Spending
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <DollarSign className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-2xl font-bold text-foreground">
              ${users.reduce((acc, u) => acc + u.totalSpent, 0).toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Lifetime customer value
            </p>
          </CardContent>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Admins & Staff
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <ShieldCheck className="size-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            <div className="text-2xl font-bold text-foreground">
              {users.filter((u) => u.role === "Admin" || u.role === "Staff").length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Privileged system access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-8 text-xs bg-muted/40 rounded-lg border-border/60"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
            {(["All", "Admin", "Staff", "Customer"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors shrink-0 ${
                  roleFilter === role
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
            {(["All", "Active", "Inactive", "Suspended"] as const).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`cursor-pointer rounded-md px-2 py-1 text-[11px] font-semibold transition-colors shrink-0 ${
                    statusFilter === status
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── TanStack DataGrid ── */}
      <DataGrid
        title="Users & Customers Directory"
        description="Comprehensive directory of registered accounts with status management and access control."
        data={users}
        columns={columns}
        urlSync={true}
        defaultPageSize={10}
        searchPlaceholder="Filter user rows..."
      />

      {/* ── Dialog 1: Add User (UI Only) ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account or staff member.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="user-name" className="text-xs font-semibold">
                Full Name
              </Label>
              <Input
                id="user-name"
                placeholder="e.g. Alex Johnson"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="user-email" className="text-xs font-semibold">
                Email Address
              </Label>
              <Input
                id="user-email"
                type="email"
                placeholder="e.g. alex.j@example.com"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="user-role" className="text-xs font-semibold">
                  Account Role
                </Label>
                <select
                  id="user-role"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none"
                >
                  <option value="Customer">Customer</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="user-status" className="text-xs font-semibold">
                  Status
                </Label>
                <select
                  id="user-status"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer"
            >
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 2: Edit User (UI Only) ── */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Account</DialogTitle>
            <DialogDescription>
              Update user contact details, role permissions, or account status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-uname" className="text-xs font-semibold">
                Full Name
              </Label>
              <Input
                id="edit-uname"
                defaultValue={editingUser?.name}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-uemail" className="text-xs font-semibold">
                Email Address
              </Label>
              <Input
                id="edit-uemail"
                type="email"
                defaultValue={editingUser?.email}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-urole" className="text-xs font-semibold">
                  Account Role
                </Label>
                <select
                  id="edit-urole"
                  defaultValue={editingUser?.role}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none"
                >
                  <option value="Customer">Customer</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-ustatus" className="text-xs font-semibold">
                  Status
                </Label>
                <select
                  id="edit-ustatus"
                  defaultValue={editingUser?.status}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingUser(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setEditingUser(null)}
              className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 3: Delete User (UI Only) ── */}
      <Dialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <strong className="text-foreground">
                {deletingUser?.name}
              </strong>
              ? This will revoke access and archive their profile.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingUser(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setDeletingUser(null)}
              className="cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContent>
  )
}
