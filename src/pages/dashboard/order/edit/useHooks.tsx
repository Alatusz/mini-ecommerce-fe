import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
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

  const form = useForm<OrderEditFormValues>({
    defaultValues: {
      status: "pending",
      paymentStatus: "pending",
    },
  })

  useEffect(() => {
    if (!order) return
    form.reset({
      status: (order.status as OrderStatus) || "pending",
      paymentStatus: (order.paymentStatus as PaymentStatus) || "pending",
    })
  }, [order, form])

  const status = form.watch("status")
  const paymentStatus = form.watch("paymentStatus")
  const isLockedCancelled = order?.status === "cancelled"

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (isLockedCancelled) return
    form.setValue("status", newStatus, { shouldDirty: true })
  }

  const handleSetStep = (stepNumber: number) => {
    if (isLockedCancelled) return
    const target = orderSteps.find((s) => s.step === stepNumber)
    if (target) {
      form.setValue("status", target.key, { shouldDirty: true })
    }
  }

  const handlePaymentStatusChange = (newPaymentStatus: PaymentStatus) => {
    form.setValue("paymentStatus", newPaymentStatus, { shouldDirty: true })
  }

  const handleSubmit = form.handleSubmit((values) => {
    if (!id || !order) return

    const payload: UpdateOrderStatusPayload = {
      paymentStatus: values.paymentStatus,
      ...(isLockedCancelled ? {} : { status: values.status }),
    }

    updateStatusMutation.mutate(
      { id, payload },
      {
        onSuccess: () => {
          navigate("/dashboard/order")
        },
      }
    )
  })

  const handleCancel = () => {
    navigate("/dashboard/order")
  }

  return {
    id,
    order,
    control: form.control,
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
