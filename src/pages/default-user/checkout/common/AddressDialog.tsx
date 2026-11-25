import { Controller, type Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { type CheckoutAddressValues } from "../useHooks"

interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  control: Control<CheckoutAddressValues>
  isSaving: boolean
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
}

export function AddressDialog({
  open,
  onOpenChange,
  isEditing,
  control,
  isSaving,
  onSubmit,
}: AddressDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {isEditing ? "Edit Shipping Address" : "Add Shipping Address"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor="addr-title"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Address Label*
                </label>
                <Input
                  id="addr-title"
                  {...field}
                  placeholder="e.g. Home, Office"
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
            name="tag"
            control={control}
            render={({ field }) => (
              <div>
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Address Type*
                </span>
                <div className="flex gap-2">
                  {(["HOME", "OFFICE", "OTHER"] as const).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => field.onChange(tag)}
                      className={`h-9 rounded-lg px-3.5 text-xs font-semibold transition-colors cursor-pointer ${
                        field.value === tag
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor="addr-street"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Full Address*
                </label>
                <Input
                  id="addr-street"
                  {...field}
                  placeholder="House no., street, district, postal code"
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
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <label
                  htmlFor="addr-phone"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Phone Number*
                </label>
                <Input
                  id="addr-phone"
                  {...field}
                  placeholder="08x-xxx-xxxx"
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

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 rounded-lg cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
