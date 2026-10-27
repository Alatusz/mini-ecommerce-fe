import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
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
    deletingUser,
    setDeletingUser,
    handleDeleteUser,
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
            <Link to={`/dashboard/user-management/edit/${row.original.id}`}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                title="Edit user"
              >
                <Pencil className="size-3.5" />
              </Button>
            </Link>
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
    [setDeletingUser]
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
        <Link to="/dashboard/user-management/create">
          <Button
            className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer shrink-0"
          >
            <Plus className="size-4" />
            <span>Add User</span>
          </Button>
        </Link>
      </div>

      {/* ── TanStack DataGrid ── */}
      <DataGrid
        data={users}
        columns={columns}
        urlSync={true}
        defaultPageSize={10}
        searchPlaceholder="Filter user rows..."
      />

      {/* ── Dialog: Delete User Confirmation ── */}
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
              </strong>{" "}
              from the system?
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
              onClick={() => {
                if (deletingUser) {
                  handleDeleteUser(deletingUser.id)
                }
              }}
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
