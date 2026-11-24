import { useState, useMemo } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"
import { useAuth } from "@/context/AuthContext"
import { getMyOrders, cancelOrder } from "@/services/order.services"

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Completed"
  | "Cancelled"

export interface OrderLineItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

export interface OrderItem {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
  total: number
  itemsCount: number
  paymentMethod: string
  shippingAddress?: string
  customer: {
    name: string
    email: string
  }
  trackingNumber?: string
  carrier?: string
  items: OrderLineItem[]
}

const mapOrderStatus = (raw?: string): OrderStatus => {
  switch ((raw || "").toLowerCase()) {
    case "pending":
      return "Pending"
    case "paid":
      return "Processing"
    case "shipped":
      return "Shipped"
    case "delivered":
      return "Completed"
    case "cancelled":
      return "Cancelled"
    default:
      return "Pending"
  }
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  credit_card: "Credit Card",
  promptpay: "PromptPay",
}

export function useMyOrders() {
  const { user } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)
  const [cancellingOrder, setCancellingOrder] = useState<OrderItem | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isCopiedSuccess, setIsCopiedSuccess] = useState(false)

  const { data: myOrdersRes, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.STOREFRONT.MY_ORDERS],
    queryFn: getMyOrders,
    enabled: Boolean(user),
  })

  const orders: OrderItem[] = useMemo(() => {
    const rawList: any[] = myOrdersRes?.data ?? []
    return rawList.map((o) => {
      const items: OrderLineItem[] = (o.items ?? []).map((item: any) => ({
        id: item.productId || item.id,
        name: item.product?.name || item.productId,
        price: Number(item.price ?? 0),
        quantity: Number(item.quantity ?? 1),
        image: item.product?.images?.[0] || "/alatusz-logo.svg",
      }))

      return {
        id: o.id,
        orderNumber: o.id,
        date: o.createdAt
          ? new Date(o.createdAt).toLocaleDateString("th-TH", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—",
        status: mapOrderStatus(o.status),
        total: Number(o.totalAmount ?? 0),
        itemsCount: items.reduce((sum, i) => sum + i.quantity, 0),
        paymentMethod:
          PAYMENT_METHOD_LABELS[o.paymentMethod] || o.paymentMethod || "—",
        shippingAddress: o.shippingAddress || "",
        customer: {
          name: o.shippingPhone || user?.email || "Customer",
          email: user?.email || "",
        },
        items,
      }
    })
  }, [myOrdersRes, user?.email])

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: (_res, id) => {
      showToast.success("ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STOREFRONT.MY_ORDERS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.ORDERS_LIST],
      })
      setCancellingOrder(null)
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: "Cancelled" } : null
        )
      }
    },
    onError: (err: any) => {
      showToast.error(
        err?.response?.data?.message || "ไม่สามารถยกเลิกคำสั่งซื้อได้"
      )
    },
  })

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
    cancelMutation.mutate(id)
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (selectedStatus !== "All" && order.status !== selectedStatus) {
        return false
      }

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
    isLoading,
    isCancelling: cancelMutation.isPending,
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
