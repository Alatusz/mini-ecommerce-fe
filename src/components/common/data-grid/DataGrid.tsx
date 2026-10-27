import React from "react"
import {
  useTable,
  type ColumnDef,
  type RowData,
  type TableOptions,
} from "@tanstack/react-table"
import type { Atom } from "@tanstack/store"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  Inbox,
  X,
} from "lucide-react"

import {
  dataGridFeatures,
  type DataGridFeatures,
} from "./tableFeatures"
import { useDataGridUrlSync } from "./useDataGridUrlSync"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export interface DataGridProps<TData extends RowData> {
  data: TData[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<DataGridFeatures, TData, any>[]
  title?: string
  description?: string
  searchPlaceholder?: string
  enableSearch?: boolean
  enablePagination?: boolean
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  urlSync?: boolean
  defaultPageSize?: number
  className?: string
  onRowClick?: (row: TData) => void
  actions?: React.ReactNode
}

/**
 * Headless Data Grid Component built on TanStack Table V9.
 *
 * Architecture Highlights:
 * 1. Headless & modular core: Driven by statically registered `tableFeatures`.
 * 2. TanStack Store-backed state & selectors: Scoped reactive subscriptions via `useTable` and `table.Subscribe`.
 * 3. External atoms: Controlled URL synchronization for application-owned slices (`pagination`, `globalFilter`).
 * 4. Semantic HTML: Accessible table elements (`table`, `thead`, `tbody`, `tr`, `th`, `td`) with full ARIA support.
 */
export function DataGrid<TData extends RowData>({
  data,
  columns,
  title,
  description,
  searchPlaceholder = "Search records...",
  enableSearch = true,
  enablePagination = true,
  enableRowSelection = true,
  enableColumnVisibility = true,
  urlSync = false,
  defaultPageSize = 10,
  className = "",
  onRowClick,
  actions,
}: DataGridProps<TData>) {
  // Synchronize state with URL query parameters via TanStack Store external atoms
  const { paginationAtom, globalFilterAtom } = useDataGridUrlSync({
    enabled: urlSync,
    defaultPageSize,
  })

  // Table options configuration
  const tableOptions: TableOptions<DataGridFeatures, TData> = {
    features: dataGridFeatures,
    data,
    columns,
    enableRowSelection,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: defaultPageSize,
      },
    },
    // Bind external atoms only for slices the application owns
    ...(urlSync && {
      atoms: {
        pagination: paginationAtom as Atom<{ pageIndex: number; pageSize: number }>,
        globalFilter: globalFilterAtom as Atom<string>,
      },
    }),
  }

  // React table instance with TanStack Store selector
  const table = useTable(tableOptions, (state) => ({
    pagination: state.pagination,
    sorting: state.sorting,
    globalFilter: state.globalFilter,
    rowSelection: state.rowSelection,
    columnVisibility: state.columnVisibility,
  }))

  const rows = table.getRowModel().rows
  const headerGroups = table.getHeaderGroups()

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* ── Toolbar: Header, Global Search, Column Visibility & Actions ── */}
      <div className="flex items-center justify-between gap-3">
        {(title || description) && (
          <div>
            {title && (
              <h2 className="text-lg font-bold text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Global Search Input */}
          {enableSearch && (
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={table.state.globalFilter ?? ""}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                className="h-9 pl-8 pr-7 text-xs bg-background"
                aria-label="Filter records"
              />
              {table.state.globalFilter && (
                <button
                  type="button"
                  onClick={() => table.setGlobalFilter("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Column Visibility Selector */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5 text-xs cursor-pointer border-border/70"
                >
                  <SlidersHorizontal className="size-3.5" />
                  <span>Columns</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs">Toggle Columns</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {table
                    .getAllLeafColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize text-xs cursor-pointer"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Custom Action Slots */}
          {actions}
        </div>
      </div>

      {/* ── Semantic HTML Table Container ── */}
      <div className="relative rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs">
        <div className="w-full overflow-x-auto">
          <table
            className="w-full caption-bottom text-xs border-collapse"
            role="table"
            aria-label={title || "Data Table"}
          >
            {/* Semantic <thead> */}
            <thead className="border-b border-border/60 bg-muted/40" role="rowgroup">
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border/40" role="row">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort()
                    const sortDirection = header.column.getIsSorted()

                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        scope="col"
                        role="columnheader"
                        aria-sort={
                          sortDirection === "asc"
                            ? "ascending"
                            : sortDirection === "desc"
                            ? "descending"
                            : "none"
                        }
                        className={`h-10 px-4 text-left font-medium text-foreground whitespace-nowrap select-none ${
                          canSort ? "cursor-pointer hover:bg-muted/70 transition-colors" : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-1.5">
                            {/* Render using TanStack V9 FlexRender component */}
                            <table.FlexRender header={header} />

                            {/* Sort Direction Indicator */}
                            {canSort && (
                              <span className="shrink-0 text-muted-foreground">
                                {sortDirection === "asc" ? (
                                  <ArrowUp className="size-3.5 text-foreground" />
                                ) : sortDirection === "desc" ? (
                                  <ArrowDown className="size-3.5 text-foreground" />
                                ) : (
                                  <ArrowUpDown className="size-3 text-muted-foreground/60" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>

            {/* Semantic <tbody> */}
            <tbody className="divide-y divide-border/40 bg-card" role="rowgroup">
              {rows.length > 0 ? (
                rows.map((row) => {
                  const isSelected = row.getIsSelected()

                  return (
                    <tr
                      key={row.id}
                      role="row"
                      aria-selected={isSelected}
                      onClick={() => onRowClick?.(row.original)}
                      className={`transition-colors hover:bg-muted/40 ${
                        isSelected ? "bg-muted/60" : ""
                      } ${onRowClick ? "cursor-pointer" : ""}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          role="cell"
                          className="px-4 py-3 align-middle text-foreground whitespace-nowrap"
                        >
                          {/* Render cell using TanStack V9 FlexRender */}
                          <table.FlexRender cell={cell} />
                        </td>
                      ))}
                    </tr>
                  )
                })
              ) : (
                /* Semantic Empty State */
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-36 text-center text-muted-foreground"
                    role="cell"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="size-8 text-muted-foreground/60" />
                      <span className="text-xs font-medium">No records found</span>
                      <span className="text-[11px] text-muted-foreground/70">
                        Try adjusting your search criteria or clearing active filters.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer: Granular Reactive Subscription & Pagination ── */}
        <div className="flex items-center justify-between gap-3 border-t border-border/50 px-4 py-3 text-xs bg-muted/15">
          {/* TanStack Table Subscribe for Reactive Row Selection Counts */}
          {enableRowSelection ? (
            <table.Subscribe
              selector={(state) => ({
                rowSelection: state.rowSelection,
              })}
            >
              {({ rowSelection }) => {
                const selectedCount = Object.keys(rowSelection || {}).length
                const totalRows = table.getPrePaginatedRowModel().rows.length

                return (
                  <div className="text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {selectedCount}
                    </span>{" "}
                    of {totalRows} row(s) selected
                  </div>
                )
              }}
            </table.Subscribe>
          ) : (
            <div className="text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                {table.getPrePaginatedRowModel().rows.length}
              </span>{" "}
              records
            </div>
          )}

          {/* Pagination Controls */}
          {enablePagination && (
            <div className="flex items-center gap-6 ml-auto">
              {/* Page Size Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Rows per page:</span>
                <select
                  value={table.state.pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="h-8 rounded-md border border-border/70 bg-background px-2 text-xs text-foreground cursor-pointer outline-none"
                  aria-label="Rows per page"
                >
                  {[5, 10, 20, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reactive Page Indicator */}
              <table.Subscribe
                selector={(state) => ({
                  pageIndex: state.pagination.pageIndex,
                  pageSize: state.pagination.pageSize,
                })}
              >
                {({ pageIndex }) => {
                  const pageCount = table.getPageCount() || 1
                  return (
                    <div className="text-muted-foreground font-medium">
                      Page {pageIndex + 1} of {pageCount}
                    </div>
                  )
                }}
              </table.Subscribe>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="First page"
                  className="size-7 cursor-pointer"
                >
                  <ChevronsLeft className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Previous page"
                  className="size-7 cursor-pointer"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Next page"
                  className="size-7 cursor-pointer"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Last page"
                  className="size-7 cursor-pointer"
                >
                  <ChevronsRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
