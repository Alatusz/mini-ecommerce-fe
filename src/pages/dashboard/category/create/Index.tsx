import {
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react"

import { useCategoryCreate } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardCategoryCreatePage() {
  const {
    formData,
    errors,
    isSubmitting,
    handleNameChange,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  } = useCategoryCreate()

  return (
    <PageContent>
      <div className="max-w-2xl mx-auto pt-2">
        {/* ── Clean & Minimal Form Card ── */}
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Name */}
              <div className="space-y-1.5">
                <Label htmlFor="category-name" className="text-xs font-semibold text-foreground">
                  Category Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="category-name"
                  placeholder="e.g. Smart Watches"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  autoFocus
                  className={`h-9 text-xs ${
                    errors.name ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                {errors.name ? (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.name}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    The customer-facing title displayed in menus and catalog listings.
                  </p>
                )}
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <Label htmlFor="category-slug" className="text-xs font-semibold text-foreground">
                  Slug (URL identifier) <span className="text-destructive">*</span>
                </Label>
                <div className="flex rounded-md border border-input shadow-xs focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
                  <span className="flex select-none items-center rounded-l-md bg-muted/60 px-3 font-mono text-xs text-muted-foreground border-r border-input">
                    /category/
                  </span>
                  <Input
                    id="category-slug"
                    placeholder="smart-watches"
                    value={formData.slug}
                    onChange={(e) => handleFieldChange("slug", e.target.value.toLowerCase())}
                    className="h-9 border-0 rounded-l-none font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  />
                </div>
                {errors.slug ? (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.slug}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Direct route path for this category. Auto-generated as you type.
                  </p>
                )}
              </div>

              {/* Category Image */}
              <div className="space-y-1.5">
                <Label htmlFor="category-image" className="text-xs font-semibold text-foreground">
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
                    id="category-image"
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

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer text-xs"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>{isSubmitting ? "Creating..." : "Create Category"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
