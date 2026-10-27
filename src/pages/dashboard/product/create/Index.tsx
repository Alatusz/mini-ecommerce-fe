import {
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react"

import { useProductCreate } from "./useHooks"
import { productCategories } from "../common/mockProduct"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardProductCreatePage() {
  const {
    formData,
    errors,
    isSubmitting,
    handleNameChange,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  } = useProductCreate()

  return (
    <PageContent>
      <div className="max-w-2xl mx-auto pt-2">
        {/* ── Clean & Minimal Form Card ── */}
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Title */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-name" className="text-xs font-semibold text-foreground">
                  Product Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="prod-name"
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
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
                    The customer-facing merchandise name displayed across catalog and checkout.
                  </p>
                )}
              </div>

              {/* SKU & Category (2 cols) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prod-sku" className="text-xs font-semibold text-foreground">
                    SKU Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="prod-sku"
                    placeholder="e.g. WH-1000XM5-BLK"
                    value={formData.sku}
                    onChange={(e) => handleFieldChange("sku", e.target.value.toUpperCase())}
                    className={`h-9 font-mono text-xs uppercase ${
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
                  <Label htmlFor="prod-cat" className="text-xs font-semibold text-foreground">
                    Category
                  </Label>
                  <select
                    id="prod-cat"
                    value={formData.category}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none"
                  >
                    {productCategories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock (2 cols) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prod-price" className="text-xs font-semibold text-foreground">
                    Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="prod-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="299.00"
                    value={formData.price}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                    className={`h-9 text-xs ${
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
                  <Label htmlFor="prod-stock" className="text-xs font-semibold text-foreground">
                    Stock Units <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="prod-stock"
                    type="number"
                    min="0"
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => handleFieldChange("stock", e.target.value)}
                    className={`h-9 text-xs ${
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

              {/* Product Image */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-image" className="text-xs font-semibold text-foreground">
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
                    id="prod-image"
                    placeholder="e.g. /images/hero-airpods.png"
                    value={formData.image}
                    onChange={(e) => handleFieldChange("image", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Thumbnail asset for storefront catalog grids and order receipts.
                </p>
              </div>

              {/* Status Segmented Selection */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold text-foreground">
                  Inventory Status
                </Label>
                <div className="grid grid-cols-3 gap-3 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleFieldChange("status", "In Stock")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.status === "In Stock"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold text-foreground">In Stock</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Available for purchase
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange("status", "Low Stock")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.status === "Low Stock"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-500" />
                      <span className="text-xs font-semibold text-foreground">Low Stock</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Running low on inventory
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange("status", "Out of Stock")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.status === "Out of Stock"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-foreground"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-red-500" />
                      <span className="text-xs font-semibold text-foreground">Out of Stock</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Sold out or disabled
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
                  <span>{isSubmitting ? "Creating..." : "Create Product"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
