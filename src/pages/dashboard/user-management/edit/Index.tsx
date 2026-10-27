import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  User as UserIcon,
  Shield,
  ShoppingBag,
  DollarSign,
  Calendar,
} from "lucide-react"

import { useUserEdit } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardUserEditPage() {
  const {
    id,
    user,
    isNotFound,
    formData,
    errors,
    isSubmitting,
    isDeleting,
    handleFieldChange,
    handleSubmit,
    handleCancel,
    computeInitials,
  } = useUserEdit()

  if (isNotFound) {
    return (
      <PageContent>
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            User Account Not Found
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            The profile with ID <code className="font-mono font-semibold">{id}</code> could not be found.
          </p>
          <div className="mt-5">
            <Link to="/dashboard/user-management">
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer text-xs">
                <ArrowLeft className="size-3.5" />
                Return to User Management
              </Button>
            </Link>
          </div>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <div className="max-w-2xl mx-auto pt-2">
        {/* ── Clean & Minimal Form Card ── */}
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name & Avatar Preview */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-uname" className="text-xs font-semibold text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-xs text-foreground border border-border/60">
                    {computeInitials(formData.name)}
                  </div>
                  <Input
                    id="edit-uname"
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className={`h-9 text-xs ${
                      errors.name ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-uemail" className="text-xs font-semibold text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-uemail"
                  type="email"
                  placeholder="e.g. alex.j@example.com"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className={`h-9 text-xs ${
                    errors.email ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                {errors.email && (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* User Historical Activity Stats */}
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShoppingBag className="size-3.5 text-blue-500" />
                  <span>Orders:</span>
                  <span className="font-semibold text-foreground">{user?.ordersCount || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="size-3.5 text-emerald-500" />
                  <span>Spent:</span>
                  <span className="font-semibold text-foreground">
                    ${(user?.totalSpent || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-3.5 text-amber-500" />
                  <span>Joined:</span>
                  <span className="font-semibold text-foreground">{user?.joinedDate || "-"}</span>
                </div>
              </div>

              {/* Role Selection Segmented */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold text-foreground">
                  Account Role
                </Label>
                <div className="grid grid-cols-3 gap-3 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleFieldChange("role", "Customer")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.role === "Customer"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="size-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-foreground">Customer</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Standard shopping access
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange("role", "Staff")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.role === "Staff"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="size-3.5 text-blue-500" />
                      <span className="text-xs font-semibold text-foreground">Staff</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Store inventory editor
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange("role", "Admin")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.role === "Admin"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-3.5 text-purple-500" />
                      <span className="text-xs font-semibold text-foreground">Admin</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Full system privileges
                    </span>
                  </button>
                </div>
              </div>

              {/* Status Segmented Selection */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold text-foreground">
                  Account Status
                </Label>
                <div className="grid grid-cols-3 gap-3 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleFieldChange("status", "Active")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.status === "Active"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold text-foreground">Active</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Authorized to log in
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange("status", "Inactive")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.status === "Inactive"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-zinc-400" />
                      <span className="text-xs font-semibold text-foreground">Inactive</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Temporarily disabled
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange("status", "Suspended")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.status === "Suspended"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-red-500" />
                      <span className="text-xs font-semibold text-foreground">Suspended</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Blocked from store
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting || isDeleting}
                  className="cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || isDeleting}
                  className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer text-xs"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
