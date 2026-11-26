import { Check, Heart, Minus, Plus, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  type ProductCategoryItem,
  type ProductItem,
} from "@/services/product.services"

const sanitizeHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")

interface ProductInfoProps {
  product: ProductItem
  category: ProductCategoryItem | null
  currentPrice: number
  originalPrice: number | null
  discountPercent: number
  quantity: number
  maxStock: number
  isOutOfStock: boolean
  isWishlist: boolean
  isAddedToCart: boolean
  isAddingToCart: boolean
  onDecrement: () => void
  onIncrement: () => void
  onAddToCart: () => void
  onToggleWishlist: () => void
}

export function ProductInfo({
  product,
  category,
  currentPrice,
  originalPrice,
  discountPercent,
  quantity,
  maxStock,
  isOutOfStock,
  isWishlist,
  isAddedToCart,
  isAddingToCart,
  onDecrement,
  onIncrement,
  onAddToCart,
  onToggleWishlist,
}: ProductInfoProps) {
  const sanitizedDescription = product.description
    ? sanitizeHtml(product.description)
    : ""

  return (
    <div className="lg:col-span-6 flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        {category && <Badge variant="secondary">{category.name}</Badge>}
        <span className="font-mono text-xs text-muted-foreground">
          SKU: {product.sku}
        </span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-3 mt-3">
          <span className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
            ฿{currentPrice.toLocaleString()}
          </span>
          {originalPrice && (
            <>
              <span className="text-base sm:text-lg text-muted-foreground line-through tabular-nums">
                ฿{originalPrice.toLocaleString()}
              </span>
              <Badge variant="destructive">-{discountPercent}%</Badge>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {sanitizedDescription ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-muted-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        ) : (
          <p className="text-xs sm:text-sm text-muted-foreground">
            No description available for this product.
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span
          className={`size-2 rounded-full ${
            isOutOfStock
              ? "bg-destructive"
              : product.stockStatus === "low_stock"
                ? "bg-amber-500"
                : "bg-emerald-500"
          }`}
        />
        {isOutOfStock ? (
          <span className="font-medium text-destructive">Out of stock</span>
        ) : product.stockStatus === "low_stock" ? (
          <span className="font-medium text-amber-600 dark:text-amber-400">
            Low stock ({maxStock} remaining)
          </span>
        ) : (
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            In stock ({maxStock} available)
          </span>
        )}
      </div>

      {/* Quantity & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <div className="flex items-center justify-between sm:justify-start rounded-lg border border-border px-2 h-11">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onDecrement}
            disabled={isOutOfStock || quantity <= 1}
            className="cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-10 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onIncrement}
            disabled={isOutOfStock || quantity >= maxStock}
            className="cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>

        <Button
          type="button"
          onClick={onAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className="flex-1 h-11 gap-2 rounded-lg text-sm font-medium cursor-pointer"
        >
          {isAddedToCart ? (
            <>
              <Check className="size-4" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              <span>
                {isOutOfStock
                  ? "Out of Stock"
                  : isAddingToCart
                    ? "Adding..."
                    : "Add to Cart"}
              </span>
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onToggleWishlist}
          aria-label="Toggle wishlist"
          className={`size-11 shrink-0 rounded-lg cursor-pointer ${
            isWishlist ? "text-red-500 border-red-500/40" : ""
          }`}
        >
          <Heart className={`size-4 ${isWishlist ? "fill-red-500" : ""}`} />
        </Button>
      </div>
    </div>
  )
}
