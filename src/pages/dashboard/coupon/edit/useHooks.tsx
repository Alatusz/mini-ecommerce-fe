import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  useCouponDetailQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  type CouponItem,
} from "../useHubs"

export interface CouponEditFormState {
  code: string
  description: string
  discountType: "percent" | "fixed"
  discountValue: string
  minSpend: string
  usageLimit: string
  startDate: string
  expiredDate: string
}

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

  const [formData, setFormData] = useState<CouponEditFormState>({
    code: "",
    description: "",
    discountType: "percent",
    discountValue: "",
    minSpend: "",
    usageLimit: "",
    startDate: "",
    expiredDate: "",
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof CouponEditFormState, string>>
  >({})

  useEffect(() => {
    if (!coupon) return
    setFormData({
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
  }, [coupon])

  const handleFieldChange = <K extends keyof CouponEditFormState>(
    field: K,
    value: CouponEditFormState[K]
  ) => {
    setFormData((prev) => {
      if (field === "code" && typeof value === "string") {
        return { ...prev, code: value.toUpperCase().replace(/\s+/g, "") }
      }
      return { ...prev, [field]: value }
    })

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CouponEditFormState, string>> = {}

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required"
    } else if (formData.code.trim().length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters"
    }

    if (!formData.discountValue.trim()) {
      newErrors.discountValue = "Discount value is required"
    } else {
      const num = Number(formData.discountValue)
      if (isNaN(num) || num <= 0) {
        newErrors.discountValue = "Discount value must be greater than 0"
      } else if (formData.discountType === "percent" && num > 100) {
        newErrors.discountValue = "Percentage discount cannot exceed 100%"
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!formData.expiredDate) {
      newErrors.expiredDate = "Expired date is required"
    } else if (formData.startDate && formData.expiredDate < formData.startDate) {
      newErrors.expiredDate = "Expired date must be after or equal to start date"
    }

    if (formData.minSpend.trim()) {
      const minNum = Number(formData.minSpend)
      if (isNaN(minNum) || minNum < 0) {
        newErrors.minSpend = "Minimum spend must be a valid positive amount"
      }
    }

    if (formData.usageLimit.trim()) {
      const limitNum = Number(formData.usageLimit)
      if (isNaN(limitNum) || limitNum <= 0) {
        newErrors.usageLimit = "Usage limit must be a positive number"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !id) return

    const discountVal = Number(formData.discountValue)
    const minSpendVal = formData.minSpend.trim() ? Number(formData.minSpend) : 0
    const usageLimitVal = formData.usageLimit.trim()
      ? Number(formData.usageLimit)
      : null

    updateMutation.mutate({
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim(),
      discountType: formData.discountType,
      discountValue: discountVal,
      minSpend: minSpendVal,
      usageLimit: usageLimitVal,
      startDate: formData.startDate,
      expiredDate: formData.expiredDate,
    })
  }

  const handleDelete = () => {
    if (!id) return
    deleteMutation.mutate(id)
  }

  const handleCancel = () => {
    navigate("/dashboard/coupon")
  }

  return {
    id,
    coupon,
    isNotFound,
    formData,
    errors,
    isSubmitting: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleFieldChange,
    handleSubmit,
    handleDelete,
    handleCancel,
  }
}
