/**
 * Edit Category — Unslop Redesign (dashboard-design skill)
 * - Wordless: compact numeric facts, zero descriptive sentences.
 * - Selection: soft tinted fill with faint ring.
 */
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
    isLoading,
    isNotFound,
    loadError,
    register,
    watch,
    setValue,
    errors,
    isSubmitting,
    handleSubmit,
    handleCancel,
  } = useCategoryEdit()

  const image = watch("image")
  const status = watch("status")

  if (isLoading) {
    return (
      <PageContent>
        <div className="flex justify-center py-20">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      </PageContent>
    )
  }

  if (isNotFound) {
    return (
      <PageContent>
        <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Category Not Found
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{id}</p>
          <div className="mt-4">
            <Link to="/dashboard/category">
              <Button
                variant="outline"
                size="sm"
                className="h-8 cursor-pointer gap-1.5 text-xs"
              >
                <ArrowLeft className="size-3.5" />
                Categories
              </Button>
            </Link>
          </div>
        </div>
      </PageContent>
    )
  }

  if (loadError || !category) {
    return (
      <PageContent>
        <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-3 size-5 text-destructive" />
          <h2 className="text-base font-semibold text-foreground">
            Load Error
          </h2>
          <Link to="/dashboard/category" className="mt-4">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <ArrowLeft className="size-3.5" />
              Categories
            </Button>
          </Link>
        </div>
      </PageContent>
    )
  }

  const productCount = category.productCount ?? category.itemCount ?? 0

  return (
    <PageContent>
      <div className="mx-auto max-w-2xl space-y-4 pt-1">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {category.name}
            </h1>
          </div>
          <Link to="/dashboard/category">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>Categories</span>
            </Button>
          </Link>
        </div>

        {/* ── Form Card ── */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-name"
                  className="text-xs font-medium text-foreground"
                >
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register("name")}
                  id="edit-name"
                  placeholder="Category Name"
                  aria-invalid={Boolean(errors.name)}
                  className={`h-9 text-xs ${
                    errors.name
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
                {errors.name?.message && (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Category Image */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-image"
                  className="text-xs font-medium text-foreground"
                >
                  Image URL{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/40 p-1">
                    {image ? (
                      <img
                        src={image}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <Input
                    {...register("image")}
                    id="edit-image"
                    placeholder="/images/detail-purple.png"
                    className="h-9 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Status Segmented Selection */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-medium text-foreground">
                  Status
                </Label>
                <div className="grid grid-cols-3 gap-3 pt-0.5">
                  {[
                    {
                      value: "active" as const,
                      label: "Active",
                      tag: "Public",
                      dotClass: "bg-emerald-500",
                    },
                    {
                      value: "archived" as const,
                      label: "Archived",
                      tag: "Hidden",
                      dotClass: "bg-zinc-400",
                    },
                    {
                      value: "draft" as const,
                      label: "Draft",
                      tag: "Unpublished",
                      dotClass: "bg-amber-500",
                    },
                  ].map((opt) => {
                    const selected = status === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setValue("status", opt.value, { shouldDirty: true })
                        }
                        aria-pressed={selected}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all ${
                          selected
                            ? "border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/20"
                            : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 rounded-full ${opt.dotClass}`}
                          />
                          <span className="text-xs font-medium text-foreground">
                            {opt.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {opt.tag}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Associated Products Fact */}
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3.5 py-2 text-xs tabular-nums">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="size-3.5" />
                  <span>Products</span>
                </div>
                <span className="font-semibold text-foreground">
                  {productCount} items
                </span>
              </div>

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="h-8 cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-8 cursor-pointer gap-1.5 bg-foreground px-3.5 text-xs text-background hover:bg-foreground/90"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>{isSubmitting ? "Saving..." : "Save"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
