import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"

export interface CartItem {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
  image: string
}

export const initialCartItems: CartItem[] = [
  {
    id: "cart-1",
    name: "Apple iPhone 14 Pro Max 128Gb Deep Purple",
    sku: "#25139526913984",
    price: 1399,
    quantity: 1,
    image: "/images/detail-purple.png",
  },
  {
    id: "cart-2",
    name: "AirPods Max Silver",
    sku: "#53459358345",
    price: 549,
    quantity: 1,
    image: "/images/hero-airpods.png",
  },
  {
    id: "cart-3",
    name: "Apple Watch Series 9 GPS 41mm Starlight Aluminium",
    sku: "#63632324",
    price: 399,
    quantity: 1,
    image: "/images/cart-watch.png",
  },
]

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [promoCode, setPromoCode] = useState<string>("")
  const [bonusCard, setBonusCard] = useState<string>("")
  const [discount, setDiscount] = useState<number>(0)
  const isCheckingOut = false

  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleApplyBonusCard = () => {
    if (bonusCard.trim()) {
      // 5% bonus discount
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

  const navigate = useNavigate()

  const handleCheckout = () => {
    navigate("/checkout")
  }

  return {
    cartItems,
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
    handleApplyBonusCard,
    handleApplyPromoCode,
    handleCheckout,
  }
}
