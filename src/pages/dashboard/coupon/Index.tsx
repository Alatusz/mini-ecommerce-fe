import { Plus } from "lucide-react"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { useCoupon } from "./useHooks"
import { CouponStatsGrid } from "./common/CouponStatsGrid"
import { CouponTable } from "./common/CouponTable"
import { CouponDeleteDialog } from "./common/CouponDeleteDialog"

export default function DashboardCouponPage() {
  const {
    coupons,
    total,
    summaryByStatus,
    selectedSearchBy,
    selectedTypes,
    selectedStatuses,
    isUpdatingStatus,
    deletingCoupon,
    setDeletingCoupon,
    isDeleting,
    handleFilterApply,
    handleFilterReset,
    handleStatusChange,
    handleCreate,
    handleEdit,
    handleDeleteConfirm,
  } = useCoupon()

  return (
    <PageContent>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons & Promos</h1>
          <p className="text-sm text-muted-foreground">
            Manage discount codes, redemption limits, and campaign schedules.
          </p>
        </div>
        <Button onClick={handleCreate} className="cursor-pointer gap-1.5">
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      <CouponStatsGrid total={total} summaryByStatus={summaryByStatus} />

      <CouponTable
        data={coupons}
        total={total}
        selectedSearchBy={selectedSearchBy}
        selectedTypes={selectedTypes}
        selectedStatuses={selectedStatuses}
        onFilterApply={handleFilterApply}
        onFilterReset={handleFilterReset}
        onStatusChange={handleStatusChange}
        isUpdatingStatus={isUpdatingStatus}
        onEdit={handleEdit}
        onDelete={setDeletingCoupon}
      />

      <CouponDeleteDialog
        coupon={deletingCoupon}
        isDeleting={isDeleting}
        onClose={() => setDeletingCoupon(null)}
        onConfirm={handleDeleteConfirm}
      />
    </PageContent>
  )
}
