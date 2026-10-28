import {
  TicketPercent,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react"

import { useCouponCreate } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
      <div className="max-w-3xl mx-auto pt-2 space-y-5">
        {/* ── Main Form Card ── */}
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-6 sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Coupon Code & Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="coupon-code" className="text-xs font-semibold text-foreground">
                    Coupon Code <span className="text-destructive">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateRandomCode}
                    className="h-7 text-xs text-primary hover:text-primary gap-1 cursor-pointer font-medium"
                  >
                    <Sparkles className="size-3" />
                    Generate Random Code
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="coupon-code"
                    placeholder="e.g. FLASH20, SUMMER2026"
                    value={formData.code}
                    onChange={(e) => handleFieldChange("code", e.target.value)}
                    autoFocus
                    className={`h-9 font-mono uppercase tracking-wider text-xs ${
                      errors.code ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  />
                </div>
                {errors.code ? (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.code}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Customers enter this code at checkout. Capital letters only, no spaces.
                  </p>
                )}
              </div>

              {/* 2. Description */}
              <div className="space-y-1.5">
                <Label htmlFor="coupon-description" className="text-xs font-semibold text-foreground">
                  Description / Marketing Note <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input
                  id="coupon-description"
                  placeholder="e.g. 20% off for weekend flash sale on selected accessories"
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="h-9 text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Internal notes or customer-facing summary describing the discount benefit.
                </p>
              </div>

              {/* 3. Discount Type & Value */}
              <div className="space-y-3 pt-1">
                <Label className="text-xs font-semibold text-foreground">
                  Discount Configuration <span className="text-destructive">*</span>
                </Label>

                {/* Type Selector (Percent vs Fixed) */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFieldChange("discountType", "percent")}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.discountType === "percent"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                        formData.discountType === "percent"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Percent className="size-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-foreground">
                        Percentage Discount
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Deducts a percentage from total (e.g. 15%)
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange("discountType", "fixed")}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.discountType === "fixed"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                        formData.discountType === "fixed"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <DollarSign className="size-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-foreground">
                        Fixed Amount Discount
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Deducts a cash sum (e.g. $50.00)
                      </span>
                    </div>
                  </button>
                </div>

                {/* Value Input */}
                <div className="pt-1">
                  <div className="flex rounded-md border border-input shadow-xs focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
                    <span className="flex select-none items-center rounded-l-md bg-muted/60 px-3 font-semibold text-xs text-muted-foreground border-r border-input">
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
                      className="h-9 border-0 rounded-l-none text-xs focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-semibold"
                    />
                  </div>
                  {errors.discountValue && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive mt-1.5">
                      <AlertCircle className="size-3" />
                      {errors.discountValue}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. Validity Period (Start Date - Expired Date) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground">
                    Promotion Validity Schedule <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    Start Date to Expired Date
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                      Start Date
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleFieldChange("startDate", e.target.value)}
                      className={`h-9 text-xs ${
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

                  {/* Expired Date */}
                  <div className="space-y-1.5">
                    <Label htmlFor="expired-date" className="text-xs text-muted-foreground">
                      Expired Date
                    </Label>
                    <Input
                      id="expired-date"
                      type="date"
                      value={formData.expiredDate}
                      onChange={(e) => handleFieldChange("expiredDate", e.target.value)}
                      className={`h-9 text-xs ${
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
              </div>

              {/* 5. Restrictions (Min Spend & Usage Limit) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="min-spend" className="text-xs font-semibold text-foreground">
                    Minimum Order Spend ($) <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="min-spend"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 50.00"
                    value={formData.minSpend}
                    onChange={(e) => handleFieldChange("minSpend", e.target.value)}
                    className="h-9 text-xs"
                  />
                  {errors.minSpend ? (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.minSpend}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      Leave empty for no minimum spend restriction.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="usage-limit" className="text-xs font-semibold text-foreground">
                    Maximum Total Redemptions <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="usage-limit"
                    type="number"
                    min="1"
                    placeholder="e.g. 500"
                    value={formData.usageLimit}
                    onChange={(e) => handleFieldChange("usageLimit", e.target.value)}
                    className="h-9 text-xs"
                  />
                  {errors.usageLimit ? (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.usageLimit}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      Total number of times this coupon can be redeemed across all customers.
                    </p>
                  )}
                </div>
              </div>

              {/* ── Live Visual Ticket Preview ── */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <TicketPercent className="size-3.5 text-primary" />
                    Live Voucher Preview
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    Customer Preview
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-dashed border-border/80 bg-card">
                  <div className="flex items-center gap-3.5">
                    <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                      {formData.discountType === "percent" ? (
                        <span>{formData.discountValue || "0"}%</span>
                      ) : (
                        <span>${formData.discountValue || "0"}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground">
                          {formData.code || "COUPON-CODE"}
                        </span>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {formData.discountType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formData.description || "Special promotional voucher"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-muted-foreground sm:border-l sm:border-border/60 sm:pl-4">
                    <p className="font-medium text-foreground">
                      Valid: {formData.startDate || "Start"} to {formData.expiredDate || "End"}
                    </p>
                    <p className="text-[11px] mt-0.5">
                      {formData.minSpend ? `Min spend: $${formData.minSpend}` : "No min spend"} •{" "}
                      {formData.usageLimit ? `Limit: ${formData.usageLimit} uses` : "Unlimited uses"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="gap-1.5 cursor-pointer text-xs"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>{isSubmitting ? "Creating..." : "Save Coupon"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
