import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  Package,
  Image as ImageIcon,
} from "lucide-react"

import { useCategoryEdit } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardCategoryEditPage() {
  const {
    id,
    category,
    isNotFound,
    formData,
    errors,
    isSubmitting,
    isDeleting,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  } = useCategoryEdit()

  if (isNotFound) {
    return (
      <PageContent>
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Category Not Found
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            The category with ID <code className="font-mono font-semibold">{id}</code> could not be found.
          </p>
          <div className="mt-5">
            <Link to="/dashboard/category">
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer text-xs">
                <ArrowLeft className="size-3.5" />
                Return to Categories
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
              {/* Category Name */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-semibold text-foreground">
                  Category Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className={`h-9 text-xs ${
                    errors.name ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                {errors.name && (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-slug" className="text-xs font-semibold text-foreground">
                  Slug (URL identifier) <span className="text-destructive">*</span>
                </Label>
                <div className="flex rounded-md border border-input shadow-xs focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
                  <span className="flex select-none items-center rounded-l-md bg-muted/60 px-3 font-mono text-xs text-muted-foreground border-r border-input">
                    /category/
                  </span>
                  <Input
                    id="edit-slug"
                    placeholder="slug-path"
                    value={formData.slug}
                    onChange={(e) => handleFieldChange("slug", e.target.value.toLowerCase())}
                    className="h-9 border-0 rounded-l-none font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  />
                </div>
                {errors.slug && (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.slug}
                  </p>
                )}
              </div>

              {/* Category Image */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-image" className="text-xs font-semibold text-foreground">
                  Image Path / URL <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg border border-border/60 bg-muted/40 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <Input
                    id="edit-image"
                    placeholder="e.g. /images/detail-purple.png"
                    value={formData.image}
                    onChange={(e) => handleFieldChange("image", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Thumbnail asset for storefront category cards and navigation.
                </p>
              </div>

              {/* Status Segmented Selection */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold text-foreground">
                  Publishing Status
                </Label>
                <div className="grid grid-cols-2 gap-3 pt-0.5">
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
                    <span className="text-[11px] text-muted-foreground">
                      Visible in customer menus and catalog
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange("status", "Archived")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.status === "Archived"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-zinc-400" />
                      <span className="text-xs font-semibold text-foreground">Archived</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Hidden from public storefront
                    </span>
                  </button>
                </div>
              </div>

              {/* Associated Products Info */}
              <div className="rounded-lg border border-border/50 bg-muted/20 px-3.5 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="size-4" />
                  <span>Linked Products:</span>
                  <span className="font-semibold text-foreground">{category?.itemCount || 0} items</span>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-end pt-4 border-t border-border/40">
                <div className="flex items-center gap-2">
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
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}

