import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { ProductItem } from "@/services/product.services"

interface ProductDeleteDialogProps {
  product: ProductItem | null
  open: boolean
  onClose: () => void
  onConfirm: (id: string) => void
  isDeleting?: boolean
}

export function ProductDeleteDialog({
  product,
  open,
  onClose,
  onConfirm,
  isDeleting = false,
}: ProductDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription className="space-y-1 pt-1">
            <span>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">{product?.name}</strong>?
            </span>
            <span className="block text-xs text-muted-foreground">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              if (product) {
                onConfirm(product.id)
              }
            }}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

