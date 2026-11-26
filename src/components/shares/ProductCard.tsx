import { Link, useLocation, useNavigate } from "react-router-dom"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useAddToCartMutation } from "@/hooks/use-cartHubs"
import { showToast } from "@/lib/toast"

export interface ProductCardData {
  id: string
  name: string
  price: number
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
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const addToCartMutation = useAddToCartMutation()

  const isOutOfStock = product.stock !== undefined && product.stock <= 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      showToast.error("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า")
      navigate("/login", { state: { from: location } })
      return
    }

    addToCartMutation.mutate({ productId: product.id, quantity: 1 })
  }

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

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">
                {product.rating}
              </span>
              <span>({product.reviewCount})</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <span className="text-base font-bold text-foreground sm:text-lg">
            ฿{product.price.toLocaleString()}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isOutOfStock || addToCartMutation.isPending}
            onClick={handleAddToCart}
            className="h-8 w-full cursor-pointer gap-1.5 text-xs"
          >
            <ShoppingCart className="size-3.5" />
            <span>
              {isOutOfStock
                ? "Out of Stock"
                : addToCartMutation.isPending
                  ? "Adding..."
                  : "Add to Cart"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
