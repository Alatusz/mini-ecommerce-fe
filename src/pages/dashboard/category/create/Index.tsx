/**
 * Create Category — Unslop Redesign (dashboard-design skill)
 * - Wordless: crisp labels and one-word status badges; zero filler prose.
 * - Selection: soft tinted fill with faint ring.
 */
import { Link } from "react-router-dom"
import { ArrowLeft, AlertCircle, Check, Image as ImageIcon, Loader2 } from "lucide-react"
import { Controller } from "react-hook-form"

import { useCategoryCreate } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardCategoryCreatePage() {
  const { control, handleSubmit, createCategoryMutation } = useCategoryCreate()

  return (
    <PageContent>
      <div className="mx-auto max-w-2xl space-y-4 pt-1">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              New Category
            </h1>
            <span className="text-xs text-muted-foreground">Auto-slug</span>
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
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="category-name"
                      className="text-xs font-medium text-foreground"
                    >
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="category-name"
                      placeholder="Smart Watches"
                      autoFocus
                      aria-invalid={fieldState.invalid}
                      className="h-9 text-xs"
                    />
                    {fieldState.error && (
                      <p className="flex items-center gap-1 text-[11px] text-destructive">
                        <AlertCircle className="size-3" />
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Category Image */}
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="category-image"
                      className="text-xs font-medium text-foreground"
                    >
                      Image URL{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/40 p-1">
                        {field.value ? (
                          <img
                            src={field.value}
                            alt="Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="size-4 text-muted-foreground" />
                        )}
                      </div>
                      <Input
                        {...field}
                        id="category-image"
                        placeholder="/images/detail-purple.png"
                        className="h-9 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              />

              {/* Status Segmented Selection */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1.5 pt-1">
                    <Label className="text-xs font-medium text-foreground">
                      Status
                    </Label>
                    <div className="grid grid-cols-2 gap-3 pt-0.5">
                      {[
                        {
                          value: "active",
                          label: "Active",
                          tag: "Public",
                          dotClass: "bg-emerald-500",
                        },
                        {
                          value: "archived",
                          label: "Archived",
                          tag: "Hidden",
                          dotClass: "bg-zinc-400",
                        },
                      ].map((status) => {
                        const selected = field.value === status.value

                        return (
                          <button
                            key={status.value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => field.onChange(status.value)}
                            className={`flex cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                              selected
                                ? "border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/20"
                                : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`size-2 rounded-full ${status.dotClass}`}
                              />
                              <span className="text-xs font-medium text-foreground">
                                {status.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              {status.tag}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              />

              {createCategoryMutation.isError && (
                <p
                  role="alert"
                  className="flex items-center gap-1 text-xs text-destructive"
                >
                  <AlertCircle className="size-3.5" />
                  Save failed
                </p>
              )}

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-4">
                <Link to="/dashboard/category">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 cursor-pointer text-xs"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createCategoryMutation.isPending}
                  className="h-8 cursor-pointer gap-1.5 bg-foreground px-3.5 text-xs text-background hover:bg-foreground/90"
                >
                  {createCategoryMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>
                    {createCategoryMutation.isPending ? "Saving..." : "Create"}
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
