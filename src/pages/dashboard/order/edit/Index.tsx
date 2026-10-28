import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  Calendar,
  CreditCard,
  Hash,
  Clock,
  XCircle,
  CheckCircle2,
  Package,
  Truck,
  RotateCcw,
  ArrowRight,
} from "lucide-react"

import { useOrderEdit, orderSteps } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardOrderEditPage() {
  const {
    id,
    order,
    isNotFound,
    status,
    currentStepNumber,
    isSubmitting,
    handleStatusChange,
    handleSetStep,
    handleSubmit,
    handleCancel,
  } = useOrderEdit()

  if (isNotFound) {
    return (
      <PageContent>
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Order Not Found
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            The record with ID <code className="font-mono font-semibold">{id}</code> could not be found.
          </p>
          <div className="mt-5">
            <Link to="/dashboard/order">
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer text-xs">
                <ArrowLeft className="size-3.5" />
                Return to Orders
              </Button>
            </Link>
          </div>
        </div>
      </PageContent>
    )
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Clock className="size-4" />
      case 2:
        return <Package className="size-4" />
      case 3:
        return <Truck className="size-4" />
      case 4:
        return <CheckCircle2 className="size-4" />
      default:
        return null
    }
  }

  const activeStepInfo = orderSteps.find((s) => s.step === currentStepNumber)

  return (
    <PageContent>
      <div className="max-w-3xl mx-auto pt-2 space-y-5">
        {/* ── Main Stepper & Details Card ── */}
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-6 sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── Header: Order ID & Status Badge ── */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    <Hash className="size-4" />
                  </div>
                  <div>
                    <h2 className="font-mono text-base font-bold text-foreground">
                      {order?.orderNumber}
                    </h2>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Calendar className="size-3 text-muted-foreground" />
                      Placed on {order?.date}
                    </p>
                  </div>
                </div>

                <div>
                  {status === "Cancelled" ? (
                    <Badge
                      variant="outline"
                      className="border-red-500/30 bg-red-50 text-[11px] font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300 px-2.5 py-1"
                    >
                      <XCircle className="mr-1 size-3" />
                      Order Cancelled
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/10 text-[11px] font-semibold text-foreground px-2.5 py-1"
                    >
                      Step {currentStepNumber} of 4 • {status}
                    </Badge>
                  )}
                </div>
              </div>

              {/* ── Stepper matching the attached reference design ── */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
                <div className="w-full max-w-xl mx-auto">
                  <div className="flex items-start w-full relative">
                    {orderSteps.map((s, idx) => {
                      const isCurrent = currentStepNumber === s.step && status !== "Cancelled"
                      const isActive = currentStepNumber >= s.step && status !== "Cancelled"
                      const isLineActive = currentStepNumber > s.step && status !== "Cancelled"

                      return (
                        <div key={s.step} className="flex-1 flex flex-col items-center relative group">
                          {/* Connecting Horizontal Line to Next Step */}
                          {idx < orderSteps.length - 1 && (
                            <div
                              className={`absolute top-5 h-[2px] transition-all duration-300 pointer-events-none z-0 ${
                                isLineActive ? "bg-primary" : "bg-border/80"
                              }`}
                              style={{
                                left: "calc(50% + 28px)",
                                right: "calc(-50% + 28px)",
                              }}
                            />
                          )}

                          {/* Step Circle Button */}
                          <button
                            type="button"
                            onClick={() => handleSetStep(s.step)}
                            className={`relative z-10 size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 cursor-pointer ${
                              isActive
                                ? isCurrent
                                  ? "bg-primary text-primary-foreground shadow-xs ring-4 ring-primary/15 scale-105"
                                  : "bg-primary text-primary-foreground shadow-xs hover:scale-105"
                                : "bg-card text-muted-foreground/80 border-2 border-border/80 hover:border-foreground/40 hover:text-foreground hover:scale-105"
                            }`}
                            title={`Set status to Step ${s.step}: ${s.label}`}
                          >
                            {s.step}
                          </button>

                          {/* Step Label (matching "Step X" from reference) */}
                          <button
                            type="button"
                            onClick={() => handleSetStep(s.step)}
                            className="mt-3 flex flex-col items-center cursor-pointer text-center focus:outline-none group/label"
                          >
                            <span
                              className={`text-xs sm:text-sm transition-colors ${
                                isActive
                                  ? "font-bold text-foreground"
                                  : "font-medium text-muted-foreground group-hover/label:text-foreground"
                              }`}
                            >
                              Step {s.step}
                            </span>
                            <span className="text-[11px] text-muted-foreground/80 mt-0.5 font-normal">
                              {s.label}
                            </span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* ── Active Step Banner / Quick Action ── */}
              {status === "Cancelled" ? (
                <div className="rounded-lg border border-red-500/30 bg-red-50/50 dark:bg-red-950/20 p-3.5 flex items-center justify-between text-xs text-red-700 dark:text-red-300">
                  <div className="flex items-center gap-2">
                    <XCircle className="size-4 shrink-0" />
                    <span>
                      <strong>Order is Cancelled:</strong> This transaction has been voided or refunded.
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetStep(1)}
                    className="gap-1.5 text-xs border-red-300 dark:border-red-800 text-foreground cursor-pointer shrink-0"
                  >
                    <RotateCcw className="size-3" />
                    <span>Restore to Step 1</span>
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {getStepIcon(currentStepNumber)}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        Step {currentStepNumber}: {activeStepInfo?.label} — {activeStepInfo?.subLabel}
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {activeStepInfo?.description}
                      </p>
                    </div>
                  </div>

                  {currentStepNumber < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetStep(currentStepNumber + 1)}
                      className="gap-1.5 text-xs cursor-pointer shrink-0 ml-2"
                    >
                      <span>Advance to Step {currentStepNumber + 1}</span>
                      <ArrowRight className="size-3" />
                    </Button>
                  )}
                </div>
              )}

              {/* ── 4 Numbered Step Information Panels (Read-Only) ── */}
              <div className="space-y-3 pt-1">
                {/* Step 1 Panel: Order Placement & Items */}
                <div className="rounded-lg border border-border/60 p-4 bg-card space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-muted font-bold text-[10px]">
                        1
                      </span>
                      Order Placement & Items
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {order?.itemsCount} items
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Order Number</span>
                      <span className="font-mono font-semibold text-foreground">{order?.orderNumber}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Placed Timestamp</span>
                      <span className="font-medium text-foreground">{order?.date}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Purchased Quantity</span>
                      <span className="font-medium text-foreground">{order?.itemsCount} units</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Total Amount</span>
                      <span className="font-bold text-base text-foreground">${(order?.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 Panel: Customer Information */}
                <div className="rounded-lg border border-border/60 p-4 bg-card space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-muted font-bold text-[10px]">
                        2
                      </span>
                      Customer Profile & Contact
                    </span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-xs text-foreground border border-border/60">
                      {order?.customer.avatar}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-xs">
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Customer Name</span>
                        <span className="font-semibold text-foreground">{order?.customer.name}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Email Address</span>
                        <span className="font-medium text-foreground">{order?.customer.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 Panel: Payment & Billing */}
                <div className="rounded-lg border border-border/60 p-4 bg-card space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-muted font-bold text-[10px]">
                        3
                      </span>
                      Payment & Billing
                    </span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px]">
                      Verified
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Payment Gateway</span>
                      <span className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                        <CreditCard className="size-3.5 text-primary" />
                        {order?.paymentMethod}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Billing Status</span>
                      <span className="font-medium text-foreground">Paid in Full</span>
                    </div>
                  </div>
                </div>

                {/* Step 4 Panel: Status Stage Controller */}
                <div className="rounded-lg border border-border/60 p-4 bg-card space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-muted font-bold text-[10px]">
                        4
                      </span>
                      Fulfillment Status Selection
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Click any step above or select below
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {orderSteps.map((s) => (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => handleSetStep(s.step)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          status === s.key
                            ? "border-primary bg-primary/10 ring-1 ring-primary/20 text-foreground font-semibold"
                            : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground text-xs"
                        }`}
                      >
                        <span className="flex size-4 items-center justify-center rounded-full bg-muted font-bold text-[9px] shrink-0">
                          {s.step}
                        </span>
                        <span className="text-xs truncate">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Bottom Action Footer ── */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div>
                  {status !== "Cancelled" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange("Cancelled")}
                      disabled={isSubmitting}
                      className="cursor-pointer text-xs text-muted-foreground hover:text-destructive gap-1"
                    >
                      <XCircle className="size-3.5" />
                      <span>Cancel Order</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="cursor-pointer text-xs"
                  >
                    Back to Orders
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer text-xs"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Check className="size-3.5" />
                    )}
                    <span>{isSubmitting ? "Saving..." : "Update Status"}</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
