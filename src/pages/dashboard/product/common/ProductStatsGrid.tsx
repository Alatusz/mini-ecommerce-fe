import { Package, Layers, AlertTriangle, XCircle } from "lucide-react"
import { StatCard } from "@/components/common/StatCard"

export interface ProductStatsGridProps {
  total: number
  totalUnits: number
  inStockCount: number
  lowStockCount: number
  outOfStockCount: number
}

export function ProductStatsGrid({
  total,
  totalUnits,
  inStockCount,
  lowStockCount,
  outOfStockCount,
}: ProductStatsGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        title="Total SKUs"
        value={total}
        icon={<Package className="size-3.5" />}
        description={`${inStockCount} in stock`}
      />

      <StatCard
        title="Inventory Volume"
        value={totalUnits.toLocaleString()}
        icon={<Layers className="size-3.5" />}
        description="units on hand"
      />

      <StatCard
        title="Low Stock"
        value={lowStockCount}
        icon={<AlertTriangle className="size-3.5" />}
        valueClassName={
          lowStockCount > 0
            ? "text-amber-600 dark:text-amber-400"
            : "text-foreground"
        }
        description="below threshold"
      />

      <StatCard
        title="Out of Stock"
        value={outOfStockCount}
        icon={<XCircle className="size-3.5" />}
        valueClassName={
          outOfStockCount > 0
            ? "text-red-600 dark:text-red-400"
            : "text-foreground"
        }
        description="0 units available"
      />
    </div>
  )
}
