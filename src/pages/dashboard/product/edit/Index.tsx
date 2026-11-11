import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  ImageIcon,
  UploadCloud,
  X,
} from "lucide-react"

import { useProductEdit } from "./useHooks"
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

export default function DashboardProductEditPage() {
  const {
    id,
    product,
    isNotFound,
    isLoading,
    formData,
    errors,
    categoryOptions,
    isLoadingCategories,
    isSubmitting,
    isDeleting,
    selectedFile,
    useUrlInput,
    toggleUseUrlInput,
    fileInputRef,
    openFileDialog,
    handleFileSelect,
    handleRemoveImage,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  } = useProductEdit()

  if (isNotFound) {
    return (
      <PageContent>
        <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Product Not Found
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{id}</p>
          <div className="mt-4">
            <Link to="/dashboard/product">
              <Button
                variant="outline"
                size="sm"
                className="h-8 cursor-pointer gap-1.5 text-xs"
              >
                <ArrowLeft className="size-3.5" />
                Products
              </Button>
            </Link>
          </div>
        </div>
      </PageContent>
    )
  }

  if (isLoading) {
    return (
      <PageContent>
        <div className="mx-auto flex max-w-md flex-col items-center justify-center py-24 text-center">
          <Spinner className="size-6 text-muted-foreground" />
          <p className="mt-3 text-xs text-muted-foreground">Loading product...</p>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <div className="mx-auto max-w-2xl space-y-4 pt-1">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {product?.name || "Edit Product"}
            </h1>
          </div>
          <Link to="/dashboard/product">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>Products</span>
            </Button>
          </Link>
        </div>

        {/* ── Form Card ── */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Title */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-pname" className="text-xs font-medium text-foreground">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-pname"
                  placeholder="Product Name"
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

              {/* SKU & Category (2 cols) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-psku" className="text-xs font-medium text-foreground">
                    SKU <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-psku"
                    placeholder="SONY-WH-1000"
                    value={formData.sku}
                    onChange={(e) => handleFieldChange("sku", e.target.value.toUpperCase())}
                    className={`h-9 font-mono text-xs uppercase tabular-nums ${
                      errors.sku ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  />
                  {errors.sku && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.sku}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-pcat" className="text-xs font-medium text-foreground">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="edit-pcat"
                    value={formData.categoryId}
                    onChange={(e) => handleFieldChange("categoryId", e.target.value)}
                    disabled={isLoadingCategories}
                    className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none ${
                      errors.categoryId ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  >
                    {categoryOptions.length === 0 ? (
                      <option value="">
                        {isLoadingCategories ? "Loading categories..." : "No categories found"}
                      </option>
                    ) : (
                      categoryOptions.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.categoryId && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.categoryId}
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Stock (2 cols) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-pprice" className="text-xs font-medium text-foreground">
                    Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-pprice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                    className={`h-9 text-xs tabular-nums ${
                      errors.price ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  />
                  {errors.price && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-pstock" className="text-xs font-medium text-foreground">
                    Stock (units) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-pstock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleFieldChange("stock", e.target.value)}
                    className={`h-9 text-xs tabular-nums ${
                      errors.stock ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  />
                  {errors.stock && (
                    <p className="flex items-center gap-1 text-[11px] text-destructive">
                      <AlertCircle className="size-3" />
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Product Image (Attachment Pattern from Category) ── */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">
                    Product Image <span className="font-normal text-muted-foreground">(optional)</span>
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
                      id="edit-pimage"
                      placeholder="https://... or /images/..."
                      value={formData.image}
                      onChange={(e) => handleFieldChange("image", e.target.value)}
                      className="h-9 font-mono text-xs"
                    />
                  </div>
                ) : isSubmitting && selectedFile ? (
                  /* Attachment Uploading State */
                  <Attachment state="uploading" className="w-full p-2.5">
                    <AttachmentMedia variant="icon" className="size-10 rounded-md">
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
                ) : formData.image ? (
                  /* Attachment Done / Preview State */
                  <Attachment state="done" className="w-full p-2">
                    <AttachmentMedia variant="image" className="size-10 rounded-md">
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="size-full object-cover"
                      />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle className="truncate text-xs">
                        {selectedFile?.name || formData.image.split("/").pop() || "Uploaded Image"}
                      </AttachmentTitle>
                      <AttachmentDescription className="text-[11px]">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB · Ready`
                          : "Ready"}
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
                    <AttachmentMedia variant="icon" className="size-10 rounded-md">
                      <UploadCloud className="size-4 text-muted-foreground" />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle className="text-xs">Upload image</AttachmentTitle>
                      <AttachmentDescription className="text-[11px]">
                        SVG, PNG, JPG under 5MB
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
                  {(
                    [
                      {
                        value: "published",
                        label: "Published",
                        dot: "bg-emerald-500",
                        tag: "Visible",
                      },
                      {
                        value: "draft",
                        label: "Draft",
                        dot: "bg-zinc-400",
                        tag: "Hidden",
                      },
                      {
                        value: "archived",
                        label: "Archived",
                        dot: "bg-amber-500",
                        tag: "Archived",
                      },
                    ] as const
                  ).map((opt) => {
                    const selected = formData.status === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleFieldChange("status", opt.value)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all ${
                          selected
                            ? "border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/20"
                            : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`size-2 rounded-full ${opt.dot}`} />
                          <span className="text-xs font-medium text-foreground">
                            {opt.label}
                          </span>
                        </div>
                        <span className="text-[11px] tabular-nums text-muted-foreground">
                          {opt.tag}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting || isDeleting}
                  className="h-8 cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || isDeleting}
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
