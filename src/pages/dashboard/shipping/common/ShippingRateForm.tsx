import { Controller, type Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { type ShippingRateFormValues } from "../schema"

interface ShippingRateFormProps {
  control: Control<ShippingRateFormValues>
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  onCancel: () => void
}

export function ShippingRateForm({
  control,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}: ShippingRateFormProps) {
  return (
    <Card className="border-border/60 bg-card shadow-2xs">
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <Label htmlFor="shipping-name">Method Name</Label>
                <Input
                  id="shipping-name"
                  placeholder="e.g. Flash Express, KEX, Thailand Post EMS"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                {fieldState.error && (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="shipping-price">Shipping Fee (฿)</Label>
                  <Input
                    id="shipping-price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === "" ? 0 : Number(val))
                    }}
                    onBlur={field.onBlur}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="freeMinSpend"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="shipping-free-min">Free Min Spend (฿)</Label>
                  <Input
                    id="shipping-free-min"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Optional (no free shipping tier)"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === "" ? null : Number(val))
                    }}
                    onBlur={field.onBlur}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Controller
              name="minDays"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="shipping-min-days">Min Delivery Days</Label>
                  <Input
                    id="shipping-min-days"
                    type="number"
                    min={0}
                    step={1}
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === "" ? 0 : Number(val))
                    }}
                    onBlur={field.onBlur}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="maxDays"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="shipping-max-days">Max Delivery Days</Label>
                  <Input
                    id="shipping-max-days"
                    type="number"
                    min={0}
                    step={1}
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === "" ? 0 : Number(val))
                    }}
                    onBlur={field.onBlur}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="sortOrder"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="shipping-sort-order">Sort Order</Label>
                  <Input
                    id="shipping-sort-order"
                    type="number"
                    min={0}
                    step={1}
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === "" ? 0 : Number(val))
                    }}
                    onBlur={field.onBlur}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-lg border p-3.5">
                <div>
                  <Label htmlFor="shipping-is-active" className="font-medium">
                    Active Status
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable this shipping method for customers at checkout
                  </p>
                </div>
                <Switch
                  id="shipping-is-active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
