import { MapPin, Pencil, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type AddressItem, type ShippingOption } from "../useHooks"

interface ShippingStepProps {
  addresses: AddressItem[]
  selectedAddressId: string
  onSelectAddress: (id: string) => void
  onOpenAddAddress: () => void
  onOpenEditAddress: (addr: AddressItem) => void
  onDeleteAddress: (id: string) => void
  shippingOptions: ShippingOption[]
  selectedShippingId: string
  onSelectShipping: (id: string) => void
}

export function ShippingStep({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onOpenAddAddress,
  onOpenEditAddress,
  onDeleteAddress,
  shippingOptions,
  selectedShippingId,
  onSelectShipping,
}: ShippingStepProps) {
  return (
    <div className="space-y-7">
      {/* Section 1: Shipping Address */}
      <section aria-labelledby="shipping-address-heading">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h1
            id="shipping-address-heading"
            className="text-base sm:text-lg font-semibold tracking-tight text-foreground"
          >
            Shipping Address
          </h1>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenAddAddress}
            className="h-8 gap-1.5 rounded-lg border-border/70 px-3 text-xs font-medium cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Address</span>
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
            <MapPin className="size-6 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">
              No shipping address saved
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add an address to continue with your order.
            </p>
            <Button
              type="button"
              onClick={onOpenAddAddress}
              size="sm"
              className="mt-3 h-9 gap-1.5 rounded-lg px-4 text-xs cursor-pointer"
            >
              <Plus className="size-3.5" />
              Add Shipping Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id

              return (
                <div
                  key={addr.id}
                  className={`flex items-start justify-between gap-2 rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? "border-foreground/80 bg-muted/40"
                      : "border-border/70 bg-background hover:border-foreground/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectAddress(addr.id)}
                    aria-pressed={isSelected}
                    className="flex flex-1 min-w-0 items-start gap-2.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                  >
                    <span
                      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? "border-foreground"
                          : "border-muted-foreground/50"
                      }`}
                    >
                      {isSelected && (
                        <span className="size-2 rounded-full bg-foreground" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {addr.title}
                        </span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {addr.tag}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {addr.address}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-foreground tabular-nums">
                        {addr.phone}
                      </p>
                    </div>
                  </button>

                  <div className="flex shrink-0 flex-col items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => onOpenEditAddress(addr)}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                      aria-label={`Edit ${addr.title}`}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    {addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteAddress(addr.id)}
                        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        aria-label={`Delete ${addr.title}`}
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Section 2: Shipping Method */}
      <section aria-labelledby="shipping-method-heading">
        <h2
          id="shipping-method-heading"
          className="mb-3 text-base sm:text-lg font-semibold tracking-tight text-foreground"
        >
          Shipping Method
        </h2>

        {shippingOptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
            No active shipping methods available.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {shippingOptions.map((opt) => {
              const isSelected = selectedShippingId === opt.id
              const shortDays = opt.estimatedDate
                .replace("Estimated delivery: ", "")
                .replace(" business days", " Days")
                .replace(" business day(s)", " Day")

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectShipping(opt.id)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isSelected
                      ? "border-foreground/80 bg-muted/45"
                      : "border-border/70 bg-background hover:border-foreground/30"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span
                      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? "border-foreground"
                          : "border-muted-foreground/50"
                      }`}
                    >
                      {isSelected && (
                        <span className="size-2 rounded-full bg-foreground" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {opt.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {shortDays}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                    {opt.price === 0 ? "฿0" : `฿${opt.price.toLocaleString()}`}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
