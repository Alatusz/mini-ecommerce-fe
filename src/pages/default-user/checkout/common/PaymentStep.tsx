import { Controller, type Control } from "react-hook-form"
import { CreditCard, TicketPercent, Truck } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  type AddressItem,
  type CardDetails,
  type PaymentMethod,
  type ShippingOption,
} from "../useHooks"

interface PaymentStepProps {
  selectedAddress?: AddressItem
  selectedShipping?: ShippingOption
  paymentMethod: PaymentMethod
  onSelectPaymentMethod: (method: PaymentMethod) => void
  cardControl: Control<CardDetails>
  onEditShippingStep: () => void
}

export function PaymentStep({
  selectedAddress,
  selectedShipping,
  paymentMethod,
  onSelectPaymentMethod,
  cardControl,
  onEditShippingStep,
}: PaymentStepProps) {
  return (
    <div className="space-y-6">
      {/* Compact Review Bar */}
      <div className="divide-y divide-border/50 rounded-xl border border-border/60 bg-muted/20 text-xs">
        {selectedAddress && (
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground">Ship to: </span>
              <span className="font-medium text-foreground">
                {selectedAddress.title} — {selectedAddress.address}
              </span>
            </div>
            <button
              type="button"
              onClick={onEditShippingStep}
              className="shrink-0 font-medium text-sky-600 hover:underline dark:text-sky-400 cursor-pointer"
            >
              Change
            </button>
          </div>
        )}
        {selectedShipping && (
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground">Method: </span>
              <span className="font-medium text-foreground">
                {selectedShipping.title} (
                {selectedShipping.price === 0
                  ? "Free"
                  : `฿${selectedShipping.price.toLocaleString()}`}
                )
              </span>
            </div>
            <button
              type="button"
              onClick={onEditShippingStep}
              className="shrink-0 font-medium text-sky-600 hover:underline dark:text-sky-400 cursor-pointer"
            >
              Change
            </button>
          </div>
        )}
      </div>

      <div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Payment Method
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          All transactions are secured and encrypted.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onSelectPaymentMethod("credit_card")}
          aria-pressed={paymentMethod === "credit_card"}
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
            paymentMethod === "credit_card"
              ? "border-foreground/80 bg-muted/45 font-semibold text-foreground"
              : "border-border/70 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          }`}
        >
          <CreditCard className="size-4 shrink-0" />
          <span className="text-xs sm:text-sm">Credit Card</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPaymentMethod("promptpay")}
          aria-pressed={paymentMethod === "promptpay"}
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
            paymentMethod === "promptpay"
              ? "border-foreground/80 bg-muted/45 font-semibold text-foreground"
              : "border-border/70 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          }`}
        >
          <TicketPercent className="size-4 shrink-0" />
          <span className="text-xs sm:text-sm">PromptPay QR</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPaymentMethod("cod")}
          aria-pressed={paymentMethod === "cod"}
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
            paymentMethod === "cod"
              ? "border-foreground/80 bg-muted/45 font-semibold text-foreground"
              : "border-border/70 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          }`}
        >
          <Truck className="size-4 shrink-0" />
          <span className="text-xs sm:text-sm">Cash on Delivery</span>
        </button>
      </div>

      {paymentMethod === "credit_card" && (
        <div className="space-y-4 rounded-xl border border-border/70 bg-background p-5">
          <Controller
            name="cardNumber"
            control={cardControl}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor="card-number"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Card Number*
                </label>
                <Input
                  id="card-number"
                  {...field}
                  placeholder="•••• •••• •••• ••••"
                  aria-invalid={fieldState.invalid}
                  className="h-10 rounded-lg text-sm"
                />
                {fieldState.error && (
                  <p className="mt-1 text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="cardHolder"
            control={cardControl}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor="card-holder"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Cardholder Name*
                </label>
                <Input
                  id="card-holder"
                  {...field}
                  placeholder="Name on card"
                  aria-invalid={fieldState.invalid}
                  className="h-10 rounded-lg text-sm"
                />
                {fieldState.error && (
                  <p className="mt-1 text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="expiryDate"
              control={cardControl}
              render={({ field, fieldState }) => (
                <div>
                  <label
                    htmlFor="card-expiry"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Expiry Date*
                  </label>
                  <Input
                    id="card-expiry"
                    {...field}
                    placeholder="MM / YY"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-lg text-sm"
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="cvv"
              control={cardControl}
              render={({ field, fieldState }) => (
                <div>
                  <label
                    htmlFor="card-cvv"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    CVV*
                  </label>
                  <Input
                    id="card-cvv"
                    {...field}
                    placeholder="•••"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-lg text-sm"
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="sameAsBilling"
            control={cardControl}
            render={({ field }) => (
              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="size-4 rounded accent-foreground cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">
                  Same as shipping address
                </span>
              </label>
            )}
          />
        </div>
      )}

      {paymentMethod === "promptpay" && (
        <div className="rounded-xl border border-border/70 bg-background p-6 text-xs text-muted-foreground leading-relaxed">
          <p className="text-sm font-medium text-foreground mb-1.5">
            PromptPay QR Payment
          </p>
          Scan the PromptPay QR code shown right after confirming your order.
        </div>
      )}

      {paymentMethod === "cod" && (
        <div className="rounded-xl border border-border/70 bg-background p-6 text-xs text-muted-foreground leading-relaxed">
          <p className="text-sm font-medium text-foreground mb-1.5">
            Cash on Delivery
          </p>
          Please prepare the exact total amount for the courier upon delivery.
        </div>
      )}
    </div>
  )
}
