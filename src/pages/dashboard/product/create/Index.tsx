import { useState, useMemo } from "react"
import { Check, Loader2 } from "lucide-react"
import { cn } from "cn"

import { useProductCreate } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { FormField } from "@/components/common/FormField"
import { RichTextEditor } from "@/components/common/RichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { ProductImageUpload } from "../common/ProductImageUpload"
import { ProductStatusSelector } from "../common/ProductStatusSelector"

export default function DashboardProductCreatePage() {
  const {
    formData,
    errors,
    categoryOptions,
    isLoadingCategories,
    isSubmitting,
    selectedFile,
    useUrlInput,
    toggleUseUrlInput,
    fileInputRef,
    openFileDialog,
    handleFileSelect,
    handleRemoveImage,
    handleNameChange,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  } = useProductCreate()

  const [categorySearch, setCategorySearch] = useState("")
  const filteredCategoryOptions = useMemo(() => {
    const query = categorySearch.toLowerCase().trim()
    if (!query) return categoryOptions
    return categoryOptions.filter((cat) =>
      cat.name.toLowerCase().includes(query)
    )
  }, [categoryOptions, categorySearch])

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
                label="Product Name"
                htmlFor="prod-name"
                required
                error={errors.name}
              >
                <Input
                  id="prod-name"
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={cn(
                    "h-9 text-xs",
                    errors.name &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </FormField>

              <FormField
                label="Description"
                htmlFor="prod-desc"
                hint="Supports rich text formatting & emoji"
                error={errors.description}
              >
                <RichTextEditor
                  value={formData.description}
                  onChange={(html) => handleFieldChange("description", html)}
                  placeholder="Describe product highlights, technical specifications, or warranty details..."
                  error={!!errors.description}
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  htmlFor="prod-price"
                  required
                  error={errors.price}
                >
                  <Input
                    id="prod-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="299.00"
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
                  htmlFor="prod-stock"
                  required
                  error={errors.stock}
                >
                  <Input
                    id="prod-stock"
                    type="number"
                    min="0"
                    placeholder="50"
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
                  htmlFor="prod-sku"
                  required
                  error={errors.sku}
                >
                  <Input
                    id="prod-sku"
                    placeholder="SONY-WH-1000"
                    value={formData.sku}
                    onChange={(e) =>
                      handleFieldChange("sku", e.target.value.toUpperCase())
                    }
                    className={cn(
                      "h-9 font-mono text-xs uppercase",
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
                htmlFor="prod-cat"
                required
                error={errors.categoryId}
              >
                <Select
                  value={formData.categoryId || undefined}
                  onValueChange={(val) =>
                    handleFieldChange("categoryId", val ?? "")
                  }
                  disabled={isLoadingCategories || isSubmitting}
                >
                  <SelectTrigger
                    id="prod-cat"
                    className={cn(
                      "w-full",
                      errors.categoryId &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  >
                    <SelectValue>
                      {(val: string) =>
                        categoryOptions.find((c) => c.id === val)?.name ||
                        (isLoadingCategories
                          ? "Loading categories..."
                          : "Select category")
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    <div className="border-b p-1.5">
                      <Input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <SelectGroup className="max-h-56 overflow-y-auto p-1">
                      {filteredCategoryOptions.length === 0 ? (
                        <div className="py-3 text-center text-xs text-muted-foreground">
                          No categories found
                        </div>
                      ) : (
                        filteredCategoryOptions.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Product Status">
                <ProductStatusSelector
                  value={formData.status}
                  onChange={(status) => handleFieldChange("status", status)}
                  disabled={isSubmitting}
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
              <span>{isSubmitting ? "Creating..." : "Create Product"}</span>
            </Button>
          </div>
        </form>
      </div>
    </PageContent>
  )
}
