import { useState } from "react"
import { Link } from "react-router-dom"
import { Star, Heart } from "lucide-react"

export interface ProductCardData {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category?: string
  brand?: string
  memory?: string
  isNew?: boolean
  isBestSeller?: boolean
  isFeatured?: boolean
  stock?: number
}

interface ProductCardProps {
  product: ProductCardData
}

function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground/30">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-muted/40 overflow-hidden">
        <Link
          to={`/products/${product.id}`}
          className="block size-full"
          title={product.name}
        >
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/20 text-white cursor-pointer transition-colors hover:bg-black/40 z-10"
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
          <Link
            to={`/products/${product.id}`}
            className="hover:underline transition-colors"
            title={product.name}
          >
            <h3 className="line-clamp-2 min-h-8 text-xs font-normal leading-snug text-foreground sm:text-sm">
              {product.name}
            </h3>
          </Link>

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
