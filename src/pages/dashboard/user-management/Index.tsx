/**
 * User Management — Unslop Redesign (dashboard-design skill)
 * Question: "How many active customers do we have, what is LTV, and are any accounts suspended?"
 * - Wordless: compact numeric facts in header & KPI cards; zero prose sentences.
 * - Quiet & Salience: monochrome KPI icons, slim 3px LTV share bars, warm red only on Suspended accounts.
 */
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
  MoreHorizontal,
} from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import { useUserManagement, type UserItem } from "./useHooks"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/common/StatCard"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

  const activeCount = users.filter((u) => u.status === "Active").length
  const suspendedCount = users.filter((u) => u.status === "Suspended").length
  const staffCount = users.filter(
    (u) => u.role === "Admin" || u.role === "Staff"
  ).length
  const totalSpent = users.reduce((acc, u) => acc + u.totalSpent, 0)
  const avgSpent = users.length > 0 ? Math.round(totalSpent / users.length) : 0

  const getRoleBadge = (role: UserItem["role"]) => {
    switch (role) {
      case "Admin":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground">
            Admin
          </span>
        )
      case "Staff":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Staff
          </span>
        )
      case "Customer":
        return (
          <span className="text-xs text-muted-foreground">
            Customer
          </span>
        )
    }
  }

  const getStatusBadge = (status: UserItem["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        )
      case "Inactive":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-zinc-400" />
            Inactive
          </span>
        )
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:text-red-300">
            <span className="size-1.5 rounded-full bg-red-500" />
            Suspended
          </span>
        )
    }
  }

  const columns = useMemo(
    () => [
      userColumnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="size-3.5 cursor-pointer rounded accent-foreground"
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="size-3.5 cursor-pointer rounded accent-foreground"
            aria-label={`Select row ${row.original.name}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      userColumnHelper.accessor("name", {
        header: "Account",
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
              {info.row.original.avatar}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium text-foreground">
                {info.getValue()}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
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
        cell: (info) => {
          const count = info.getValue()
          return (
            <span className="text-xs font-medium tabular-nums text-foreground">
              {count === 0 ? "—" : count}
            </span>
          )
        },
      }),
      userColumnHelper.accessor("totalSpent", {
        header: "LTV Spent",
        cell: (info) => {
          const val = info.getValue()
          return (
            <span className="text-xs font-semibold tabular-nums text-foreground">
              {val === 0
                ? "—"
                : `$${val.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}`}
            </span>
          )
        },
      }),
      userColumnHelper.accessor("joinedDate", {
        header: "Joined",
        cell: (info) => (
          <span className="text-xs tabular-nums text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      userColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                    title="Actions"
                  >
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="start" className="w-36">
                <DropdownMenuItem
                  onClick={() => setEditingUser(row.original)}
                  className="cursor-pointer gap-2"
                >
                  <Pencil className="size-3.5 text-muted-foreground" />
                  <span>Edit User</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeletingUser(row.original)}
                  className="cursor-pointer gap-2"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [setEditingUser, setDeletingUser]
  )

  return (
    <PageContent>
      {/* ── Header & Toolbar ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Customers & Staff
          </h1>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddOpen(true)}
          className="h-8 shrink-0 cursor-pointer gap-1.5 rounded-full bg-foreground px-3.5 text-xs text-background hover:bg-foreground/90"
        >
          <Plus className="size-3.5" />
          <span>Add User</span>
        </Button>
      </div>

      {/* ── 4 KPI Cards (Monochrome Icons + Tabular Numbers) ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Accounts"
          value={users.length}
          icon={<Users className="size-3.5" />}
          description={
            suspendedCount > 0 ? `${suspendedCount} suspended` : "0 suspended"
          }
        />

        <StatCard
          title="Active Users"
          value={activeCount}
          icon={<UserCheck className="size-3.5" />}
          description={
            users.length > 0
              ? `${Math.round((activeCount / users.length) * 100)}% of base`
              : "—"
          }
        />

        <StatCard
          title="Total LTV"
          value={`$${totalSpent.toLocaleString()}`}
          icon={<DollarSign className="size-3.5" />}
          description={`$${avgSpent.toLocaleString()} avg / user`}
        />

        <StatCard
          title="Admins & Staff"
          value={staffCount}
          icon={<ShieldCheck className="size-3.5" />}
          description="internal access"
        />
      </div>

      {/* ── Calm Segmented Filter Bar ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 rounded-lg border-border/60 bg-card pl-8 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Role Segmented Filter */}
          <div className="inline-flex items-center rounded-lg border border-border/60 bg-card p-0.5">
            {(["All", "Admin", "Staff", "Customer"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-xs transition-all ${
                  roleFilter === role
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Status Segmented Filter */}
          <div className="inline-flex items-center rounded-lg border border-border/60 bg-card p-0.5">
            {(["All", "Active", "Inactive", "Suspended"] as const).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs transition-all ${
                    statusFilter === status
                      ? "bg-muted font-medium text-foreground"
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
        data={users}
        columns={columns}
        urlSync={true}
        defaultPageSize={10}
        searchPlaceholder="Search users..."
      />

      {/* ── Dialog 1: Add User ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="user-name" className="text-xs font-medium">
                Name
              </Label>
              <Input
                id="user-name"
                placeholder="Alex Johnson"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="user-email" className="text-xs font-medium">
                Email
              </Label>
              <Input
                id="user-email"
                type="email"
                placeholder="alex.j@example.com"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="user-role" className="text-xs font-medium">
                  Role
                </Label>
                <select
                  id="user-role"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none"
                >
                  <option value="Customer">Customer</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="user-status" className="text-xs font-medium">
                  Status
                </Label>
                <select
                  id="user-status"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none"
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
              className="cursor-pointer text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              className="cursor-pointer bg-foreground text-xs text-background hover:bg-foreground/90"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 2: Edit User ── */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-uname" className="text-xs font-medium">
                Name
              </Label>
              <Input
                id="edit-uname"
                defaultValue={editingUser?.name}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-uemail" className="text-xs font-medium">
                Email
              </Label>
              <Input
                id="edit-uemail"
                type="email"
                defaultValue={editingUser?.email}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-urole" className="text-xs font-medium">
                  Role
                </Label>
                <select
                  id="edit-urole"
                  defaultValue={editingUser?.role}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none"
                >
                  <option value="Customer">Customer</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-ustatus" className="text-xs font-medium">
                  Status
                </Label>
                <select
                  id="edit-ustatus"
                  defaultValue={editingUser?.status}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none"
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
              className="cursor-pointer text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setEditingUser(null)}
              className="cursor-pointer bg-foreground text-xs text-background hover:bg-foreground/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog 3: Delete User ── */}
      <Dialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Remove{" "}
              <strong className="text-foreground">{deletingUser?.name}</strong>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingUser(null)}
              className="cursor-pointer text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setDeletingUser(null)}
              className="cursor-pointer text-xs"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContent>
  )
}
