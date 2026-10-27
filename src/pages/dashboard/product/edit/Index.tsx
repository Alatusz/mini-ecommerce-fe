import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react"

import { useProductEdit } from "./useHooks"
import { productCategories } from "../common/mockProduct"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardProductEditPage() {
  const {
    id,
    product,
    isNotFound,
    formData,
    errors,
    isSubmitting,
    isDeleting,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  } = useProductEdit()

  if (isNotFound) {
    return (
      <PageContent>
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Product Not Found
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            The merchandise item with ID <code className="font-mono font-semibold">{id}</code> could not be found.
          </p>
          <div className="mt-5">
            <Link to="/dashboard/product">
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer text-xs">
                <ArrowLeft className="size-3.5" />
                Return to Products
              </Button>
            </Link>
          </div>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <div className="max-w-2xl mx-auto pt-2">
        {/* ── Clean & Minimal Form Card ── */}
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Title */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-pname" className="text-xs font-semibold text-foreground">
                  Product Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-pname"
                  placeholder="Product Title"
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
                  <Label htmlFor="edit-psku" className="text-xs font-semibold text-foreground">
                    SKU Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-psku"
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
                  <Label htmlFor="edit-pcat" className="text-xs font-semibold text-foreground">
                    Category
                  </Label>
                  <select
                    id="edit-pcat"
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
                  <Label htmlFor="edit-pprice" className="text-xs font-semibold text-foreground">
                    Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-pprice"
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
                  <Label htmlFor="edit-pstock" className="text-xs font-semibold text-foreground">
                    Stock Units <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-pstock"
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
                <Label htmlFor="edit-pimage" className="text-xs font-semibold text-foreground">
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
                    id="edit-pimage"
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

              {/* Sales Metric Info Snippet */}
              <div className="rounded-lg border border-border/50 bg-muted/20 px-3.5 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="size-4 text-blue-600 dark:text-blue-400" />
                  <span>Historical Store Sales:</span>
                  <span className="font-semibold text-foreground">{product?.salesCount || 0} units purchased</span>
                </div>
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
                  disabled={isSubmitting || isDeleting}
                  className="cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || isDeleting}
                  className="gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black cursor-pointer text-xs"
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
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
