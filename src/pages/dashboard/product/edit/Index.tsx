import { Link } from "react-router-dom"
import { ArrowLeft, Check, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "cn"

import { useProductEdit } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { FormField } from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ProductImageUpload } from "../common/ProductImageUpload"
import { ProductStatusSelector } from "../common/ProductStatusSelector"

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
              {/* Product Name */}
              <FormField
                label="Name"
                htmlFor="edit-pname"
                required
                error={errors.name}
              >
                <Input
                  id="edit-pname"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className={cn(
                    "h-9 text-xs",
                    errors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </FormField>

              {/* SKU & Category (2 cols) */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="SKU"
                  htmlFor="edit-psku"
                  required
                  error={errors.sku}
                >
                  <Input
                    id="edit-psku"
                    placeholder="SONY-WH-1000"
                    value={formData.sku}
                    onChange={(e) =>
                      handleFieldChange("sku", e.target.value.toUpperCase())
                    }
                    className={cn(
                      "h-9 font-mono text-xs uppercase tabular-nums",
                      errors.sku && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </FormField>

                <FormField
                  label="Category"
                  htmlFor="edit-pcat"
                  required
                  error={errors.categoryId}
                >
                  <select
                    id="edit-pcat"
                    value={formData.categoryId}
                    onChange={(e) =>
                      handleFieldChange("categoryId", e.target.value)
                    }
                    disabled={isLoadingCategories}
                    className={cn(
                      "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none",
                      errors.categoryId &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  >
                    {categoryOptions.length === 0 ? (
                      <option value="">
                        {isLoadingCategories
                          ? "Loading categories..."
                          : "No categories found"}
                      </option>
                    ) : (
                      categoryOptions.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                </FormField>
              </div>

              {/* Price & Stock (2 cols) */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Price ($)"
                  htmlFor="edit-pprice"
                  required
                  error={errors.price}
                >
                  <Input
                    id="edit-pprice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                    className={cn(
                      "h-9 text-xs tabular-nums",
                      errors.price &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </FormField>

                <FormField
                  label="Stock (units)"
                  htmlFor="edit-pstock"
                  required
                  error={errors.stock}
                >
                  <Input
                    id="edit-pstock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleFieldChange("stock", e.target.value)}
                    className={cn(
                      "h-9 text-xs tabular-nums",
                      errors.stock &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </FormField>
              </div>

              {/* Product Image Upload */}
              <ProductImageUpload
                value={formData.image}
                selectedFile={selectedFile}
                isUploading={isSubmitting && !!selectedFile}
                useUrlInput={useUrlInput}
                onToggleUrlInput={toggleUseUrlInput}
                fileInputRef={fileInputRef}
                onOpenFileDialog={openFileDialog}
                onFileSelect={handleFileSelect}
                onRemoveImage={handleRemoveImage}
                onUrlChange={(url) => handleFieldChange("image", url)}
                disabled={isSubmitting || isDeleting}
              />

              {/* Lifecycle Status Selection */}
              <FormField label="Status">
                <ProductStatusSelector
                  value={formData.status}
                  onChange={(status) => handleFieldChange("status", status)}
                  disabled={isSubmitting || isDeleting}
                />
              </FormField>

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
