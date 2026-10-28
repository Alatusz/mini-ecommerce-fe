import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  getOrderById,
  updateOrderInStore,
  deleteOrderFromStore,
  type OrderItem,
} from "../common/mockOrder"

export interface OrderStep {
  step: number
  key: "Pending" | "Processing" | "Shipped" | "Completed"
  label: string
  subLabel: string
  description: string
}

export const orderSteps: OrderStep[] = [
  {
    step: 1,
    key: "Pending",
    label: "Pending",
    subLabel: "Order Placed",
    description: "Customer has submitted the order; awaiting payment verification.",
  },
  {
    step: 2,
    key: "Processing",
    label: "Processing",
    subLabel: "Packaging",
    description: "Order confirmed; warehouse staff is preparing and packing the merchandise.",
  },
  {
    step: 3,
    key: "Shipped",
    label: "Shipped",
    subLabel: "In Transit",
    description: "Package has been dispatched and handed over to the courier service.",
  },
  {
    step: 4,
    key: "Completed",
    label: "Completed",
    subLabel: "Delivered",
    description: "Shipment delivered to the customer destination. Order fulfilled and completed.",
  },
]

export const getStepNumber = (status: OrderItem["status"]): number => {
  switch (status) {
    case "Pending":
      return 1
    case "Processing":
      return 2
    case "Shipped":
      return 3
    case "Completed":
      return 4
    case "Cancelled":
      return 0
  }
}

export function useOrderEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [order, setOrder] = useState<OrderItem | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)
  const [status, setStatus] = useState<OrderItem["status"]>("Pending")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!id) {
      setIsNotFound(true)
      return
    }

    const found = getOrderById(id)
    if (!found) {
      setIsNotFound(true)
      return
    }

    setOrder(found)
    setStatus(found.status)
    setIsNotFound(false)
  }, [id])

  const handleStatusChange = (newStatus: OrderItem["status"]) => {
    setStatus(newStatus)
  }

  const handleSetStep = (stepNumber: number) => {
    const target = orderSteps.find((s) => s.step === stepNumber)
    if (target) {
      setStatus(target.key)
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!id) return

    setIsSubmitting(true)

    updateOrderInStore(id, {
      status,
    })

    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/dashboard/order")
    }, 250)
  }

  const handleDelete = () => {
    if (!id) return
    setIsDeleting(true)
    deleteOrderFromStore(id)
    setTimeout(() => {
      setIsDeleting(false)
      navigate("/dashboard/order")
    }, 250)
  }

  const handleCancel = () => {
    navigate("/dashboard/order")
  }

  return {
    id,
    order,
    isNotFound,
    status,
    currentStepNumber: getStepNumber(status),
    isSubmitting,
    isDeleting,
    handleStatusChange,
    handleSetStep,
    handleSubmit,
    handleDelete,
    handleCancel,
  }
}
