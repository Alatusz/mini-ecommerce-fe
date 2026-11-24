import { useState, useMemo } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProductById, type ProductItem } from "@/services/product.services"
import { useAuth } from "@/context/AuthContext"
import { useAddToCartMutation } from "@/hooks/use-cartHubs"
import { showToast } from "@/lib/toast"

export interface ColorOption {
  id: string
  name: string
  hex: string
  image: string
}

export interface StorageOption {
  size: string
  price: number
  originalPrice: number
}

export const colorOptions: ColorOption[] = [
  {
    id: "black",
    name: "Space Black",
    hex: "#1f2022",
    image: "/images/detail-black.png",
  },
  {
    id: "purple",
    name: "Deep Purple",
    hex: "#5e2d91",
    image: "/images/detail-purple.png",
  },
  { id: "red", name: "Red", hex: "#e11a2a", image: "/images/detail-red.png" },
  {
    id: "gold",
    name: "Gold",
    hex: "#e5a900",
    image: "/images/detail-gold.png",
  },
  {
    id: "silver",
    name: "Silver",
    hex: "#e3e4e6",
    image: "/images/detail-silver.png",
  },
]

export const storageOptions: StorageOption[] = [
  { size: "128GB", price: 1199, originalPrice: 1299 },
  { size: "256GB", price: 1299, originalPrice: 1399 },
  { size: "512GB", price: 1349, originalPrice: 1449 },
  { size: "1TB", price: 1399, originalPrice: 1499 },
]

export function useProductDetail() {
  const { id } = useParams<{ id: string }>()

  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const addToCartMutation = useAddToCartMutation()

  const { data: productRes, isLoading } = useQuery({
    queryKey: ["PRODUCT_DETAIL", id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  })

  const apiProduct: ProductItem | undefined = productRes?.data
  const product = useMemo(() => {
    if (!apiProduct) return null
    return {
      ...apiProduct,
      price: Number(apiProduct.sellPrice ?? apiProduct.originalPrice ?? 0),
      originalPrice: apiProduct.originalPrice
        ? Number(apiProduct.originalPrice)
        : undefined,
      image: apiProduct.images?.[0] || "/alatusz-logo.svg",
    }
  }, [apiProduct])

  // Active state: purple and 1TB by default to match attachment design
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    colorOptions[1]
  )
  const [selectedStorage, setSelectedStorage] = useState<StorageOption>(
    storageOptions[3]
  )
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const [isWishlist, setIsWishlist] = useState<boolean>(false)
  const [isMoreDesc, setIsMoreDesc] = useState<boolean>(false)
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false)

  // Thumbnails matching product image or attachment design
  const thumbnails = useMemo(() => {
    if (product?.images && product.images.length > 0) {
      return product.images
    }
    return [
      selectedColor.image,
      "/images/thumb-front.png",
      "/images/thumb-back.png",
      "/images/thumb-side.png",
    ]
  }, [product, selectedColor.image])

  const handleAddToCart = () => {
    if (!id) return
    if (!user) {
      showToast.error("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า")
      navigate("/login", { state: { from: location } })
      return
    }
    addToCartMutation.mutate(
      { productId: id, quantity: 1 },
      {
        onSuccess: () => {
          setIsAddedToCart(true)
          setTimeout(() => setIsAddedToCart(false), 2500)
        },
      }
    )
  }

  const handleSelectColor = (color: ColorOption) => {
    setSelectedColor(color)
    setActiveImageIndex(0)
  }

  const handleToggleWishlist = () => {
    setIsWishlist((prev) => !prev)
  }

  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false)

  const handleToggleDetails = () => {
    setIsDetailsExpanded((prev) => !prev)
  }

  const productName = product?.name || "Apple iPhone 14 Pro Max"
  const currentPrice = product?.price || selectedStorage.price
  const currentOriginalPrice =
    product?.originalPrice ||
    (product?.price
      ? Math.round(product.price * 1.15)
      : selectedStorage.originalPrice)
  const isThaiPrice = !!product?.price && product.price > 2000

  return {
    id,
    product,
    isLoading,
    productName,
    currentPrice,
    currentOriginalPrice,
    isThaiPrice,
    selectedColor,
    selectedStorage,
    activeImageIndex,
    isWishlist,
    isMoreDesc,
    isAddedToCart,
    isDetailsExpanded,
    thumbnails,
    currentImage: thumbnails[activeImageIndex] || thumbnails[0],
    handleSelectColor,
    setSelectedStorage,
    setActiveImageIndex,
    handleToggleWishlist,
    setIsMoreDesc,
    handleAddToCart,
    handleToggleDetails,
  }
}
