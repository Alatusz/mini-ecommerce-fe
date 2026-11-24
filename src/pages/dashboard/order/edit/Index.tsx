import { Link } from "react-router-dom"
import { Controller } from "react-hook-form"
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  CreditCard,
  Clock,
  XCircle,
  CheckCircle2,
  Package,
  Truck,
  RotateCcw,
  ArrowRight,
  MapPin,
  Phone,
} from "lucide-react"

import {
  useOrderEdit,
  orderSteps,
  type PaymentStatus,
} from "./useHooks"
import {
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "../useHubs"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DashboardOrderEditPage() {
  const {
    id,
    order,
    control,
    isLoading,
    isNotFound,
    isLockedCancelled,
    status,
    currentStepNumber,
    isSubmitting,
    handleStatusChange,
    handleSetStep,
    handleSubmit,
    handleCancel,
  } = useOrderEdit()

  if (isLoading) {
    return (
      <PageContent>
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      </PageContent>
    )
  }

  if (isNotFound || !order) {
    return (
      <PageContent>
        <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Order Not Found
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{id}</p>
          <div className="mt-4">
            <Link to="/dashboard/order">
              <Button
                variant="outline"
                size="sm"
                className="h-8 cursor-pointer gap-1.5 text-xs"
              >
                <ArrowLeft className="size-3.5" />
                Orders
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
        return <Clock className="size-3.5" />
      case 2:
        return <CreditCard className="size-3.5" />
      case 3:
        return <Truck className="size-3.5" />
      case 4:
        return <CheckCircle2 className="size-3.5" />
      default:
        return null
    }
  }

  const activeStepInfo = orderSteps.find((s) => s.step === currentStepNumber)
  const items = order.items ?? []
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)

  const customerName =
    [order.user?.firstName, order.user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "—"

  const initials =
    [order.user?.firstName?.[0], order.user?.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?"

  const paymentMethodLabel =
    PAYMENT_METHOD_OPTIONS.find((m) => m.id === order.paymentMethod)?.label ||
    order.paymentMethod ||
    "—"

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

  return (
    <PageContent>
      <div className="mx-auto max-w-3xl space-y-4 pt-1">
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-mono text-lg font-semibold tracking-tight tabular-nums text-foreground">
              #{order.id}
            </h1>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
          <Link to="/dashboard/order">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>Orders</span>
            </Button>
          </Link>
        </div>

        {/* ── Main Stepper & Details Card ── */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── Stepper ── */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-6">
                <div className="mx-auto w-full max-w-xl">
                  <div className="relative flex w-full items-start">
                    {orderSteps.map((s, idx) => {
                      const isCurrent =
                        currentStepNumber === s.step && status !== "cancelled"
                      const isActive =
                        currentStepNumber >= s.step && status !== "cancelled"
                      const isLineActive =
                        currentStepNumber > s.step && status !== "cancelled"

                      return (
                        <div
                          key={s.step}
                          className="group relative flex flex-1 flex-col items-center"
                        >
                          {idx < orderSteps.length - 1 && (
                            <div
                              className={`pointer-events-none absolute top-4 z-0 h-[2px] transition-all duration-300 ${
                                isLineActive ? "bg-foreground" : "bg-border"
                              }`}
                              style={{
                                left: "calc(50% + 22px)",
                                right: "calc(-50% + 22px)",
                              }}
                            />
                          )}

                          <button
                            type="button"
                            disabled={isLockedCancelled}
                            onClick={() => handleSetStep(s.step)}
                            className={`relative z-10 flex size-8 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-all ${
                              isLockedCancelled
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            } ${
                              isActive
                                ? isCurrent
                                  ? "bg-foreground text-background ring-4 ring-foreground/15"
                                  : "bg-foreground text-background"
                                : "border border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                            }`}
                            title={`${s.step}. ${s.label}`}
                          >
                            {s.step}
                          </button>

                          <button
                            type="button"
                            disabled={isLockedCancelled}
                            onClick={() => handleSetStep(s.step)}
                            className={`mt-2.5 flex flex-col items-center text-center focus:outline-none ${
                              isLockedCancelled
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            <span
                              className={`text-xs transition-colors ${
                                isActive
                                  ? "font-semibold text-foreground"
                                  : "font-medium text-muted-foreground"
                              }`}
                            >
                              {s.label}
                            </span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* ── Active Step / Quick Action Bar ── */}
              {status === "cancelled" ? (
                <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-700 dark:text-red-300">
                  <div className="flex items-center gap-2 font-medium">
                    <XCircle className="size-4 shrink-0" />
                    <span>Cancelled · Voided</span>
                  </div>
                  {!isLockedCancelled && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetStep(1)}
                      className="h-7 shrink-0 cursor-pointer gap-1.5 text-xs"
                    >
                      <RotateCcw className="size-3" />
                      <span>Restore</span>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      {getStepIcon(currentStepNumber)}
                    </div>
                    <span className="font-medium text-foreground">
                      Step {currentStepNumber}/4 · {activeStepInfo?.label}
                    </span>
                    <span className="text-muted-foreground">
                      · {activeStepInfo?.subLabel}
                    </span>
                  </div>

                  {currentStepNumber < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetStep(currentStepNumber + 1)}
                      className="h-7 shrink-0 cursor-pointer gap-1.5 text-xs"
                    >
                      <span>Step {currentStepNumber + 1}</span>
                      <ArrowRight className="size-3" />
                    </Button>
                  )}
                </div>
              )}

              {/* ── Order Facts Grid ── */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Summary */}
                <div className="space-y-2 rounded-lg border border-border/60 bg-card p-3.5 text-xs">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Order Summary
                  </span>
                  <div className="space-y-1 pt-0.5 tabular-nums">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium text-foreground">
                        {totalUnits} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-semibold text-foreground">
                        ฿
                        {Number(order.totalAmount ?? 0).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer & Shipping */}
                <div className="space-y-2 rounded-lg border border-border/60 bg-card p-3.5 text-xs">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Customer & Shipping
                  </span>
                  <div className="flex items-center gap-2.5 pt-0.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-foreground">
                        {customerName}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {order.user?.email || "—"}
                      </div>
                    </div>
                  </div>
                  {(order.shippingPhone || order.user?.phone) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Phone className="size-3 shrink-0" />
                      <span>{order.shippingPhone || order.user?.phone}</span>
                    </div>
                  )}
                  {order.shippingAddress && (
                    <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <MapPin className="mt-0.5 size-3 shrink-0" />
                      <span className="line-clamp-2">
                        {order.shippingAddress}
                      </span>
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="space-y-2 rounded-lg border border-border/60 bg-card p-3.5 text-xs">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Payment
                  </span>
                  <div className="space-y-2 pt-0.5">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <CreditCard className="size-3.5 text-muted-foreground" />
                      <span>{paymentMethodLabel}</span>
                    </div>
                    <Controller
                      name="paymentStatus"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(val) =>
                            field.onChange(val as PaymentStatus)
                          }
                        >
                          <SelectTrigger className="h-7 w-full cursor-pointer text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_STATUS_OPTIONS.map((opt) => (
                              <SelectItem
                                key={opt.id}
                                value={opt.id}
                                className="cursor-pointer text-xs"
                              >
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* ── Order Items ── */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-foreground">
                  Items ({items.length})
                </span>
                <div className="divide-y divide-border/60 rounded-lg border border-border/60">
                  {items.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      No items found
                    </div>
                  ) : (
                    items.map((item) => {
                      const lineTotal =
                        Number(item.price ?? 0) * Number(item.quantity ?? 0)
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {item.product?.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="size-9 shrink-0 rounded-md border border-border/60 object-cover"
                              />
                            ) : (
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted text-muted-foreground">
                                <Package className="size-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="truncate font-medium text-foreground">
                                {item.product?.name || item.productId}
                              </div>
                              <div className="text-[11px] text-muted-foreground tabular-nums">
                                ฿{Number(item.price ?? 0).toLocaleString()} ×{" "}
                                {item.quantity}
                              </div>
                            </div>
                          </div>
                          <span className="shrink-0 font-semibold text-foreground tabular-nums">
                            ฿
                            {lineTotal.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* ── Stage Selector ── */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-medium text-foreground">
                  Stage
                </span>
                <div className="grid grid-cols-2 gap-2.5 pt-0.5 sm:grid-cols-4">
                  {orderSteps.map((s) => {
                    const selected = status === s.key
                    return (
                      <button
                        key={s.step}
                        type="button"
                        disabled={isLockedCancelled}
                        onClick={() => handleSetStep(s.step)}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                          isLockedCancelled
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer"
                        } ${
                          selected
                            ? "border-primary/40 bg-primary/5 font-medium text-foreground ring-1 ring-primary/20"
                            : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        }`}
                      >
                        <span className="truncate">{s.label}</span>
                        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                          #{s.step}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Bottom Action Footer ── */}
              <div className="flex items-center justify-between border-t border-border/40 pt-4">
                <div>
                  {status !== "cancelled" && !isLockedCancelled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange("cancelled")}
                      disabled={isSubmitting}
                      className="h-8 cursor-pointer gap-1 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <XCircle className="size-3.5" />
                      <span>Cancel Order</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="h-8 cursor-pointer text-xs"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="h-8 cursor-pointer gap-1.5 bg-foreground px-3.5 text-xs text-background hover:bg-foreground/90"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Check className="size-3.5" />
                    )}
                    <span>{isSubmitting ? "Saving..." : "Save"}</span>
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
