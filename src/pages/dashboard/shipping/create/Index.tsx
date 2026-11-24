import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { ShippingRateForm } from "../common/ShippingRateForm"
import { useShippingCreate } from "./useHooks"

export default function DashboardShippingCreatePage() {
  const { control, isSubmitting, handleSubmit, handleCancel } =
    useShippingCreate()

  return (
    <PageContent>
      <div className="mx-auto max-w-2xl space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              New Shipping Rate
            </h1>
            <p className="text-xs text-muted-foreground">
              Add a delivery carrier, fee, and free-shipping threshold.
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
          submitLabel="Create Shipping Rate"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </PageContent>
  )
}
