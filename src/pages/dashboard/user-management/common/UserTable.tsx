import { useMemo } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  UserFilterDrawer,
  type UserFilterState,
} from "./UserFilterDrawer"
import { type UserItem, type UserSearchTarget } from "../useHubs"

const userColumnHelper = createColumnHelper<DataGridFeatures, UserItem>()

interface UserTableProps {
  data: UserItem[]
  total: number
  isLoading: boolean
  page: number
  limit: number
  search: string
  selectedSearchBy: UserSearchTarget[]
  selectedRoles: string[]
  selectedStatuses: string[]
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onSearchChange: (search: string) => void
  onFilterApply: (filters: UserFilterState) => void
  onFilterReset: () => void
  onEdit: (user: UserItem) => void
  onDelete: (user: UserItem) => void
}

function getInitials(user: UserItem) {
  const first = user.firstName?.[0] || ""
  const last = user.lastName?.[0] || ""
  const combined = (first + last).toUpperCase()
  return combined || user.email[0]?.toUpperCase() || "U"
}

function getFullName(user: UserItem) {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
  return full || user.email.split("@")[0]
}

export function UserTable({
  data,
  total,
  isLoading,
  page,
  limit,
  search,
  selectedSearchBy,
  selectedRoles,
  selectedStatuses,
  onPageChange,
  onLimitChange,
  onSearchChange,
  onFilterApply,
  onFilterReset,
  onEdit,
  onDelete,
}: UserTableProps) {
  const columns = useMemo(
    () => [
      userColumnHelper.accessor("email", {
        header: "User",
        size: 260,
        cell: (info) => {
          const user = info.row.original
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                {getInitials(user)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">
                  {getFullName(user)}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          )
        },
      }),
      userColumnHelper.accessor("role", {
        header: "Role",
        size: 110,
        cell: (info) => {
          const role = info.getValue()
          const label = role.charAt(0).toUpperCase() + role.slice(1)
          return (
            <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground">
              {label}
            </span>
          )
        },
      }),
      userColumnHelper.accessor("phone", {
        header: "Phone",
        size: 140,
        cell: (info) => (
          <span className="text-xs text-muted-foreground tabular-nums">
            {info.getValue() || "—"}
          </span>
        ),
      }),
      userColumnHelper.accessor("ordersCount", {
        header: "Orders",
        size: 90,
        cell: (info) => (
          <span className="text-xs font-medium tabular-nums">
            {info.getValue() ?? 0}
          </span>
        ),
      }),
      userColumnHelper.accessor("createdAt", {
        header: "Joined",
        size: 130,
        cell: (info) => {
          const raw = info.getValue()
          const formatted = raw
            ? new Date(raw).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"
          return (
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatted}
            </span>
          )
        },
      }),
      userColumnHelper.display({
        id: "actions",
        header: "",
        size: 60,
        cell: (info) => {
          const user = info.row.original
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
                    />
                  }
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => onEdit(user)}
                  >
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      }),
    ],
    [onEdit, onDelete]
  )

  return (
    <DataGrid
      data={data}
      columns={columns}
      rowCount={total}
      isLoading={isLoading}
      manualPagination
      manualFiltering
      pagination={{ pageIndex: page - 1, pageSize: limit }}
      onPaginationChange={(updater) => {
        const next =
          typeof updater === "function"
            ? updater({ pageIndex: page - 1, pageSize: limit })
            : updater
        if (next.pageSize !== limit) {
          onLimitChange(next.pageSize)
        } else if (next.pageIndex + 1 !== page) {
          onPageChange(next.pageIndex + 1)
        }
      }}
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search users..."
      toolbarActions={
        <UserFilterDrawer
          currentFilters={{
            searchBy: selectedSearchBy,
            roles: selectedRoles,
            status: selectedStatuses,
          }}
          onApply={onFilterApply}
          onReset={onFilterReset}
        />
      }
    />
  )
}
