import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  useOrderDetailQuery,
  useUpdateOrderStatusMutation,
  type OrderItem,
  type UpdateOrderStatusPayload,
} from "../useHubs"

export type OrderStatus = NonNullable<UpdateOrderStatusPayload["status"]>
export type PaymentStatus = NonNullable<
  UpdateOrderStatusPayload["paymentStatus"]
>

export interface OrderStep {
  step: number
  key: Exclude<OrderStatus, "cancelled">
  label: string
  subLabel: string
}

export const orderSteps: OrderStep[] = [
  {
    step: 1,
    key: "pending",
    label: "Pending",
    subLabel: "Order Placed",
  },
  {
    step: 2,
    key: "paid",
    label: "Paid",
    subLabel: "Payment Verified",
  },
  {
    step: 3,
    key: "shipped",
    label: "Shipped",
    subLabel: "In Transit",
  },
  {
    step: 4,
    key: "delivered",
    label: "Delivered",
    subLabel: "Completed",
  },
]

export const getStepNumber = (status: string): number => {
  switch (status) {
    case "pending":
      return 1
    case "paid":
      return 2
    case "shipped":
      return 3
    case "delivered":
      return 4
    default:
      return 0
  }
}

export function useOrderEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useOrderDetailQuery(id)
  const updateStatusMutation = useUpdateOrderStatusMutation()

  const order: OrderItem | undefined = data?.data

  const [status, setStatus] = useState<OrderStatus>("pending")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending")

  useEffect(() => {
    if (!order) return
    setStatus((order.status as OrderStatus) || "pending")
    setPaymentStatus((order.paymentStatus as PaymentStatus) || "pending")
  }, [order])

  const isLockedCancelled = order?.status === "cancelled"

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (isLockedCancelled) return
    setStatus(newStatus)
  }

  const handleSetStep = (stepNumber: number) => {
    if (isLockedCancelled) return
    const target = orderSteps.find((s) => s.step === stepNumber)
    if (target) {
      setStatus(target.key)
    }
  }

  const handlePaymentStatusChange = (newPaymentStatus: PaymentStatus) => {
    setPaymentStatus(newPaymentStatus)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!id || !order) return

    const payload: UpdateOrderStatusPayload = {
      paymentStatus,
      ...(isLockedCancelled ? {} : { status }),
    }

    updateStatusMutation.mutate(
      { id, payload },
      {
        onSuccess: () => {
          navigate("/dashboard/order")
        },
      }
    )
  }

  const handleCancel = () => {
    navigate("/dashboard/order")
  }

  return {
    id,
    order,
    isLoading,
    isNotFound: !isLoading && (isError || !order),
    isLockedCancelled,
    status,
    paymentStatus,
    currentStepNumber: getStepNumber(status),
    isSubmitting: updateStatusMutation.isPending,
    handleStatusChange,
    handleSetStep,
    handlePaymentStatusChange,
    handleSubmit,
    handleCancel,
  }
}
