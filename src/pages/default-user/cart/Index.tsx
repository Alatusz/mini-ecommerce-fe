import { Link } from "react-router-dom"
import { X, ShoppingBag } from "lucide-react"

import { useCart } from "./useHooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function CartPage() {
  const {
    cartItems,
    promoCode,
    bonusCard,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    isCheckingOut,
    setPromoCode,
    setBonusCard,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    handleApplyBonusCard,
    handleApplyPromoCode,
    handleCheckout,
  } = useCart()

  return (
    <div className="mx-auto max-w-6xl py-6 sm:py-10 px-2 sm:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left: Shopping Cart Items List (7 cols) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6">
            Shopping Cart
          </h1>

          {cartItems.length > 0 ? (
            <div className="divide-y divide-border/40">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Product Thumbnail & Details */}
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <div className="size-20 sm:size-24 rounded-xl bg-[#f9f9f9] dark:bg-zinc-900 p-2 shrink-0 flex items-center justify-center border border-border/40">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain select-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                        {item.name}
                      </h3>
                      <span className="text-xs text-muted-foreground font-mono">
                        {item.sku}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Price & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-7 shrink-0 pl-24 sm:pl-0">
                    {/* Quantity Selector: − [ 1 ] + */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="text-muted-foreground hover:text-foreground text-lg px-1 cursor-pointer transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <div className="size-8 rounded-md border border-border/60 flex items-center justify-center text-xs font-semibold text-foreground bg-background select-none">
                        {item.quantity}
                      </div>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="text-muted-foreground hover:text-foreground text-lg px-1 cursor-pointer transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-base sm:text-lg font-bold text-foreground min-w-[70px] text-right">
                      ${item.price * item.quantity}
                    </div>

                    {/* Remove Item */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-foreground p-1 cursor-pointer transition-colors"
                      aria-label="Remove item"
                    >
                      <X className="size-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
              <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <ShoppingBag className="size-6 text-muted-foreground" />
              </div>
              <p className="text-base font-semibold text-foreground">
                Your cart is empty
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Explore our tech products and add items to your cart.
              </p>
              <Link to="/" className="mt-4">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right: Order Summary Card (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Order Summary
            </h2>

            {/* Discount / Promo code Input */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Discount code / Promo code
              </label>
              <div className="relative">
                <Input
                  placeholder="Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="h-11 text-xs sm:text-sm bg-background rounded-lg border-border/60 pr-20"
                />
                {promoCode.trim() && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyPromoCode}
                    className="absolute right-1.5 top-1.5 h-8 px-3 text-xs rounded-md border-border/60 cursor-pointer"
                  >
                    Apply
                  </Button>
                )}
              </div>
            </div>

            {/* Bonus Card Input */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Your bonus card number
              </label>
              <div className="relative">
                <Input
                  placeholder="Enter Card Number"
                  value={bonusCard}
                  onChange={(e) => setBonusCard(e.target.value)}
                  className="h-11 text-xs sm:text-sm bg-background rounded-lg border-border/60 pr-20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApplyBonusCard}
                  className="absolute right-1.5 top-1.5 h-8 px-3 text-xs rounded-md border-border/60 cursor-pointer"
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="flex flex-col gap-3 pt-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Subtotal</span>
                <span className="font-bold text-foreground">${subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-${discount}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Estimated Tax</span>
                <span>${tax}</span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Estimated shipping & Handling</span>
                <span>${shipping}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40 text-sm sm:text-base">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-foreground text-lg sm:text-xl">
                  ${total}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isCheckingOut}
              className="w-full h-12 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
