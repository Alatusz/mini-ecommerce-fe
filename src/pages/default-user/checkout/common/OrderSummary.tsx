import { Lock, TicketPercent, X } from "lucide-react"
import { FALLBACK_IMAGE } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { type CheckoutCartItem } from "../useHooks"

interface OrderSummaryProps {
  currentStep: 1 | 2
  cartItems: CheckoutCartItem[]
  couponInput: string
  onCouponInputChange: (val: string) => void
  appliedCoupon: { couponCode: string; discountAmount: number } | null
  isValidatingCoupon: boolean
  onApplyCoupon: () => void
  onRemoveCoupon: () => void
  subtotal: number
  discountAmount: number
  shippingCost: number
  total: number
  isProcessing: boolean
  onNext: () => void
  onBack: () => void
}

export function OrderSummary({
  currentStep,
  cartItems,
  couponInput,
  onCouponInputChange,
  appliedCoupon,
  isValidatingCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  subtotal,
  discountAmount,
  shippingCost,
  total,
  isProcessing,
  onNext,
  onBack,
}: OrderSummaryProps) {
  return (
    <aside className="lg:col-span-5 space-y-5 pt-1">
      <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
        Your Cart
      </h2>

      {/* Cart Items */}
      <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
        {cartItems.map((item) => {
          const unitPrice = Number(item.product?.sellPrice ?? 0)
          const imgSrc = item.product?.images?.[0] || FALLBACK_IMAGE

          return (
            <div key={item.id} className="flex items-center gap-3.5">
              <div className="size-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-card">
                <img
                  src={imgSrc}
                  alt={item.product?.name || "Product"}
                  className="size-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.product?.name}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  ฿{unitPrice.toLocaleString()} x {item.quantity}
                </p>
              </div>

              <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                ฿{(unitPrice * item.quantity).toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>

      {/* Discount Code Bar */}
      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs">
          <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
            <TicketPercent className="size-4" />
            <span>
              {appliedCoupon.couponCode} (-฿{discountAmount.toLocaleString()})
            </span>
          </div>
          <button
            type="button"
            onClick={onRemoveCoupon}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Remove discount code"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-1.5 shadow-2xs">
          <TicketPercent className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={couponInput}
            onChange={(e) => onCouponInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                if (couponInput.trim() && !isValidatingCoupon) {
                  onApplyCoupon()
                }
              }
            }}
            placeholder="Discount code"
            aria-label="Discount code"
            className="h-8 w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none uppercase"
          />
          <button
            type="button"
            disabled={isValidatingCoupon || !couponInput.trim()}
            onClick={onApplyCoupon}
            className="shrink-0 px-2.5 py-1 text-xs font-semibold text-foreground transition-opacity hover:opacity-75 disabled:opacity-40 cursor-pointer"
          >
            {isValidatingCoupon ? "..." : "Apply"}
          </button>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-medium text-foreground tabular-nums">
            ฿{subtotal.toLocaleString()}
          </span>
        </div>

        <div
          className={`flex items-center justify-between ${
            discountAmount > 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground"
          }`}
        >
          <span>
            Coupon{appliedCoupon ? ` (${appliedCoupon.couponCode})` : ""}
          </span>
          <span
            className={`font-medium tabular-nums ${
              discountAmount > 0 ? "" : "text-foreground"
            }`}
          >
            {discountAmount > 0
              ? `-฿${discountAmount.toLocaleString()}`
              : "฿0"}
          </span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span>Shipping</span>
          <span className="font-medium text-foreground tabular-nums">
            {shippingCost === 0 ? "฿0" : `฿${shippingCost.toLocaleString()}`}
          </span>
        </div>

        <div className="flex items-baseline justify-between border-t border-border/60 pt-3.5">
          <span className="text-base font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-foreground tabular-nums">
            ฿{total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="space-y-2.5">
        <Button
          type="button"
          onClick={onNext}
          disabled={isProcessing}
          className="h-12 w-full gap-2 rounded-xl text-sm font-semibold cursor-pointer"
        >
          {currentStep === 2 && !isProcessing && <Lock className="size-3.5" />}
          <span>
            {isProcessing
              ? "Processing..."
              : currentStep === 1
                ? "Continue to Payment"
                : `Pay ฿${total.toLocaleString()}`}
          </span>
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-1.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          {currentStep === 1 ? "Back to Products" : "Back to Shipping"}
        </button>
      </div>
    </aside>
  )
}
