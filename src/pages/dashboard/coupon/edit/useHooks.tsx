import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useCouponDetailQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  type CouponItem,
} from "../useHubs"
import {
  couponFormSchema,
  type CouponFormState,
} from "../create/useHooks"

export type CouponEditFormState = CouponFormState

export function useCouponEdit() {
  const { id = "" } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useCouponDetailQuery(id)
  const updateMutation = useUpdateCouponMutation(id)
  const deleteMutation = useDeleteCouponMutation(() =>
    navigate("/dashboard/coupon")
  )

  const coupon: CouponItem | null = data?.data ?? null
  const isNotFound = !isLoading && (!id || isError || !coupon)

  const form = useForm<CouponEditFormState>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percent",
      discountValue: "",
      minSpend: "",
      usageLimit: "",
      startDate: "",
      expiredDate: "",
    },
  })

  useEffect(() => {
    if (!coupon) return
    form.reset({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minSpend: coupon.minSpend !== undefined ? String(coupon.minSpend) : "",
      usageLimit:
        coupon.usageLimit !== null && coupon.usageLimit !== undefined
          ? String(coupon.usageLimit)
          : "",
      startDate: coupon.startDate ? coupon.startDate.slice(0, 10) : "",
      expiredDate: coupon.expiredDate ? coupon.expiredDate.slice(0, 10) : "",
    })
  }, [coupon, form])

  const handleSubmit = form.handleSubmit((values) => {
    if (!id) return
    updateMutation.mutate({
      code: values.code.trim().toUpperCase(),
      description: values.description.trim(),
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      minSpend: values.minSpend.trim() ? Number(values.minSpend) : 0,
      usageLimit: values.usageLimit.trim() ? Number(values.usageLimit) : null,
      startDate: values.startDate,
      expiredDate: values.expiredDate,
    })
  })

  const handleDelete = () => {
    if (!id) return
    deleteMutation.mutate(id)
  }

  const handleCancel = () => {
    navigate("/dashboard/coupon")
  }

  const watchedValues = form.watch()

  return {
    id,
    coupon,
    isNotFound,
    control: form.control,
    watchedValues,
    isSubmitting: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleSubmit,
    handleDelete,
    handleCancel,
  }
}
