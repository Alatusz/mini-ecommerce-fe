/**
 * Coupons & Promotions — Unslop Redesign (dashboard-design skill)
 * Question: "Which promotions are active and how close are they to redemption limits?"
 * - Wordless: compact numeric facts in header & KPI cards; zero prose sentences.
 * - Quiet & Salience: monochrome KPI icons, slim 3px share bars, warm amber/red near quota limits.
 */
import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  TicketPercent,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  TrendingUp,
  Tag,
  MoreHorizontal,
} from "lucide-react"

import {
  DataGrid,
  createColumnHelper,
  type DataGridFeatures,
} from "@/components/common/data-grid"
import { useCoupon } from "./useHooks"
import type { CouponItem } from "./common/mockCoupon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        )
      case "Scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-[#3e63dd]" />
            Scheduled
          </span>
        )
      case "Expired":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Expired
          </span>
        )
    }
  }

  const columns = useMemo(
    () => [
      couponColumnHelper.accessor("code", {
        header: "Code",
        cell: (info) => {
          const code = info.getValue()
          const isCopied = copiedCode === code

          return (
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/70 text-muted-foreground">
                <TicketPercent className="size-3.5" />
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-semibold tracking-wide text-foreground">
                    {code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(code)}
                    className="cursor-pointer rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                    title={isCopied ? "Copied" : "Copy code"}
                  >
                    {isCopied ? (
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
                {info.row.original.description && (
                  <span className="max-w-[220px] truncate text-[11px] text-muted-foreground">
                    {info.row.original.description}
                  </span>
                )}
              </div>
            </div>
          )
        },
      }),
      couponColumnHelper.accessor("discountType", {
        header: "Value",
        cell: (info) => {
          const type = info.getValue()
          const val = info.row.original.discountValue

          return (
            <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
              {type === "percent" ? `${val}% off` : `$${val.toFixed(2)} off`}
            </span>
          )
        },
      }),
      couponColumnHelper.display({
        id: "validityPeriod",
        header: "Window",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
            <span>{row.original.startDate}</span>
            <span>→</span>
            <span>{row.original.expiredDate}</span>
          </div>
        ),
      }),
      couponColumnHelper.accessor("minSpend", {
        header: "Min Spend",
        cell: (info) => {
          const min = info.getValue()
          return (
            <span className="text-xs font-medium tabular-nums text-foreground">
              {min && min > 0 ? `$${min.toFixed(2)}` : "—"}
            </span>
          )
        },
      }),
      couponColumnHelper.accessor("usageCount", {
        header: "Redemptions",
        cell: (info) => {
          const count = info.getValue()
          const limit = info.row.original.usageLimit

          return (
            <span className="text-xs font-medium tabular-nums text-foreground">
              {count} {limit ? `/ ${limit}` : "(no cap)"}
            </span>
          )
        },
      }),
      couponColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => getStatusBadge(info.getValue()),
      }),
      couponColumnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
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
                <DropdownMenuItem
                  onClick={() => handleCopyCode(row.original.code)}
                  className="cursor-pointer gap-2"
                >
                  <Copy className="size-3.5 text-muted-foreground" />
                  <span>Copy Code</span>
                </DropdownMenuItem>
                <Link to={`/dashboard/coupon/edit/${row.original.id}`}>
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <Pencil className="size-3.5 text-muted-foreground" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeletingCoupon(row.original)}
                  className="cursor-pointer gap-2"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [copiedCode, handleCopyCode, setDeletingCoupon]
  )

  return (
    <PageContent>
      {/* ── Header & Toolbar ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Coupons
          </h1>
        </div>

        <Link to="/dashboard/coupon/create">
          <Button
            size="sm"
            className="h-8 shrink-0 cursor-pointer gap-1.5 rounded-full bg-foreground px-3.5 text-xs text-background hover:bg-foreground/90"
          >
            <Plus className="size-3.5" />
            <span>Create Coupon</span>
          </Button>
        </Link>
      </div>

      {/* ── 4 KPI Cards (Monochrome Icons + Tabular Numbers) ── */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total Vouchers
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <Tag className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {stats.total}
            </div>
            <div className="mt-1 text-xs tabular-nums text-muted-foreground">
              {stats.expired} expired
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Active
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <CheckCircle2 className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {stats.active}
            </div>
            <div className="mt-1 text-xs tabular-nums text-muted-foreground">
              redeemable now
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Scheduled
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <Clock className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {stats.scheduled}
            </div>
            <div className="mt-1 text-xs tabular-nums text-muted-foreground">
              upcoming
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Redemptions
            </span>
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/70">
              <TrendingUp className="size-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="pt-2.5">
            <div className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {stats.totalRedemptions.toLocaleString()}
            </div>
            <div className="mt-1 text-xs tabular-nums text-muted-foreground">
              all campaigns
            </div>
          </div>
        </Card>
      </div>

      {/* ── Calm Segmented Filter Bar ── */}
      <div className="flex items-center justify-between gap-3">
        {/* Segmented Status Tabs */}
        <div className="inline-flex items-center rounded-lg border border-border/60 bg-card p-0.5">
          {(["All", "Active", "Scheduled", "Expired"] as const).map((st) => {
            const count =
              st === "All"
                ? rawCoupons.length
                : st === "Active"
                  ? stats.active
                  : st === "Scheduled"
                    ? stats.scheduled
                    : stats.expired
            return (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-xs tabular-nums transition-all ${
                  filterStatus === st
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st} · {count}
              </button>
            )
          })}
        </div>

        {/* Segmented Type Filter */}
        <div className="inline-flex items-center rounded-lg border border-border/60 bg-card p-0.5">
          {(
            [
              { key: "All", label: "All Types" },
              { key: "percent", label: "% Off" },
              { key: "fixed", label: "$ Fixed" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilterType(item.key)}
              className={`cursor-pointer rounded-md px-2.5 py-1 text-xs transition-all ${
                filterType === item.key
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TanStack DataGrid ── */}
      <DataGrid
        data={coupons}
        columns={columns}
        urlSync={true}
        defaultPageSize={10}
        searchPlaceholder="Search coupon code..."
      />

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog
        open={!!deletingCoupon}
        onOpenChange={(open) => !open && setDeletingCoupon(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Remove{" "}
              <span className="font-mono font-semibold text-foreground">
                {deletingCoupon?.code}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
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
              onClick={() =>
                deletingCoupon && handleDeleteCoupon(deletingCoupon.id)
              }
              className="cursor-pointer gap-1.5 text-xs"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContent>
  )
}
