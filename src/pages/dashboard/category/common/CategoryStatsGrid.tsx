import { Tags, Package, AlertTriangle, EyeOff } from "lucide-react"
import { StatCard } from "@/components/common/StatCard"

interface CategoryStatsGridProps {
  total: number
  activeCount: number
  draftCount: number
  archivedCount: number
  totalProducts: number
  emptyCount: number
  avgProducts: number | string
}

export function CategoryStatsGrid({
  total,
  activeCount,
  draftCount,
  archivedCount,
  totalProducts,
  emptyCount,
  avgProducts,
}: CategoryStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Categories"
        value={total}
        icon={<Tags className="size-3.5" />}
        description={`${activeCount} active · ${archivedCount} archived`}
      />

      <StatCard
        title="Assigned Products"
        value={totalProducts.toLocaleString()}
        icon={<Package className="size-3.5" />}
        description={`${avgProducts} avg / category`}
      />

      <StatCard
        title="Empty Categories"
        value={emptyCount}
        icon={<AlertTriangle className="size-3.5" />}
        valueClassName={
          emptyCount > 0
            ? "text-amber-600 dark:text-amber-400"
            : "text-foreground"
        }
        description={emptyCount > 0 ? "0 products assigned" : "All populated"}
      />

      <StatCard
        title="Drafts & Hidden"
        value={draftCount + archivedCount}
        icon={<EyeOff className="size-3.5" />}
        description={`${draftCount} draft · ${archivedCount} archived`}
      />
    </div>
  )
}
