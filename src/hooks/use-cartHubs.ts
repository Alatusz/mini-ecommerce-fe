import { useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"
import { useAuth } from "@/context/AuthContext"
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  type IAddToCart,
} from "@/services/cart.services"

export interface ApiCartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    sellPrice: number | null
    images: string[]
    stock: number
  }
}

export function useMyCartQuery() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [QUERY_KEYS.STOREFRONT.CART],
    queryFn: getCart,
    enabled: Boolean(user),
  })
}

export function useAddToCartMutation() {
  return useMutation({
    mutationFn: (payload: IAddToCart) => addToCart(payload),
    onSuccess: () => {
      showToast.success("เพิ่มสินค้าลงตะกร้าแล้ว")
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STOREFRONT.CART] })
    },
    onError: (err: any) => {
      showToast.error(
        err?.response?.data?.message || "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้"
      )
    },
  })
}

export function useUpdateCartQtyMutation() {
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItemQuantity(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STOREFRONT.CART] })
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || "อัปเดตจำนวนไม่สำเร็จ")
    },
  })
}

export function useRemoveCartItemMutation() {
  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => {
      showToast.success("ลบสินค้าออกจากตะกร้าแล้ว")
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STOREFRONT.CART] })
    },
  })
}

export function useClearCartMutation() {
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      showToast.success("ล้างตะกร้าสินค้าทั้งหมดแล้ว")
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STOREFRONT.CART] })
    },
  })
}
