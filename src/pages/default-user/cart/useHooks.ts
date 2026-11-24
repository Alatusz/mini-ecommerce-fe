import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  useMyCartQuery,
  useUpdateCartQtyMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  type ApiCartItem,
} from "@/hooks/use-cartHubs"

export interface CartItem {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  image: string
}

export function useCart() {
  const navigate = useNavigate()
  const { data, isLoading } = useMyCartQuery()
  const updateQtyMutation = useUpdateCartQtyMutation()
  const removeMutation = useRemoveCartItemMutation()
  const clearMutation = useClearCartMutation()

  const [promoCode, setPromoCode] = useState<string>("")
  const [bonusCard, setBonusCard] = useState<string>("")
  const [discount, setDiscount] = useState<number>(0)
  const isCheckingOut = false

  const cartItems: CartItem[] = useMemo(() => {
    const items: ApiCartItem[] = data?.data?.items ?? []
    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      sku: item.product.slug ? item.product.slug.toUpperCase() : item.productId,
      price: Number(item.product.sellPrice ?? 0),
      quantity: item.quantity,
      image: item.product.images?.[0] || "/alatusz-logo.svg",
    }))
  }, [data])

  const increaseQuantity = (id: string) => {
    const target = cartItems.find((item) => item.id === id)
    if (!target) return
    updateQtyMutation.mutate({ itemId: id, quantity: target.quantity + 1 })
  }

  const decreaseQuantity = (id: string) => {
    const target = cartItems.find((item) => item.id === id)
    if (!target || target.quantity <= 1) return
    updateQtyMutation.mutate({ itemId: id, quantity: target.quantity - 1 })
  }

  const removeItem = (id: string) => {
    removeMutation.mutate(id)
  }

  const handleClearCart = () => {
    clearMutation.mutate()
  }

  const handleApplyBonusCard = () => {
    if (bonusCard.trim()) {
      setDiscount(50)
    }
  }

  const handleApplyPromoCode = () => {
    if (promoCode.trim().toUpperCase() === "DISCOUNT10") {
      setDiscount(100)
    }
  }

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }, [cartItems])

  const tax = cartItems.length > 0 ? 50 : 0
  const shipping = cartItems.length > 0 ? 29 : 0
  const total = Math.max(0, subtotal + tax + shipping - discount)

  const handleCheckout = () => {
    navigate("/checkout")
  }

  return {
    cartItems,
    isLoading,
    isClearing: clearMutation.isPending,
    promoCode,
    bonusCard,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    isCheckingOut,
    setPromoCode,
    setBonusCard,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    handleClearCart,
    handleApplyBonusCard,
    handleApplyPromoCode,
    handleCheckout,
  }
}
