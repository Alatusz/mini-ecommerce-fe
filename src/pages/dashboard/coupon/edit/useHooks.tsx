import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  getCouponById,
  updateCouponInStore,
  deleteCouponFromStore,
  type CouponItem,
} from "../common/mockCoupon"

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
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [coupon, setCoupon] = useState<CouponItem | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)
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

  const [errors, setErrors] = useState<Partial<Record<keyof CouponEditFormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!id) {
      setIsNotFound(true)
      return
    }

    const found = getCouponById(id)
    if (!found) {
      setIsNotFound(true)
      return
    }

    setCoupon(found)
    setFormData({
      code: found.code,
      description: found.description || "",
      discountType: found.discountType,
      discountValue: String(found.discountValue),
      minSpend: found.minSpend !== undefined ? String(found.minSpend) : "",
      usageLimit: found.usageLimit !== undefined ? String(found.usageLimit) : "",
      startDate: found.startDate,
      expiredDate: found.expiredDate,
    })
    setIsNotFound(false)
  }, [id])

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

    setIsSubmitting(true)

    const discountVal = Number(formData.discountValue)
    const minSpendVal = formData.minSpend.trim() ? Number(formData.minSpend) : undefined
    const usageLimitVal = formData.usageLimit.trim() ? Number(formData.usageLimit) : undefined

    setTimeout(() => {
      updateCouponInStore(id, {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: discountVal,
        minSpend: minSpendVal,
        usageLimit: usageLimitVal,
        startDate: formData.startDate,
        expiredDate: formData.expiredDate,
      })

      setIsSubmitting(false)
      navigate("/dashboard/coupon")
    }, 400)
  }

  const handleDelete = () => {
    if (!id) return
    setIsDeleting(true)
    setTimeout(() => {
      deleteCouponFromStore(id)
      setIsDeleting(false)
      navigate("/dashboard/coupon")
    }, 300)
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
    isSubmitting,
    isDeleting,
    handleFieldChange,
    handleSubmit,
    handleDelete,
    handleCancel,
  }
}
