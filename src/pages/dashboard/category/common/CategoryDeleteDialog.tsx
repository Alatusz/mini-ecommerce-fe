import { AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type CategoryItem } from "./mockCategory"

interface CategoryDeleteDialogProps {
  category: CategoryItem | null
  open: boolean
  onClose: () => void
  onConfirm: (id: string) => void
  isDeleting?: boolean
}

export function CategoryDeleteDialog({
  category,
  open,
  onClose,
  onConfirm,
  isDeleting = false,
}: CategoryDeleteDialogProps) {
  const productCount = category?.productCount ?? 0
  const hasProducts = productCount > 0

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription className="space-y-2 pt-1">
            <span>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">{category?.name}</strong>?
            </span>
            {hasProducts ? (
              <span className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>
                  This category contains <strong>{productCount}</strong> product(s).
                  Please reassign or delete them before deleting this category.
                </span>
              </span>
            ) : (
              <span className="block text-xs text-muted-foreground">
                This action cannot be undone.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            onClick={() => {
              if (category && !hasProducts) {
                onConfirm(category.id)
              }
            }}
            disabled={isDeleting || hasProducts}
            className="cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
