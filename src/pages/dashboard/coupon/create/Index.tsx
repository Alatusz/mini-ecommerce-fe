/**
 * Create Coupon — Unslop Redesign (dashboard-design skill)
 * - Wordless: crisp labels & tabular inputs; zero filler sentences.
 * - Selection: soft tinted fill with faint ring.
 */
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Percent,
  DollarSign,
} from "lucide-react"

import { useCouponCreate } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardCouponCreatePage() {
  const {
    formData,
    errors,
    isSubmitting,
    generateRandomCode,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  } = useCouponCreate()

  return (
    <PageContent>
      <div className="mx-auto max-w-2xl space-y-4 pt-1">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              New Coupon
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
              {/* 1. Coupon Code & Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="coupon-code" className="text-xs font-medium text-foreground">
                    Code <span className="text-destructive">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateRandomCode}
                    className="h-6 cursor-pointer gap-1 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Sparkles className="size-3" />
                    Generate
                  </Button>
                </div>
                <Input
                  id="coupon-code"
                  placeholder="FLASH20"
                  value={formData.code}
                  onChange={(e) => handleFieldChange("code", e.target.value)}
                  autoFocus
                  className={`h-9 font-mono text-xs uppercase tracking-wider ${
                    errors.code ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                {errors.code && (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.code}
                  </p>
                )}
              </div>

              {/* 2. Note */}
              <div className="space-y-1.5">
                <Label htmlFor="coupon-description" className="text-xs font-medium text-foreground">
                  Label <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="coupon-description"
                  placeholder="Weekend flash sale"
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* 3. Discount Type & Value */}
              <div className="space-y-2.5 pt-1">
                <Label className="text-xs font-medium text-foreground">
                  Discount <span className="text-destructive">*</span>
                </Label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFieldChange("discountType", "percent")}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                      formData.discountType === "percent"
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
                    onClick={() => handleFieldChange("discountType", "fixed")}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                      formData.discountType === "fixed"
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

                {/* Value Input */}
                <div className="pt-0.5">
                  <div className="flex rounded-md border border-input shadow-2xs focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
                    <span className="flex select-none items-center rounded-l-md border-r border-input bg-muted/60 px-3 font-mono text-xs font-semibold text-muted-foreground">
                      {formData.discountType === "percent" ? "%" : "$"}
                    </span>
                    <Input
                      id="coupon-value"
                      type="number"
                      step={formData.discountType === "percent" ? "1" : "0.01"}
                      min="1"
                      max={formData.discountType === "percent" ? "100" : undefined}
                      placeholder={formData.discountType === "percent" ? "15" : "50.00"}
                      value={formData.discountValue}
                      onChange={(e) => handleFieldChange("discountValue", e.target.value)}
                      className="h-9 rounded-l-none border-0 text-xs font-semibold tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  {errors.discountValue && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.discountValue}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. Validity Schedule */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="start-date" className="text-xs font-medium text-foreground">
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleFieldChange("startDate", e.target.value)}
                    className={`h-9 text-xs tabular-nums ${
                      errors.startDate ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  />
                  {errors.startDate && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expired-date" className="text-xs font-medium text-foreground">
                    End Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="expired-date"
                    type="date"
                    value={formData.expiredDate}
                    onChange={(e) => handleFieldChange("expiredDate", e.target.value)}
                    className={`h-9 text-xs tabular-nums ${
                      errors.expiredDate ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  />
                  {errors.expiredDate && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.expiredDate}
                    </p>
                  )}
                </div>
              </div>

              {/* 5. Limits (Min Spend & Usage Cap) */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="min-spend" className="text-xs font-medium text-foreground">
                    Min Spend ($) <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="min-spend"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="50.00"
                    value={formData.minSpend}
                    onChange={(e) => handleFieldChange("minSpend", e.target.value)}
                    className="h-9 text-xs tabular-nums"
                  />
                  {errors.minSpend && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.minSpend}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="usage-limit" className="text-xs font-medium text-foreground">
                    Redemption Cap <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="usage-limit"
                    type="number"
                    min="1"
                    placeholder="500"
                    value={formData.usageLimit}
                    onChange={(e) => handleFieldChange("usageLimit", e.target.value)}
                    className="h-9 text-xs tabular-nums"
                  />
                  {errors.usageLimit && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.usageLimit}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Compact Summary Bar ── */}
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs tabular-nums">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-foreground">
                    {formData.code || "CODE"}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-medium text-foreground">
                    {formData.discountType === "percent"
                      ? `${formData.discountValue || 0}% off`
                      : `$${formData.discountValue || 0} off`}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {formData.minSpend ? `Min $${formData.minSpend}` : "No min"} ·{" "}
                  {formData.usageLimit ? `${formData.usageLimit} cap` : "No cap"}
                </span>
              </div>

              {/* ── Actions ── */}
              <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-4">
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
                  className="h-8 cursor-pointer gap-1.5 bg-foreground px-3.5 text-xs text-background hover:bg-foreground/90"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>{isSubmitting ? "Saving..." : "Create"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
