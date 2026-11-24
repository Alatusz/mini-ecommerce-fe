import { useMemo } from "react"
import { MoreHorizontal, Trash2 } from "lucide-react"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  UserFilterDrawer,
  type UserFilterState,
} from "./UserFilterDrawer"
import {
  USER_STATUS_OPTIONS,
  type UserItem,
  type UserSearchTarget,
  type UserStatus,
} from "../useHubs"

const userColumnHelper = createColumnHelper<DataGridFeatures, UserItem>()

interface UserTableProps {
  data: UserItem[]
  total: number
  selectedSearchBy: UserSearchTarget[]
  selectedRoles: string[]
  selectedStatuses: string[]
  onFilterApply: (filters: UserFilterState) => void
  onFilterReset: () => void
  onStatusChange: (id: string, status: UserStatus) => void
  isUpdatingStatus?: boolean
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
  selectedSearchBy,
  selectedRoles,
  selectedStatuses,
  onFilterApply,
  onFilterReset,
  onStatusChange,
  isUpdatingStatus = false,
  onDelete,
}: UserTableProps) {
  const columns = useMemo(
    () => [
      userColumnHelper.accessor("email", {
        header: "User",
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
      userColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const user = info.row.original
          const currentStatus = info.getValue() || "active"
          const statusOpt = USER_STATUS_OPTIONS.find(
            (s) => s.id === currentStatus
          )
          return (
            <Select
              value={currentStatus}
              disabled={isUpdatingStatus}
              onValueChange={(val) =>
                onStatusChange(user.id, val as UserStatus)
              }
            >
              <SelectTrigger className="h-7 w-[120px] text-xs">
                <SelectValue>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`size-2 shrink-0 rounded-full ${statusOpt?.dot ?? "bg-zinc-400"}`}
                    />
                    <span>{statusOpt?.label ?? currentStatus}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {USER_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-2 shrink-0 rounded-full ${opt.dot}`}
                      />
                      <span>{opt.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      }),
      userColumnHelper.accessor("phone", {
        header: "Phone",
        cell: (info) => (
          <span className="text-xs text-muted-foreground tabular-nums">
            {info.getValue() || "—"}
          </span>
        ),
      }),
      userColumnHelper.accessor("ordersCount", {
        header: "Orders",
        cell: (info) => (
          <span className="text-xs font-medium tabular-nums">
            {info.getValue() ?? 0}
          </span>
        ),
      }),
      userColumnHelper.accessor("createdAt", {
        header: "Joined",
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
    [onStatusChange, isUpdatingStatus, onDelete]
  )

  return (
    <DataGrid
      data={data}
      columns={columns}
      urlSync={true}
      defaultPageSize={10}
      searchPlaceholder="Search users..."
      manualPagination={true}
      manualFiltering={true}
      rowCount={total}
      actions={
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

