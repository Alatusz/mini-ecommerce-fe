import {
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  filterFn_equalsString,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
} from "@tanstack/react-table"

export interface CustomColumnMeta {
  align?: "left" | "center" | "right"
  className?: string
  headerClassName?: string
}

export interface CustomTableMeta {
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void
  removeRow?: (rowIndex: number) => void
}

/**
 * Stable, statically defined TableFeatures object for TanStack Table V9.
 *
 * Configured with only the essential feature plugins, create*RowModel slots,
 * and function registries needed for high-performance e-commerce data grids.
 */
export const dataGridFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: {} as CustomColumnMeta,
  tableMeta: {} as CustomTableMeta,
})

export type DataGridFeatures = typeof dataGridFeatures
