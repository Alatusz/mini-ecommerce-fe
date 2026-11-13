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
import { type UserItem } from "../useHubs"

interface UserDeleteDialogProps {
  user: UserItem | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export function UserDeleteDialog({
  user,
  isDeleting,
  onClose,
  onConfirm,
}: UserDeleteDialogProps) {
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "this user"

  return (
    <AlertDialog open={Boolean(user)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{displayName}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting || !user}
            onClick={(e) => {
              e.preventDefault()
              if (user) onConfirm(user.id)
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

