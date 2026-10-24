import { useState } from "react"
import { Star, Heart } from "lucide-react"

import type { Product } from "../mockLandingPage"

function ProductCard({ product }: { product: Product }) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-lg border bg-card">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-muted/40">
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover"
          loading="lazy"
        />

        <button
          type="button"
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/20 text-white"
          aria-label="Wishlist"
        >
          <Heart
            className={`size-3.5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
        <div className="flex flex-col gap-1.5">
          <h3 className="line-clamp-2 min-h-8 text-xs font-normal leading-snug text-foreground sm:text-sm">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>

        <div className="mt-2">
          <span className="text-base font-bold text-foreground sm:text-lg">
            ฿{product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
