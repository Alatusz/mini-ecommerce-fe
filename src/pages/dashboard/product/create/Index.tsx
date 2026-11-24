import { useState, useMemo } from "react"
import { Controller } from "react-hook-form"
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
    control,
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
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <FormField
                    label="Product Name"
                    htmlFor="prod-name"
                    required
                    error={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      id="prod-name"
                      placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={cn(
                        "h-9 text-xs",
                        fieldState.invalid &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </FormField>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <FormField
                    label="Description"
                    htmlFor="prod-desc"
                    hint="Supports rich text formatting & emoji"
                    error={fieldState.error?.message}
                  >
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Describe product highlights, technical specifications, or warranty details..."
                      error={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                  </FormField>
                )}
              />
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
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ProductImageUpload
                    value={field.value}
                    selectedFile={selectedFile}
                    isUploading={isSubmitting && !!selectedFile}
                    useUrlInput={useUrlInput}
                    onToggleUrlInput={toggleUseUrlInput}
                    fileInputRef={fileInputRef}
                    onOpenFileDialog={openFileDialog}
                    onFileSelect={handleFileSelect}
                    onRemoveImage={handleRemoveImage}
                    onUrlChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
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
                <Controller
                  name="price"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormField
                      label="Price ($)"
                      htmlFor="prod-price"
                      required
                      error={fieldState.error?.message}
                    >
                      <Input
                        {...field}
                        id="prod-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="299.00"
                        className={cn(
                          "h-9 text-xs tabular-nums",
                          fieldState.invalid &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="stock"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormField
                      label="Stock (units)"
                      htmlFor="prod-stock"
                      required
                      error={fieldState.error?.message}
                    >
                      <Input
                        {...field}
                        id="prod-stock"
                        type="number"
                        min="0"
                        placeholder="50"
                        className={cn(
                          "h-9 text-xs tabular-nums",
                          fieldState.invalid &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="sku"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormField
                      label="SKU"
                      htmlFor="prod-sku"
                      required
                      error={fieldState.error?.message}
                    >
                      <Input
                        {...field}
                        id="prod-sku"
                        placeholder="SONY-WH-1000"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        className={cn(
                          "h-9 font-mono text-xs uppercase",
                          fieldState.invalid &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                    </FormField>
                  )}
                />
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
              <Controller
                name="categoryId"
                control={control}
                render={({ field, fieldState }) => (
                  <FormField
                    label="Category"
                    htmlFor="prod-cat"
                    required
                    error={fieldState.error?.message}
                  >
                    <Select
                      value={field.value || undefined}
                      onValueChange={(val) => field.onChange(val ?? "")}
                      disabled={isLoadingCategories || isSubmitting}
                    >
                      <SelectTrigger
                        id="prod-cat"
                        className={cn(
                          "w-full",
                          fieldState.invalid &&
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
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormField label="Product Status">
                    <ProductStatusSelector
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormField>
                )}
              />
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
