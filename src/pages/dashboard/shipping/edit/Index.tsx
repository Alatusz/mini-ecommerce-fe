import { Link } from "react-router-dom"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { ShippingRateForm } from "../common/ShippingRateForm"
import { useShippingEdit } from "./useHooks"

export default function DashboardShippingEditPage() {
  const {
    id,
    isLoading,
    isNotFound,
    control,
    isSubmitting,
    handleSubmit,
    handleCancel,
  } = useShippingEdit()

  if (isLoading) {
    return (
      <PageContent>
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Loading shipping rate...
        </div>
      </PageContent>
    )
  }

  if (isNotFound) {
    return (
      <PageContent>
        <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Shipping Rate Not Found
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{id}</p>
          <div className="mt-4">
            <Link to="/dashboard/shipping">
              <Button
                variant="outline"
                size="sm"
                className="h-8 cursor-pointer gap-1.5 text-xs"
              >
                <ArrowLeft className="size-3.5" />
                Shipping Rates
              </Button>
            </Link>
          </div>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <div className="mx-auto max-w-2xl space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Edit Shipping Rate
            </h1>
            <p className="text-xs text-muted-foreground">
              Update shipping cost, free-shipping threshold, and delivery SLA.
            </p>
          </div>
          <Link to="/dashboard/shipping">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>Shipping Rates</span>
            </Button>
          </Link>
        </div>

        <ShippingRateForm
          control={control}
          isSubmitting={isSubmitting}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </PageContent>
  )
}
