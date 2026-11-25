import { Link } from "react-router-dom"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"

interface OrderSuccessDialogProps {
  open: boolean
  orderId: string
}

export function OrderSuccessDialog({ open, orderId }: OrderSuccessDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md rounded-2xl text-center">
        <div className="flex flex-col items-center justify-center pt-4 pb-2">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-8" />
          </div>

          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
            Order Placed Successfully
          </DialogTitle>

          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Thank you for your purchase. We are preparing your order for dispatch.
          </p>

          <div className="mt-5 flex w-full items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-xs">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono font-semibold text-foreground">
              #{orderId}
            </span>
          </div>
        </div>

        <DialogFooter className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Link to="/my-orders" className="w-full sm:w-1/2">
            <Button className="h-10 w-full rounded-lg text-xs font-semibold cursor-pointer">
              View My Orders
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-1/2">
            <Button
              variant="outline"
              className="h-10 w-full rounded-lg text-xs font-semibold cursor-pointer"
            >
              Back to Store
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
