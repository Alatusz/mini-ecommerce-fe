import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  Package,
  Image as ImageIcon,
  UploadCloud,
  X,
} from "lucide-react"

import { useCategoryEdit } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "@/components/ui/attachment"

export default function DashboardCategoryEditPage() {
  const {
    id,
    category,
    isLoading,
    isNotFound,
    loadError,
    productCount,
    hasProducts,

    register,
    image,
    status,
    errors,
    isSubmitting,

    selectedFile,
    useUrlInput,
    toggleUseUrlInput,
    fileInputRef,
    openFileDialog,
    handleFileSelect,
    handleRemoveImage,
    handleStatusChange,

    handleSubmit,
    handleCancel,
  } = useCategoryEdit()

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

  return (
    <PageContent>
      <div className="mx-auto max-w-2xl space-y-4 pt-1">
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

              {/* Category Image with Shadcn/ui Attachment */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="edit-image"
                    className="text-xs font-medium text-foreground"
                  >
                    Image{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <button
                    type="button"
                    onClick={toggleUseUrlInput}
                    className="cursor-pointer text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    {useUrlInput ? "Upload File instead" : "or enter URL"}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                {useUrlInput ? (
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
                      placeholder="https://... or /images/..."
                      className="h-9 font-mono text-xs"
                    />
                  </div>
                ) : isSubmitting && selectedFile ? (
                  /* Attachment Uploading State (on Save) */
                  <Attachment state="uploading" className="w-full p-2.5">
                    <AttachmentMedia
                      variant="icon"
                      className="size-10 rounded-md"
                    >
                      <Spinner className="size-4 text-muted-foreground" />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle className="text-xs">
                        Uploading {selectedFile.name}...
                      </AttachmentTitle>
                      <AttachmentDescription className="text-[11px]">
                        Saving file to server
                      </AttachmentDescription>
                    </AttachmentContent>
                  </Attachment>
                ) : image ? (
                  /* Attachment Done / Preview State */
                  <Attachment state="done" className="w-full p-2">
                    <AttachmentMedia
                      variant="image"
                      className="size-10 rounded-md"
                    >
                      <img
                        src={image}
                        alt="Category"
                        className="size-full object-cover"
                      />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle className="truncate text-xs">
                        {selectedFile?.name ||
                          image.split("/").pop() ||
                          "Category Image"}
                      </AttachmentTitle>
                      <AttachmentDescription className="text-[11px]">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB · Ready to save`
                          : "Current image"}
                      </AttachmentDescription>
                    </AttachmentContent>
                    <AttachmentActions>
                      <AttachmentAction
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        onClick={handleRemoveImage}
                        className="cursor-pointer text-muted-foreground hover:text-destructive"
                        title="Remove image"
                      >
                        <X className="size-3.5" />
                      </AttachmentAction>
                    </AttachmentActions>
                  </Attachment>
                ) : (
                  /* Attachment Idle State (Click to Upload) */
                  <Attachment
                    state="idle"
                    onClick={openFileDialog}
                    className="w-full cursor-pointer p-2.5 transition-colors hover:bg-muted/40"
                  >
                    <AttachmentMedia
                      variant="icon"
                      className="size-10 rounded-md"
                    >
                      <UploadCloud className="size-4 text-muted-foreground" />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle className="text-xs">
                        Click to upload image
                      </AttachmentTitle>
                      <AttachmentDescription className="text-[11px]">
                        PNG, JPG, WEBP or GIF up to 5MB
                      </AttachmentDescription>
                    </AttachmentContent>
                  </Attachment>
                )}
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
                    const isBlocked = hasProducts && opt.value !== "active"
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={isBlocked}
                        onClick={() => handleStatusChange(opt.value)}
                        aria-pressed={selected}
                        title={
                          isBlocked
                            ? `Cannot change to ${opt.label} while ${productCount} product(s) are assigned`
                            : undefined
                        }
                        className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all ${
                          isBlocked
                            ? "cursor-not-allowed border-border/40 bg-muted/20 text-muted-foreground opacity-40"
                            : selected
                              ? "cursor-pointer border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/20"
                              : "cursor-pointer border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
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
                          {isBlocked ? "Locked" : opt.tag}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {hasProducts && (
                  <p className="flex items-center gap-1.5 pt-1 text-[11px] text-amber-600 dark:text-amber-400">
                    <AlertCircle className="size-3 shrink-0" />
                    <span>
                      Status is locked to Active because {productCount} product(s) are linked to this category.
                    </span>
                  </p>
                )}
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
