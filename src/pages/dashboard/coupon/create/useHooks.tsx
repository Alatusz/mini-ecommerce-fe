import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  addCouponToStore,
  computeCouponStatus,
  type CouponItem,
} from "../common/mockCoupon"

export interface CouponFormState {
  code: string
  description: string
  discountType: "percent" | "fixed"
  discountValue: string
  minSpend: string
  usageLimit: string
  startDate: string
  expiredDate: string
}

const getTodayString = (): string => {
  const d = new Date()
  return d.toISOString().split("T")[0]
}

const getFutureDateString = (daysAhead = 30): string => {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().split("T")[0]
}

export function useCouponCreate() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<CouponFormState>({
    code: "",
    description: "",
    discountType: "percent",
    discountValue: "15",
    minSpend: "",
    usageLimit: "500",
    startDate: getTodayString(),
    expiredDate: getFutureDateString(30),
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CouponFormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generateRandomCode = () => {
    const prefixes = ["PROMO", "SAVE", "FLASH", "DEAL", "OFFER", "MEGA", "SPECIAL"]
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const newCode = `${prefix}${randomNum}`

    setFormData((prev) => ({ ...prev, code: newCode }))
    if (errors.code) {
      setErrors((prev) => ({ ...prev, code: undefined }))
    }
  }

  const handleFieldChange = <K extends keyof CouponFormState>(
    field: K,
    value: CouponFormState[K]
  ) => {
    setFormData((prev) => {
      // Auto uppercase code
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
    const newErrors: Partial<Record<keyof CouponFormState, string>> = {}

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

    if (!validate()) return

    setIsSubmitting(true)

    const discountVal = Number(formData.discountValue)
    const minSpendVal = formData.minSpend.trim() ? Number(formData.minSpend) : undefined
    const usageLimitVal = formData.usageLimit.trim() ? Number(formData.usageLimit) : undefined

    const newCoupon: CouponItem = {
      id: `cpn-${Date.now()}`,
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim() || `${discountVal}${formData.discountType === "percent" ? "%" : "$"} discount coupon`,
      discountType: formData.discountType,
      discountValue: discountVal,
      minSpend: minSpendVal,
      usageLimit: usageLimitVal,
      usageCount: 0,
      startDate: formData.startDate,
      expiredDate: formData.expiredDate,
      status: computeCouponStatus(formData.startDate, formData.expiredDate),
    }

    setTimeout(() => {
      addCouponToStore(newCoupon)
      setIsSubmitting(false)
      navigate("/dashboard/coupon")
    }, 400)
  }

  const handleCancel = () => {
    navigate("/dashboard/coupon")
  }

  return {
    formData,
    errors,
    isSubmitting,
    generateRandomCode,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  }
}
