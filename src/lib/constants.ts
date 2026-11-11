export const QUERY_KEYS = {
  AUTH: "auth",
  DASHBOARD: {
    CATEGORIES_LIST: "CATEGORIES_LIST",
    PRODUCTS_LIST: "PRODUCTS_LIST",
  },
  OPTIONS: {
    CATEGORIES: "CATEGORY_OPTIONS",
  },
}

// ── Stock Status Color & Styling Constants ──
export const STOCK_STATUS_COLORS = {
  in_stock: {
    label: "In Stock",
    textClass: "text-emerald-600 dark:text-emerald-400 font-medium",
    dotClass: "bg-emerald-500",
  },
  low_stock: {
    label: "Low Stock",
    textClass: "text-amber-600 dark:text-amber-400 font-semibold",
    dotClass: "bg-amber-500",
  },
  out_of_stock: {
    label: "Out of Stock",
    textClass: "text-red-600 dark:text-red-400 font-semibold",
    dotClass: "bg-red-500",
  },
} as const

export const getStockTextColor = (stock: number): string => {
  if (stock <= 0) return STOCK_STATUS_COLORS.out_of_stock.textClass
  if (stock <= 10) return STOCK_STATUS_COLORS.low_stock.textClass
  return STOCK_STATUS_COLORS.in_stock.textClass
}

// ── Product Publication Status Constants ──
export const PRODUCT_STATUS_CONFIG = {
  published: {
    label: "Published",
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  draft: {
    label: "Draft",
    badgeClass:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    dotClass: "bg-zinc-400",
  },
  archived: {
    label: "Archived",
    badgeClass:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
} as const
