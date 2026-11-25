import { Link } from "react-router-dom"
import { ChevronRight, Loader2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCheckout } from "./useHooks"
import { ShippingStep } from "./common/ShippingStep"
import { PaymentStep } from "./common/PaymentStep"
import { OrderSummary } from "./common/OrderSummary"
import { AddressDialog } from "./common/AddressDialog"
import { OrderSuccessDialog } from "./common/OrderSuccessDialog"

function CheckoutPage() {
  const {
    currentStep,
    setCurrentStep,
    isLoading,
    cartItems,
    cartItemsCount,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddAddressOpen,
    setIsAddAddressOpen,
    editingAddressId,
    addressControl,
    isSavingAddress,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
    shippingOptions,
    selectedShippingId,
    setSelectedShippingId,
    paymentMethod,
    setPaymentMethod,
    cardControl,
    couponInput,
    setCouponInput,
    appliedCoupon,
    isValidatingCoupon,
    handleApplyCoupon,
    handleRemoveCoupon,
    isOrderCompleted,
    createdOrderId,
    isProcessing,
    handleNext,
    handleBack,
    selectedAddress,
    selectedShipping,
    subtotal,
    discountAmount,
    shippingCost,
    total,
  } = useCheckout()

  if (isLoading && !isOrderCompleted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-sm font-medium">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (!isLoading && cartItemsCount === 0 && !isOrderCompleted) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 text-muted-foreground">
          <ShoppingBag className="size-6" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Add products to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="mt-6 inline-block">
          <Button className="h-11 px-6 rounded-xl cursor-pointer font-medium">
            Browse Products
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Shipping + Payment */}
        <div className="lg:col-span-7 flex flex-col lg:min-h-[680px] rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-2xs">
          <nav
            aria-label="Checkout steps"
            className="mb-4 flex items-center gap-1.5 text-xs font-medium"
          >
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`cursor-pointer transition-colors ${
                currentStep === 1
                  ? "text-sky-600 dark:text-sky-400 font-semibold"
                  : "text-foreground hover:text-sky-600"
              }`}
            >
              Shipping
            </button>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => {
                if (currentStep === 2) setCurrentStep(2)
              }}
              className={`transition-colors ${
                currentStep === 2
                  ? "text-sky-600 dark:text-sky-400 font-semibold cursor-default"
                  : "text-muted-foreground cursor-default"
              }`}
            >
              Payment
            </button>
          </nav>

          {currentStep === 1 ? (
            <ShippingStep
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onOpenAddAddress={handleOpenAddAddress}
              onOpenEditAddress={handleOpenEditAddress}
              onDeleteAddress={handleDeleteAddress}
              shippingOptions={shippingOptions}
              selectedShippingId={selectedShippingId}
              onSelectShipping={setSelectedShippingId}
            />
          ) : (
            <PaymentStep
              selectedAddress={selectedAddress}
              selectedShipping={selectedShipping}
              paymentMethod={paymentMethod}
              onSelectPaymentMethod={setPaymentMethod}
              cardControl={cardControl}
              onEditShippingStep={() => setCurrentStep(1)}
            />
          )}
        </div>

        {/* Right Column: Your Cart Summary */}
        <OrderSummary
          currentStep={currentStep}
          cartItems={cartItems}
          couponInput={couponInput}
          onCouponInputChange={setCouponInput}
          appliedCoupon={appliedCoupon}
          isValidatingCoupon={isValidatingCoupon}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          subtotal={subtotal}
          discountAmount={discountAmount}
          shippingCost={shippingCost}
          total={total}
          isProcessing={isProcessing}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>

      <AddressDialog
        open={isAddAddressOpen}
        onOpenChange={setIsAddAddressOpen}
        isEditing={Boolean(editingAddressId)}
        control={addressControl}
        isSaving={isSavingAddress}
        onSubmit={handleSaveAddress}
      />

      <OrderSuccessDialog open={isOrderCompleted} orderId={createdOrderId} />
    </div>
  )
}

export default CheckoutPage
