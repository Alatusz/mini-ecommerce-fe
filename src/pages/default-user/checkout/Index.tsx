import { Link } from "react-router-dom"
import {
  MapPin,
  Truck,
  CreditCard,
  Plus,
  Pencil,
  X,
  CheckCircle2,
  Check,
  ShieldCheck,
} from "lucide-react"

import { useCheckout } from "./useHooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

function CheckoutPage() {
  const {
    currentStep,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddAddressOpen,
    setIsAddAddressOpen,
    editingAddressId,
    addressForm,
    setAddressForm,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
    shippingOptions,
    selectedShippingId,
    setSelectedShippingId,
    paymentMethod,
    setPaymentMethod,
    cardForm,
    setCardForm,
    isOrderCompleted,
    isProcessing,
    handleNext,
    handleBack,
    selectedAddress,
    selectedShipping,
    subtotal,
    shippingCost,
    tax,
    total,
  } = useCheckout()

  return (
    <div className="mx-auto max-w-5xl py-8 sm:py-12 px-4 sm:px-6">
      {/* ── Stepper Navigation ── */}
      <div className="mb-12 sm:mb-16">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* Step 1: Address */}
          <div className="flex items-center gap-3">
            <div
              className={`size-10 rounded-full flex items-center justify-center transition-colors ${
                currentStep >= 1
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > 1 ? (
                <Check className="size-5" />
              ) : (
                <MapPin className="size-5" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                Step 1
              </span>
              <span
                className={`text-sm sm:text-base font-bold ${
                  currentStep >= 1 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Address
              </span>
            </div>
          </div>

          {/* Dotted Line connector */}
          <div className="flex-1 border-t border-dashed border-zinc-300 dark:border-zinc-700 mx-4 sm:mx-8" />

          {/* Step 2: Shipping */}
          <div className="flex items-center gap-3">
            <div
              className={`size-10 rounded-full flex items-center justify-center transition-colors ${
                currentStep >= 2
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > 2 ? (
                <Check className="size-5" />
              ) : (
                <Truck className="size-5" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                Step 2
              </span>
              <span
                className={`text-sm sm:text-base font-bold ${
                  currentStep >= 2 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Shipping
              </span>
            </div>
          </div>

          {/* Dotted Line connector */}
          <div className="flex-1 border-t border-dashed border-zinc-300 dark:border-zinc-700 mx-4 sm:mx-8" />

          {/* Step 3: Payment */}
          <div className="flex items-center gap-3">
            <div
              className={`size-10 rounded-full flex items-center justify-center transition-colors ${
                currentStep === 3
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <CreditCard className="size-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                Step 3
              </span>
              <span
                className={`text-sm sm:text-base font-bold ${
                  currentStep === 3 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Step 1 Content: Select Address ── */}
      {currentStep === 1 && (
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
            Select Address
          </h1>

          <div className="flex flex-col gap-4">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id

              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`rounded-2xl p-5 sm:p-6 cursor-pointer transition-all flex items-start justify-between gap-4 border ${
                    isSelected
                      ? "bg-zinc-100/80 dark:bg-zinc-800/60 border-zinc-300 dark:border-zinc-600 shadow-xs"
                      : "bg-zinc-50 dark:bg-zinc-900/40 border-border/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  {/* Left: Radio + Address Details */}
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Radio Button */}
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-black dark:border-white"
                            : "border-zinc-400"
                        }`}
                      >
                        {isSelected && (
                          <span className="size-2.5 rounded-full bg-black dark:bg-white" />
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-semibold text-foreground text-sm sm:text-base">
                          {addr.title}
                        </span>
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase">
                          {addr.tag}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                        {addr.address}
                      </p>

                      <p className="text-xs sm:text-sm text-foreground font-medium mt-1">
                        {addr.phone}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div
                    className="flex items-center gap-3 shrink-0 pt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenEditAddress(addr)}
                      className="text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                      title="Edit address"
                    >
                      <Pencil className="size-4" />
                    </button>
                    {addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors cursor-pointer"
                        title="Delete address"
                      >
                        <X className="size-4.5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Add New Address Separator */}
          <div className="relative my-10 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-zinc-300 dark:border-zinc-700" />
            </div>
            <button
              type="button"
              onClick={handleOpenAddAddress}
              className="relative z-10 flex flex-col items-center gap-1.5 bg-background px-4 group cursor-pointer"
            >
              <div className="size-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center transition-transform group-hover:scale-105">
                <Plus className="size-4" />
              </div>
              <span className="text-xs font-semibold text-foreground">
                Add New Address
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2 Content: Shipping Method ── */}
      {currentStep === 2 && (
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
            Shipment Method
          </h1>

          <div className="flex flex-col gap-4">
            {shippingOptions.map((opt) => {
              const isSelected = selectedShippingId === opt.id

              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedShippingId(opt.id)}
                  className={`rounded-2xl p-5 sm:p-6 cursor-pointer transition-all flex items-center justify-between gap-4 border ${
                    isSelected
                      ? "bg-zinc-100/80 dark:bg-zinc-800/60 border-zinc-300 dark:border-zinc-600 shadow-xs"
                      : "bg-zinc-50 dark:bg-zinc-900/40 border-border/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Radio Button */}
                    <div className="shrink-0">
                      <div
                        className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-black dark:border-white"
                            : "border-zinc-400"
                        }`}
                      >
                        {isSelected && (
                          <span className="size-2.5 rounded-full bg-black dark:bg-white" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-semibold text-foreground text-sm sm:text-base">
                          {opt.title}
                        </span>
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {opt.description}
                      </p>
                      <span className="text-xs text-muted-foreground font-medium mt-1">
                        {opt.estimatedDate}
                      </span>
                    </div>
                  </div>

                  <div className="text-base sm:text-lg font-bold text-foreground shrink-0">
                    {opt.price === 0 ? "Free" : `$${opt.price.toFixed(2)}`}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Delivery Note */}
          <div className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-border/40 text-xs sm:text-sm text-muted-foreground">
            <ShieldCheck className="size-5 shrink-0 text-foreground" />
            <span>
              All deliveries are insured and handled by trusted logistics partners with live order tracking.
            </span>
          </div>
        </div>
      )}

      {/* ── Step 3 Content: Payment ── */}
      {currentStep === 3 && (
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
            Payment Method
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Payment Form (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Payment Type Selection */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit-card")}
                  className={`p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === "credit-card"
                      ? "border-black dark:border-white bg-zinc-100/70 dark:bg-zinc-800/60 font-semibold"
                      : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <CreditCard className="size-5 mx-auto mb-1.5" />
                  <span className="text-xs sm:text-sm">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === "paypal"
                      ? "border-black dark:border-white bg-zinc-100/70 dark:bg-zinc-800/60 font-semibold"
                      : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <span className="font-bold text-sm block mb-1">PayPal</span>
                  <span className="text-xs text-muted-foreground">Digital wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-black dark:border-white bg-zinc-100/70 dark:bg-zinc-800/60 font-semibold"
                      : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <Truck className="size-5 mx-auto mb-1.5" />
                  <span className="text-xs sm:text-sm">Cash On Delivery</span>
                </button>
              </div>

              {/* Credit Card Inputs */}
              {paymentMethod === "credit-card" && (
                <div className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Card Number
                    </label>
                    <Input
                      value={cardForm.cardNumber}
                      onChange={(e) =>
                        setCardForm((prev) => ({
                          ...prev,
                          cardNumber: e.target.value,
                        }))
                      }
                      placeholder="•••• •••• •••• ••••"
                      className="h-11 bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Cardholder Name
                    </label>
                    <Input
                      value={cardForm.cardHolder}
                      onChange={(e) =>
                        setCardForm((prev) => ({
                          ...prev,
                          cardHolder: e.target.value,
                        }))
                      }
                      placeholder="Name on card"
                      className="h-11 bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Expiry Date
                      </label>
                      <Input
                        value={cardForm.expiryDate}
                        onChange={(e) =>
                          setCardForm((prev) => ({
                            ...prev,
                            expiryDate: e.target.value,
                          }))
                        }
                        placeholder="MM/YY"
                        className="h-11 bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        CVV
                      </label>
                      <Input
                        value={cardForm.cvv}
                        onChange={(e) =>
                          setCardForm((prev) => ({
                            ...prev,
                            cvv: e.target.value,
                          }))
                        }
                        placeholder="•••"
                        className="h-11 bg-background"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={cardForm.sameAsBilling}
                      onChange={(e) =>
                        setCardForm((prev) => ({
                          ...prev,
                          sameAsBilling: e.target.checked,
                        }))
                      }
                      className="size-4 rounded accent-black cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">
                      Same as billing address
                    </span>
                  </label>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
                  <p className="text-sm font-semibold mb-2">PayPal Checkout</p>
                  <p className="text-xs text-muted-foreground">
                    You will be securely redirected to PayPal to complete your payment.
                  </p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
                  <p className="text-sm font-semibold mb-2">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">
                    Please prepare the exact cash amount for the courier upon parcel delivery.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Order Summary Preview (5 cols) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border/50 bg-card p-6 flex flex-col gap-5">
                <h2 className="text-base font-bold text-foreground">
                  Order Summary
                </h2>

                {/* Selected Address preview */}
                <div className="border-b border-border/40 pb-4 text-xs sm:text-sm">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Delivering to:
                  </span>
                  <div className="font-semibold text-foreground">
                    {selectedAddress?.title}{" "}
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase">
                      {selectedAddress?.tag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {selectedAddress?.address}
                  </p>
                </div>

                {/* Selected Shipping preview */}
                <div className="border-b border-border/40 pb-4 text-xs sm:text-sm">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Shipping Method:
                  </span>
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>{selectedShipping?.title}</span>
                    <span>
                      {selectedShipping?.price === 0
                        ? "Free"
                        : `$${selectedShipping?.price.toFixed(2)}`}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {selectedShipping?.estimatedDate}
                  </span>
                </div>

                {/* Cost Breakdown */}
                <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-medium text-foreground">
                      {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-foreground">${tax}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border/40 text-base font-bold text-foreground">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Navigation Controls (Back & Next) ── */}
      <div className="mt-12 pt-6 border-t border-border/40 flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="h-12 px-8 sm:px-12 rounded-lg text-sm font-semibold cursor-pointer border-border/80"
        >
          Back
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={isProcessing}
          className="h-12 px-8 sm:px-12 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm font-semibold cursor-pointer"
        >
          {isProcessing
            ? "Processing..."
            : currentStep === 3
            ? "Pay Now"
            : "Next"}
        </Button>
      </div>

      {/* ── Dialog: Add / Edit Address ── */}
      <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3.5 py-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Address Title / Nickname
              </label>
              <Input
                placeholder="e.g. Home, Office, Apartment"
                value={addressForm.title}
                onChange={(e) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="h-10 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Type
              </label>
              <div className="flex gap-2">
                {(["HOME", "OFFICE", "OTHER"] as const).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setAddressForm((prev) => ({ ...prev, tag }))
                    }
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      addressForm.tag === tag
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Street Address
              </label>
              <Input
                placeholder="Street address, city, state, zip"
                value={addressForm.address}
                onChange={(e) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                className="h-10 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Phone Number
              </label>
              <Input
                placeholder="(xxx) xxx-xxxx"
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="h-10 text-xs sm:text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddAddressOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveAddress}
              disabled={!addressForm.title.trim() || !addressForm.address.trim()}
              className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
            >
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Order Completed Confirmation ── */}
      <Dialog open={isOrderCompleted}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center justify-center pt-4 pb-2">
            <div className="size-16 rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="size-9" />
            </div>

            <DialogTitle className="text-xl font-bold text-foreground">
              Order Placed Successfully!
            </DialogTitle>

            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
              Thank you for your order. We have received your payment and are preparing your package for shipment.
            </p>

            <div className="w-full mt-5 p-3 rounded-lg bg-muted/60 text-xs font-mono text-muted-foreground flex justify-between">
              <span>Order Number:</span>
              <span className="font-bold text-foreground">#ORD-289410</span>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center mt-3">
            <Link to="/my-orders" className="w-full sm:w-1/2">
              <Button className="w-full h-10 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer text-xs font-semibold">
                ดูคำสั่งซื้อของฉัน
              </Button>
            </Link>
            <Link to="/" className="w-full sm:w-1/2">
              <Button variant="outline" className="w-full h-10 cursor-pointer text-xs font-semibold">
                กลับสู่หน้าแรก
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CheckoutPage
