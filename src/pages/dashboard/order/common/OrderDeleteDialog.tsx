import { Trash2 } from "lucide-react"
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
import { type OrderItem } from "../useHubs"

interface OrderDeleteDialogProps {
  order: OrderItem | null
  onClose: () => void
  onConfirm: (id: string) => void
}

export function OrderDeleteDialog({
  order,
  onClose,
  onConfirm,
}: OrderDeleteDialogProps) {
  return (
    <AlertDialog open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            Delete Order
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete order{" "}
            <span className="font-mono font-semibold text-foreground">
              {order?.id}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => order && onConfirm(order.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
