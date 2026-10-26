import { useEffect, useRef, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { createAtom } from "@tanstack/store"

export interface DataGridUrlSyncOptions {
  enabled?: boolean
  pageParamKey?: string
  pageSizeParamKey?: string
  searchParamKey?: string
  defaultPageSize?: number
}

/**
 * Custom hook to synchronize data grid state (pagination & global filter)
 * with the browser URL search params via TanStack Store external atoms.
 *
 * App-owned state slices are encapsulated in external atoms only where the
 * application must own them (e.g. URL query synchronization).
 */
export function useDataGridUrlSync({
  enabled = true,
  pageParamKey = "page",
  pageSizeParamKey = "size",
  searchParamKey = "q",
  defaultPageSize = 10,
}: DataGridUrlSyncOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse initial state from URL
  const initialPage = Math.max(
    0,
    parseInt(searchParams.get(pageParamKey) || "1", 10) - 1
  )
  const initialSize = parseInt(
    searchParams.get(pageSizeParamKey) || String(defaultPageSize),
    10
  )
  const initialSearch = searchParams.get(searchParamKey) || ""

  // Create external atoms owned by the app
  const paginationAtom = useMemo(() => {
    return createAtom({
      pageIndex: initialPage,
      pageSize: initialSize,
    })
  }, []) // stable atom reference

  const globalFilterAtom = useMemo(() => {
    return createAtom<string>(initialSearch)
  }, [])

  const isUpdatingFromUrl = useRef(false)

  // 1. Sync from URL to External Atoms (e.g. on Back/Forward or direct navigation)
  useEffect(() => {
    if (!enabled) return

    const urlPage = Math.max(
      0,
      parseInt(searchParams.get(pageParamKey) || "1", 10) - 1
    )
    const urlSize = parseInt(
      searchParams.get(pageSizeParamKey) || String(defaultPageSize),
      10
    )
    const urlSearch = searchParams.get(searchParamKey) || ""

    const currentPagination = paginationAtom.get()
    if (
      currentPagination.pageIndex !== urlPage ||
      currentPagination.pageSize !== urlSize
    ) {
      isUpdatingFromUrl.current = true
      paginationAtom.set({ pageIndex: urlPage, pageSize: urlSize })
      isUpdatingFromUrl.current = false
    }

    if (globalFilterAtom.get() !== urlSearch) {
      isUpdatingFromUrl.current = true
      globalFilterAtom.set(urlSearch)
      isUpdatingFromUrl.current = false
    }
  }, [searchParams, enabled, pageParamKey, pageSizeParamKey, searchParamKey, defaultPageSize, paginationAtom, globalFilterAtom])

  // 2. Subscribe to External Atoms and push updates to URL
  useEffect(() => {
    if (!enabled) return

    const subPagination = paginationAtom.subscribe((pagination) => {
      if (isUpdatingFromUrl.current) return

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const humanPage = pagination.pageIndex + 1

          if (humanPage > 1) {
            next.set(pageParamKey, String(humanPage))
          } else {
            next.delete(pageParamKey)
          }

          if (pagination.pageSize !== defaultPageSize) {
            next.set(pageSizeParamKey, String(pagination.pageSize))
          } else {
            next.delete(pageSizeParamKey)
          }

          return next
        },
        { replace: true }
      )
    })

    const subFilter = globalFilterAtom.subscribe((search) => {
      if (isUpdatingFromUrl.current) return

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (search.trim()) {
            next.set(searchParamKey, search.trim())
            // Reset to page 1 on new search
            next.delete(pageParamKey)
          } else {
            next.delete(searchParamKey)
          }
          return next
        },
        { replace: true }
      )
    })

    return () => {
      subPagination.unsubscribe()
      subFilter.unsubscribe()
    }
  }, [enabled, pageParamKey, pageSizeParamKey, searchParamKey, defaultPageSize, setSearchParams, paginationAtom, globalFilterAtom])

  return {
    paginationAtom,
    globalFilterAtom,
  }
}
