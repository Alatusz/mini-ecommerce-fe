import { useState, useMemo } from "react"
import {
  getStoredOrders,
  updateOrderInStore,
  type OrderItem,
} from "@/pages/dashboard/order/common/mockOrder"

export function useMyOrders() {
  const [orders, setOrders] = useState<OrderItem[]>(() => getStoredOrders())
  const [selectedStatus, setSelectedStatus] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)
  const [cancellingOrder, setCancellingOrder] = useState<OrderItem | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isCopiedSuccess, setIsCopiedSuccess] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setIsCopiedSuccess(true)
    setTimeout(() => {
      setCopiedCode(null)
      setIsCopiedSuccess(false)
    }, 2000)
  }

  const handleCancelOrder = (id: string) => {
    updateOrderInStore(id, { status: "Cancelled" })
    setOrders(getStoredOrders())
    setCancellingOrder(null)
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: "Cancelled" } : null))
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (selectedStatus !== "All" && order.status !== selectedStatus) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchNumber = order.orderNumber.toLowerCase().includes(q)
        const matchItem = order.items?.some((item) =>
          item.name.toLowerCase().includes(q)
        )
        const matchCarrier = order.carrier?.toLowerCase().includes(q)
        const matchTracking = order.trackingNumber?.toLowerCase().includes(q)

        return matchNumber || matchItem || matchCarrier || matchTracking
      }

      return true
    })
  }, [orders, selectedStatus, searchQuery])

  const stats = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      processing: orders.filter((o) => o.status === "Processing").length,
      shipped: orders.filter((o) => o.status === "Shipped").length,
      completed: orders.filter((o) => o.status === "Completed").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
    }
  }, [orders])

  return {
    orders: filteredOrders,
    rawOrders: orders,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    selectedOrder,
    setSelectedOrder,
    cancellingOrder,
    setCancellingOrder,
    copiedCode,
    isCopiedSuccess,
    handleCopy,
    handleCancelOrder,
    stats,
  }
}
