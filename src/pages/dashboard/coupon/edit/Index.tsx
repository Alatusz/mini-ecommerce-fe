import { Link } from "react-router-dom"
import { Controller } from "react-hook-form"
import {
  Check,
  AlertCircle,
  Loader2,
  Percent,
  DollarSign,
  ArrowLeft,
  Trash2,
} from "lucide-react"

import { useCouponEdit } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardCouponEditPage() {
  const {
    id,
    coupon,
    isNotFound,
    control,
    watchedValues,
    isSubmitting,
    isDeleting,
    handleSubmit,
    handleDelete,
    handleCancel,
  } = useCouponEdit()

  if (isNotFound) {
    return (
      <PageContent>
        <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Coupon Not Found
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{id}</p>
          <div className="mt-4">
            <Link to="/dashboard/coupon">
              <Button
                variant="outline"
                size="sm"
                className="h-8 cursor-pointer gap-1.5 text-xs"
              >
                <ArrowLeft className="size-3.5" />
                Coupons
              </Button>
            </Link>
          </div>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <div className="mx-auto max-w-2xl space-y-4 pt-1">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-mono text-lg font-semibold tracking-tight text-foreground">
              {watchedValues.code || "Edit Coupon"}
            </h1>
          </div>
          <Link to="/dashboard/coupon">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>Coupons</span>
            </Button>
          </Link>
        </div>

        {/* ── Main Form Card ── */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1. Coupon Code */}
              <Controller
                name="code"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="coupon-code"
                      className="text-xs font-medium text-foreground"
                    >
                      Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="coupon-code"
                      placeholder="FLASH20"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.toUpperCase().replace(/\s+/g, "")
                        )
                      }
                      className={`h-9 font-mono text-xs uppercase tracking-wider ${
                        fieldState.invalid
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                    />
                    {fieldState.error?.message && (
                      <p className="flex items-center gap-1 text-[11px] text-destructive">
                        <AlertCircle className="size-3" />
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* 2. Note */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="coupon-description"
                      className="text-xs font-medium text-foreground"
                    >
                      Label{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      {...field}
                      id="coupon-description"
                      placeholder="Weekend flash sale"
                      className="h-9 text-xs"
                    />
                  </div>
                )}
              />

              {/* 3. Discount Type & Value */}
              <div className="space-y-2.5 pt-1">
                <Label className="text-xs font-medium text-foreground">
                  Discount <span className="text-destructive">*</span>
                </Label>

                <Controller
                  name="discountType"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => field.onChange("percent")}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                          field.value === "percent"
                            ? "border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/20"
                            : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Percent className="size-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">
                            Percentage
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          % off
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => field.onChange("fixed")}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                          field.value === "fixed"
                            ? "border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/20"
                            : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="size-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">
                            Fixed Amount
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          $ off
                        </span>
                      </button>
                    </div>
                  )}
                />

                <Controller
                  name="discountValue"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="pt-0.5">
                      <div className="flex rounded-md border border-input shadow-2xs focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
                        <span className="flex select-none items-center rounded-l-md border-r border-input bg-muted/60 px-3 font-mono text-xs font-semibold text-muted-foreground">
                          {watchedValues.discountType === "percent" ? "%" : "$"}
                        </span>
                        <Input
                          {...field}
                          id="coupon-value"
                          type="number"
                          step={
                            watchedValues.discountType === "percent"
                              ? "1"
                              : "0.01"
                          }
                          min="1"
                          max={
                            watchedValues.discountType === "percent"
                              ? "100"
                              : undefined
                          }
                          placeholder={
                            watchedValues.discountType === "percent"
                              ? "15"
                              : "50.00"
                          }
                          className="h-9 rounded-l-none border-0 text-xs font-semibold tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      {fieldState.error?.message && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                          <AlertCircle className="size-3" />
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* 4. Validity Schedule */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="start-date"
                        className="text-xs font-medium text-foreground"
                      >
                        Start Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        {...field}
                        id="start-date"
                        type="date"
                        className={`h-9 text-xs tabular-nums ${
                          fieldState.invalid
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                      />
                      {fieldState.error?.message && (
                        <p className="flex items-center gap-1 text-[11px] text-destructive">
                          <AlertCircle className="size-3" />
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="expiredDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="expired-date"
                        className="text-xs font-medium text-foreground"
                      >
                        End Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        {...field}
                        id="expired-date"
                        type="date"
                        className={`h-9 text-xs tabular-nums ${
                          fieldState.invalid
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                      />
                      {fieldState.error?.message && (
                        <p className="flex items-center gap-1 text-[11px] text-destructive">
                          <AlertCircle className="size-3" />
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* 5. Limits (Min Spend & Usage Cap) */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <Controller
                  name="minSpend"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="min-spend"
                        className="text-xs font-medium text-foreground"
                      >
                        Min Spend ($){" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        {...field}
                        id="min-spend"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="50.00"
                        className="h-9 text-xs tabular-nums"
                      />
                      {fieldState.error?.message && (
                        <p className="flex items-center gap-1 text-[11px] text-destructive">
                          <AlertCircle className="size-3" />
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="usageLimit"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="usage-limit"
                        className="text-xs font-medium text-foreground"
                      >
                        Redemption Cap{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        {...field}
                        id="usage-limit"
                        type="number"
                        min="1"
                        placeholder="500"
                        className="h-9 text-xs tabular-nums"
                      />
                      {fieldState.error?.message && (
                        <p className="flex items-center gap-1 text-[11px] text-destructive">
                          <AlertCircle className="size-3" />
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* ── Compact Summary Bar ── */}
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs tabular-nums">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-foreground">
                    {watchedValues.code || "CODE"}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-medium text-foreground">
                    {watchedValues.discountType === "percent"
                      ? `${watchedValues.discountValue || 0}% off`
                      : `$${watchedValues.discountValue || 0} off`}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {coupon ? `${coupon.usageCount} used` : "0 used"} ·{" "}
                  {watchedValues.usageLimit
                    ? `${watchedValues.usageLimit} cap`
                    : "No cap"}
                </span>
              </div>

              {/* ── Actions ── */}
              <div className="flex items-center justify-between border-t border-border/40 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isSubmitting || isDeleting}
                  className="h-8 cursor-pointer gap-1 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="h-8 cursor-pointer text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="h-8 cursor-pointer gap-1.5 px-3.5 text-xs"
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
