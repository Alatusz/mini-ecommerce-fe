import { useState } from "react"
import {
  getStoredOrders,
  deleteOrderFromStore,
  type OrderItem,
} from "./common/mockOrder"

export type { OrderItem }

export function useOrder() {
  const [orders, setOrders] = useState<OrderItem[]>(() => getStoredOrders())
  const [deletingOrder, setDeletingOrder] = useState<OrderItem | null>(null)

  const handleDeleteOrder = (id: string) => {
    deleteOrderFromStore(id)
    setOrders(getStoredOrders())
    setDeletingOrder(null)
  }

  return {
    orders,
    setOrders,
    deletingOrder,
    setDeletingOrder,
    handleDeleteOrder,
  }
}
