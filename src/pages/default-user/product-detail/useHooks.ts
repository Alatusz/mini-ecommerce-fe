import { useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { FALLBACK_IMAGE } from "@/lib/constants"
import { getProductById, type ProductItem } from "@/services/product.services"
import { useAuth } from "@/context/AuthContext"
import { useAddToCartMutation } from "@/hooks/use-cartHubs"
import { showToast } from "@/lib/toast"

export function useProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const addToCartMutation = useAddToCartMutation()

  const { data: productRes, isLoading, isError } = useQuery({
    queryKey: ["PRODUCT_DETAIL", id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  })

  const product: ProductItem | undefined = productRes?.data

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [isWishlist, setIsWishlist] = useState<boolean>(false)
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false)

  const thumbnails = useMemo(() => {
    if (product?.images && product.images.length > 0) {
      return product.images
    }
    return [FALLBACK_IMAGE]
  }, [product?.images])

  const currentPrice = Number(
    product?.sellPrice ?? product?.originalPrice ?? 0
  )
  const originalPrice =
    product?.originalPrice && Number(product.originalPrice) > currentPrice
      ? Number(product.originalPrice)
      : null

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0

  const maxStock = Math.max(0, Number(product?.stock ?? 0))
  const isOutOfStock = maxStock <= 0

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleIncrement = () => {
    setQuantity((prev) => (maxStock > 0 ? Math.min(maxStock, prev + 1) : 1))
  }

  const handleAddToCart = () => {
    if (!id || isOutOfStock) return
    if (!user) {
      showToast.error("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า")
      navigate("/login", { state: { from: location } })
      return
    }
    addToCartMutation.mutate(
      { productId: id, quantity },
      {
        onSuccess: () => {
          setIsAddedToCart(true)
          setTimeout(() => setIsAddedToCart(false), 2500)
        },
      }
    )
  }

  const handleToggleWishlist = () => {
    setIsWishlist((prev) => !prev)
  }

  return {
    product,
    isLoading,
    isNotFound: !isLoading && (isError || !product),
    category: product?.categories?.[0] ?? null,
    thumbnails,
    activeImageIndex,
    setActiveImageIndex,
    currentImage: thumbnails[activeImageIndex] || thumbnails[0],
    currentPrice,
    originalPrice,
    discountPercent,
    quantity,
    maxStock,
    isOutOfStock,
    isWishlist,
    isAddedToCart,
    isAddingToCart: addToCartMutation.isPending,
    handleDecrement,
    handleIncrement,
    handleAddToCart,
    handleToggleWishlist,
  }
}
