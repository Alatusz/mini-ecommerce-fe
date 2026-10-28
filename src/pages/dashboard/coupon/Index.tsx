import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  TicketPercent,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Check,
  Calendar,
  Percent,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Tag,
} from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import { useCoupon } from "./useHooks"
import type { CouponItem } from "./common/mockCoupon"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { PageContent } from "@/components/common/PageContent"

const couponColumnHelper = createColumnHelper<DataGridFeatures, CouponItem>()

export default function DashboardCouponPage() {
  const {
    coupons,
    rawCoupons,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    deletingCoupon,
    setDeletingCoupon,
    copiedCode,
    handleCopyCode,
    handleDeleteCoupon,
    stats,
  } = useCoupon()

  const getStatusBadge = (status: CouponItem["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-50 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="mr-1 size-3" />
            Active
          </Badge>
        )
      case "Scheduled":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-50 text-[10px] font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          >
            <Clock className="mr-1 size-3" />
            Scheduled
          </Badge>
        )
      case "Expired":
        return (
          <Badge
            variant="outline"
            className="border-zinc-400/30 bg-zinc-100 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            <AlertCircle className="mr-1 size-3" />
            Expired
          </Badge>
        )
    }
  }

  const columns = useMemo(
    () => [
      couponColumnHelper.accessor("code", {
        header: "Coupon Code",
        cell: (info) => {
          const code = info.getValue()
          const isCopied = copiedCode === code

          return (
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <TicketPercent className="size-4.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-xs sm:text-sm text-foreground tracking-wide">
                    {code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(code)}
                    className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer transition-colors"
                    title={isCopied ? "Copied!" : "Copy code"}
                  >
                    {isCopied ? (
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
                <span className="text-[11px] text-muted-foreground truncate max-w-[200px] sm:max-w-[260px]">
                  {info.row.original.description}
                </span>
              </div>
            </div>
          )
        },
      }),
      couponColumnHelper.accessor("discountType", {
        header: "Discount",
        cell: (info) => {
          const type = info.getValue()
          const val = info.row.original.discountValue

          return (
            <div className="flex items-center gap-1.5">
              {type === "percent" ? (
                <Badge
                  variant="secondary"
                  className="bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/40 text-xs font-bold gap-1"
                >
                  <Percent className="size-3" />
                  {val}% OFF
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40 text-xs font-bold gap-1"
                >
                  <DollarSign className="size-3" />
                  ${val.toFixed(2)} OFF
                </Badge>
              )}
            </div>
          )
        },
      }),
      couponColumnHelper.display({
        id: "validityPeriod",
        header: "Validity Period",
        cell: ({ row }) => (
          <div className="flex flex-col text-xs">
            <div className="flex items-center gap-1 text-foreground font-medium">
              <Calendar className="size-3 text-muted-foreground shrink-0" />
              <span>{row.original.startDate}</span>
              <span className="text-muted-foreground">→</span>
              <span>{row.original.expiredDate}</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Start Date - Expired Date
            </span>
          </div>
        ),
      }),
      couponColumnHelper.accessor("minSpend", {
        header: "Min Spend",
        cell: (info) => {
          const min = info.getValue()
          return (
            <span className="text-xs font-medium text-foreground">
              {min && min > 0 ? `$${min.toFixed(2)}` : "No Min"}
            </span>
          )
        },
      }),
      couponColumnHelper.accessor("usageCount", {
        header: "Redemptions",
        cell: (info) => {
          const count = info.getValue()
          const limit = info.row.original.usageLimit
          const percentage = limit ? Math.min(100, Math.round((count / limit) * 100)) : 0

          return (
            <div className="flex flex-col gap-1 min-w-[90px]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{count}</span>
                <span className="text-[10px] text-muted-foreground">
                  {limit ? `/ ${limit}` : "unlimited"}
                </span>
              </div>
              {limit && (
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentage >= 100
                        ? "bg-red-500"
                        : percentage >= 80
                        ? "bg-amber-500"
                        : "bg-primary"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          )
        },
      }),
      couponColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => getStatusBadge(info.getValue()),
      }),
      couponColumnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Link to={`/dashboard/coupon/edit/${row.original.id}`}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                title="Edit Coupon"
              >
                <Pencil className="size-3.5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDeletingCoupon(row.original)}
              className="cursor-pointer text-muted-foreground hover:text-destructive"
              title="Delete Coupon"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [copiedCode, handleCopyCode, setDeletingCoupon]
  )

  return (
    <PageContent>
      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Coupons & Promotions
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage discount vouchers, percentage and fixed reductions, and promotion validity dates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard/coupon/create">
              <Button size="sm" className="gap-1.5 cursor-pointer text-xs">
                <Plus className="size-3.5" />
                <span>Create Coupon</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* ── KPI Metric Cards ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="border-border/60 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Total Coupons</p>
                <h3 className="text-xl font-bold text-foreground mt-0.5">{stats.total}</h3>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Tag className="size-4.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Active Campaigns</p>
                <h3 className="text-xl font-bold text-foreground mt-0.5">{stats.active}</h3>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Scheduled</p>
                <h3 className="text-xl font-bold text-foreground mt-0.5">{stats.scheduled}</h3>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Clock className="size-4.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Total Redemptions</p>
                <h3 className="text-xl font-bold text-foreground mt-0.5">{stats.totalRedemptions}</h3>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <TrendingUp className="size-4.5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Filters & Tabs ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["All", "Active", "Scheduled", "Expired"].map((st) => (
              <Button
                key={st}
                variant={filterStatus === st ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(st)}
                className={`text-xs h-8 px-3 cursor-pointer ${
                  filterStatus === st ? "" : "text-muted-foreground"
                }`}
              >
                {st}
                {st === "All" && ` (${rawCoupons.length})`}
                {st === "Active" && ` (${stats.active})`}
                {st === "Scheduled" && ` (${stats.scheduled})`}
                {st === "Expired" && ` (${stats.expired})`}
              </Button>
            ))}
          </div>

          {/* Discount Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Type:</span>
            <div className="flex items-center rounded-lg border border-border/60 p-0.5 bg-muted/20">
              <button
                type="button"
                onClick={() => setFilterType("All")}
                className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${
                  filterType === "All"
                    ? "bg-background text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType("percent")}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${
                  filterType === "percent"
                    ? "bg-background text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Percent className="size-3" />
                Percent
              </button>
              <button
                type="button"
                onClick={() => setFilterType("fixed")}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${
                  filterType === "fixed"
                    ? "bg-background text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <DollarSign className="size-3" />
                Fixed
              </button>
            </div>
          </div>
        </div>

        {/* ── TanStack DataGrid ── */}
        <DataGrid
          data={coupons}
          columns={columns}
          urlSync={true}
          defaultPageSize={10}
          searchPlaceholder="Search coupon code or description..."
        />

        {/* ── Delete Confirmation Dialog ── */}
        <Dialog
          open={!!deletingCoupon}
          onOpenChange={(open) => !open && setDeletingCoupon(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Delete Coupon
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1.5">
                Are you sure you want to permanently delete coupon{" "}
                <span className="font-mono font-bold text-foreground">
                  {deletingCoupon?.code}
                </span>
                ? This action cannot be reversed and existing shoppers will no longer be able to apply it.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 sm:gap-0 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingCoupon(null)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deletingCoupon && handleDeleteCoupon(deletingCoupon.id)}
                className="cursor-pointer text-xs gap-1.5"
              >
                <Trash2 className="size-3.5" />
                Delete Coupon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContent>
  )
}
