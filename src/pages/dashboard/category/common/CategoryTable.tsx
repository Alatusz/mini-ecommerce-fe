import { useMemo } from "react"
import { Link } from "react-router-dom"
import { Tags, Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { cn } from "cn"
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type CategoryItem } from "./mockCategory"

const categoryColumnHelper = createColumnHelper<
  DataGridFeatures,
  CategoryItem
>()

const statusConfig: Record<
  string,
  { label: string; dot: string; triggerClass: string }
> = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    triggerClass:
      "border-border/60 bg-background text-foreground hover:bg-muted/60",
  },
  archived: {
    label: "Archived",
    dot: "bg-zinc-400",
    triggerClass:
      "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/70",
  },
  draft: {
    label: "Draft",
    dot: "bg-amber-500",
    triggerClass:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-300",
  },
}

interface CategoryTableProps {
  data: CategoryItem[]
  onDelete: (category: CategoryItem) => void
  onStatusChange?: (id: string, newStatus: string) => void
  isLoading?: boolean
}

export function CategoryTable({
  data,
  onDelete,
  onStatusChange,
}: CategoryTableProps) {
  const columns = useMemo(
    () => [
      categoryColumnHelper.accessor("name", {
        header: "Category",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/40 bg-muted/50 p-1">
              {info.row.original.image ? (
                <img
                  src={info.row.original.image}
                  alt={info.getValue()}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <Tags className="size-3.5 text-muted-foreground" />
              )}
            </div>
            <span className="truncate text-xs font-medium text-foreground">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      categoryColumnHelper.accessor("slug", {
        header: "Slug",
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">
            /{info.getValue()}
          </span>
        ),
      }),
      categoryColumnHelper.accessor(
        (row) => row.productCount ?? row.itemCount ?? 0,
        {
          id: "catalogItems",
          header: "Products",
          cell: (info) => {
            const count = info.getValue()
            return (
              <span
                className={`text-xs tabular-nums ${
                  count === 0
                    ? "font-medium text-amber-600 dark:text-amber-400"
                    : "font-semibold text-foreground"
                }`}
              >
                {count === 0 ? "0 items" : `${count.toLocaleString()} items`}
              </span>
            )
          },
        }
      ),
      categoryColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const rawStatus = (info.getValue() || "active").toLowerCase()
          const config = statusConfig[rawStatus] || statusConfig.active
          const productCount =
            info.row.original.productCount ?? info.row.original.itemCount ?? 0
          const hasProducts = productCount > 0

          return (
            <Select
              value={rawStatus}
              onValueChange={(val) => {
                if (val && val !== rawStatus) {
                  if (hasProducts && val !== "active") return
                  onStatusChange?.(info.row.original.id, val)
                }
              }}
              disabled={!onStatusChange}
            >
              <SelectTrigger
                size="sm"
                className={cn(
                  "h-6.5 w-[105px] cursor-pointer gap-1.5 rounded-full border px-2.5 text-[11px] font-medium shadow-none transition-colors",
                  config.triggerClass
                )}
              >
                <span
                  className={cn("size-1.5 shrink-0 rounded-full", config.dot)}
                />
                <SelectValue placeholder="Status">
                  {(val) => capitalizeFirstLetter(String(val ?? rawStatus))}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start" className="min-w-[125px]">
                {(["active", "archived", "draft"] as const).map((st) => {
                  const isBlocked = hasProducts && st !== "active"
                  return (
                    <SelectItem
                      key={st}
                      value={st}
                      disabled={isBlocked}
                      className={cn(
                        "cursor-pointer text-xs",
                        isBlocked && "cursor-not-allowed opacity-50"
                      )}
                      title={
                        isBlocked
                          ? `Cannot set to ${st} because ${productCount} product(s) are assigned`
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            statusConfig[st]?.dot
                          )}
                        />
                        <span>{capitalizeFirstLetter(st)}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        },
      }),
      categoryColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const productCount =
            row.original.productCount ?? row.original.itemCount ?? 0
          const hasProducts = productCount > 0

          return (
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
                  <Link to={`/dashboard/category/edit/${row.original.id}`}>
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <Pencil className="size-3.5 text-muted-foreground" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={hasProducts}
                    onClick={() => {
                      if (!hasProducts) {
                        onDelete(row.original)
                      }
                    }}
                    className={cn(
                      "cursor-pointer gap-2",
                      hasProducts && "cursor-not-allowed opacity-50"
                    )}
                    title={
                      hasProducts
                        ? `Cannot delete category because ${productCount} product(s) are assigned`
                        : "Delete category"
                    }
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
        enableSorting: false,
      }),
    ],
    [onDelete, onStatusChange]
  )

  return (
    <DataGrid
      data={data}
      columns={columns}
      urlSync={true}
      defaultPageSize={10}
      searchPlaceholder="Search categories..."
    />
  )
}
