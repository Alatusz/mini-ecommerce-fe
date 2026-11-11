import { Link } from "react-router-dom"
import { ArrowLeft, Check, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "cn"

import { useProductEdit } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { FormField } from "@/components/common/FormField"
import { RichTextEditor } from "@/components/common/RichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ProductImageUpload } from "../common/ProductImageUpload"
import { ProductStatusSelector } from "../common/ProductStatusSelector"

export default function DashboardProductEditPage() {
  const {
    id,
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
      {/* ── Stacked Single-Column Multi-Card Form Layout ── */}
      <div className="mx-auto max-w-3xl pb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: General Information */}
          <Card className="border-border/60 shadow-2xs">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic product identity and storefront description.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    errors.name &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </FormField>

              <FormField
                label="Description"
                htmlFor="edit-pdesc"
                hint="Supports rich text formatting & emoji"
                error={errors.description}
              >
                <RichTextEditor
                  value={formData.description}
                  onChange={(html) => handleFieldChange("description", html)}
                  placeholder="Describe product highlights, technical specifications, or warranty details..."
                  error={!!errors.description}
                  disabled={isSubmitting || isDeleting}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Card 2: Product Media */}
          <Card className="border-border/60 shadow-2xs">
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
              <CardDescription>
                Visual asset displayed on catalog and storefront detail pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Card 3: Pricing & Inventory */}
          <Card className="border-border/60 shadow-2xs">
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>
                Set the retail price, stock level, and unique SKU.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                      errors.sku &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Status & Organization */}
          <Card className="border-border/60 shadow-2xs">
            <CardHeader>
              <CardTitle>Status & Organization</CardTitle>
              <CardDescription>
                Control product visibility and category classification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  disabled={isLoadingCategories || isSubmitting || isDeleting}
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

              <FormField label="Product Status">
                <ProductStatusSelector
                  value={formData.status}
                  onChange={(status) => handleFieldChange("status", status)}
                  disabled={isSubmitting || isDeleting}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
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
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </form>
      </div>
    </PageContent>
  )
}
