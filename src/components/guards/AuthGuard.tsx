import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

function FullPageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
    </div>
  )
}

export function RequireAuth({ allowedRoles }: { allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <FullPageLoader />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export function GuestOnly() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <FullPageLoader />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
