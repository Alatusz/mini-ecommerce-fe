import { Loader2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type CouponItem } from "../useHubs"

interface CouponDeleteDialogProps {
  coupon: CouponItem | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export function CouponDeleteDialog({
  coupon,
  isDeleting,
  onClose,
  onConfirm,
}: CouponDeleteDialogProps) {
  return (
    <AlertDialog open={Boolean(coupon)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            Delete Coupon
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete promo code{" "}
            <span className="font-mono font-semibold text-foreground">
              {coupon?.code}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting || !coupon}
            onClick={(e) => {
              e.preventDefault()
              if (coupon) onConfirm(coupon.id)
            }}
          >
            {isDeleting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
