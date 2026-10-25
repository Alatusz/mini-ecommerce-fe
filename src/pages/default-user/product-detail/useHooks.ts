import { useState } from "react"
import { useParams } from "react-router-dom"

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
  { id: "black", name: "Space Black", hex: "#1f2022", image: "/images/detail-black.png" },
  { id: "purple", name: "Deep Purple", hex: "#5e2d91", image: "/images/detail-purple.png" },
  { id: "red", name: "Red", hex: "#e11a2a", image: "/images/detail-red.png" },
  { id: "gold", name: "Gold", hex: "#e5a900", image: "/images/detail-gold.png" },
  { id: "silver", name: "Silver", hex: "#e3e4e6", image: "/images/detail-silver.png" },
]

export const storageOptions: StorageOption[] = [
  { size: "128GB", price: 1199, originalPrice: 1299 },
  { size: "256GB", price: 1299, originalPrice: 1399 },
  { size: "512GB", price: 1349, originalPrice: 1449 },
  { size: "1TB", price: 1399, originalPrice: 1499 },
]

export function useProductDetail() {
  const { id } = useParams<{ id: string }>()

  // Active state: purple and 1TB by default to match attachment design
  const [selectedColor, setSelectedColor] = useState<ColorOption>(colorOptions[1])
  const [selectedStorage, setSelectedStorage] = useState<StorageOption>(storageOptions[3])
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const [isWishlist, setIsWishlist] = useState<boolean>(false)
  const [isMoreDesc, setIsMoreDesc] = useState<boolean>(false)
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false)

  // 4 thumbnails matching the attachment
  const thumbnails = [
    selectedColor.image,
    "/images/thumb-front.png",
    "/images/thumb-back.png",
    "/images/thumb-side.png",
  ]

  const handleSelectColor = (color: ColorOption) => {
    setSelectedColor(color)
    setActiveImageIndex(0)
  }

  const handleToggleWishlist = () => {
    setIsWishlist((prev) => !prev)
  }

  const handleAddToCart = () => {
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2500)
  }

  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false)

  const handleToggleDetails = () => {
    setIsDetailsExpanded((prev) => !prev)
  }

  return {
    id,
    selectedColor,
    selectedStorage,
    activeImageIndex,
    isWishlist,
    isMoreDesc,
    isAddedToCart,
    isDetailsExpanded,
    thumbnails,
    currentImage: thumbnails[activeImageIndex] || selectedColor.image,
    handleSelectColor,
    setSelectedStorage,
    setActiveImageIndex,
    handleToggleWishlist,
    setIsMoreDesc,
    handleAddToCart,
    handleToggleDetails,
  }
}
