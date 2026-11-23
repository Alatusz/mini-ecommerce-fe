/**
 * User Management — Unslop Redesign (dashboard-design skill)
 * Question: "How many active customers do we have, what is LTV, and are any accounts suspended?"
 * - Wordless: compact numeric facts in header & KPI cards; zero prose sentences.
 * - Quiet & Salience: monochrome KPI icons, slim 3px LTV share bars, warm red only on Suspended accounts.
 */
import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Plus,
  Pencil,
  Trash2,
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
import { UserStatsGrid } from "./common/UserStatsGrid"
import { UserTable } from "./common/UserTable"
import { UserDeleteDialog } from "./common/UserDeleteDialog"

export default function DashboardUserManagementPage() {
  const {
    users,
    deletingUser,
    setDeletingUser,
    handleDeleteUser,
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
    [setDeletingUser]
  )

  return (
    <PageContent>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer, staff, and administrator accounts.
          </p>
        </div>
      </div>

      <UserStatsGrid
        total={total}
        staffCount={staffCount}
        customerCount={customerCount}
        totalOrders={totalOrders}
      />

      <UserTable
        data={users}
        total={total}
        selectedSearchBy={selectedSearchBy}
        selectedRoles={selectedRoles}
        selectedStatuses={selectedStatuses}
        onFilterApply={handleFilterApply}
        onFilterReset={handleFilterReset}
        onStatusChange={handleStatusChange}
        isUpdatingStatus={isUpdatingStatus}
        onDelete={setDeletingUser}
      />

      <UserDeleteDialog
        user={deletingUser}
        isDeleting={isDeleting}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
      />
    </PageContent>
  )
}
