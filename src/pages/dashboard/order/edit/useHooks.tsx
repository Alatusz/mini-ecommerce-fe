import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  getNextOrderAction,
  useOrderDetailQuery,
  useUpdateOrderStatusMutation,
  type OrderItem,
  type UpdateOrderStatusPayload,
} from "../useHubs"

export type OrderStatus = NonNullable<UpdateOrderStatusPayload["status"]>
export type PaymentStatus = NonNullable<
  UpdateOrderStatusPayload["paymentStatus"]
>

export interface OrderEditFormValues {
  status: OrderStatus
  paymentStatus: PaymentStatus
}

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

export const getStepNumber = (status: string): number =>
  orderSteps.find((s) => s.key === status)?.step ?? 0

export function useOrderEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useOrderDetailQuery(id)
  const updateStatusMutation = useUpdateOrderStatusMutation()
  const order: OrderItem | undefined = data?.data

  const {
    watch,
    reset,
    setValue,
    handleSubmit: rhfHandleSubmit,
    formState: { isDirty },
  } = useForm<OrderEditFormValues>({
    defaultValues: {
      status: "pending",
      paymentStatus: "pending",
    },
  })

  useEffect(() => {
    if (!order) return
    reset({
      status: (order.status as OrderStatus) || "pending",
      paymentStatus: (order.paymentStatus as PaymentStatus) || "pending",
    })
  }, [order, reset])

  const status = watch("status")
  const paymentStatus = watch("paymentStatus")
  const isTerminalOrder =
    order?.status === "cancelled" || order?.status === "delivered"
  const isStatusChanged = Boolean(order && status !== order.status)
  const nextAction = getNextOrderAction(order?.status, order?.paymentMethod)

  const canCancel =
    order?.status === "pending" ||
    (order?.paymentMethod !== "cod" && order?.status === "paid") ||
    (order?.paymentMethod === "cod" && order?.status === "shipped")

  const applyStatusTransition = (nextStatus: OrderStatus) => {
    setValue("status", nextStatus, { shouldDirty: true })

    if (nextStatus === "paid") {
      setValue("paymentStatus", "completed", { shouldDirty: true })
    } else if (nextStatus === "delivered" && order?.paymentMethod === "cod") {
      setValue("paymentStatus", "completed", { shouldDirty: true })
    } else if (nextStatus === "cancelled") {
      setValue(
        "paymentStatus",
        order?.paymentStatus === "completed" ? "refund" : "failed",
        { shouldDirty: true }
      )
    }
  }

  const handleNextStep = () => {
    if (!nextAction || isTerminalOrder) return
    applyStatusTransition(nextAction.nextStatus)
  }

  const handleRequestCancel = () => {
    if (!canCancel) return
    applyStatusTransition("cancelled")
  }

  const handleSubmit = rhfHandleSubmit((values) => {
    if (!id || !order || isTerminalOrder) return

    updateStatusMutation.mutate(
      {
        id,
        payload: { status: values.status },
      },
      {
        onSuccess: () => navigate("/dashboard/order"),
      }
    )
  })

  const handleCancel = () => navigate("/dashboard/order")

  return {
    id,
    order,
    isLoading,
    isNotFound: !isLoading && (isError || !order),
    isTerminalOrder,
    isStatusChanged,
    isDirty,
    nextAction,
    canCancel,
    status,
    paymentStatus,
    currentStepNumber: getStepNumber(status),
    isSubmitting: updateStatusMutation.isPending,
    handleNextStep,
    handleRequestCancel,
    handleSubmit,
    handleCancel,
  }
}
