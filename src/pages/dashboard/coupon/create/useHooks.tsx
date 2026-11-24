import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCreateCouponMutation } from "../useHubs"

export const couponFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Coupon code is required")
      .min(3, "Coupon code must be at least 3 characters"),
    description: z.string(),
    discountType: z.enum(["percent", "fixed"]),
    discountValue: z
      .string()
      .trim()
      .min(1, "Discount value is required")
      .refine(
        (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
        "Discount value must be greater than 0"
      ),
    minSpend: z
      .string()
      .refine(
        (v) => v.trim() === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0),
        "Minimum spend must be a valid positive amount"
      ),
    usageLimit: z
      .string()
      .refine(
        (v) => v.trim() === "" || (!Number.isNaN(Number(v)) && Number(v) > 0),
        "Usage limit must be a positive number"
      ),
    startDate: z.string().min(1, "Start date is required"),
    expiredDate: z.string().min(1, "Expired date is required"),
  })
  .refine(
    (data) =>
      data.discountType !== "percent" || Number(data.discountValue) <= 100,
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    }
  )
  .refine(
    (data) => !data.startDate || !data.expiredDate || data.expiredDate >= data.startDate,
    {
      message: "Expired date must be after or equal to start date",
      path: ["expiredDate"],
    }
  )

export type CouponFormState = z.infer<typeof couponFormSchema>

const getTodayString = (): string => new Date().toISOString().split("T")[0]

const getFutureDateString = (daysAhead = 30): string => {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().split("T")[0]
}

export function useCouponCreate() {
  const navigate = useNavigate()
  const createMutation = useCreateCouponMutation()

  const form = useForm<CouponFormState>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percent",
      discountValue: "15",
      minSpend: "",
      usageLimit: "500",
      startDate: getTodayString(),
      expiredDate: getFutureDateString(30),
    },
  })

  const generateRandomCode = () => {
    const prefixes = [
      "PROMO",
      "SAVE",
      "FLASH",
      "DEAL",
      "OFFER",
      "MEGA",
      "SPECIAL",
    ]
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    form.setValue("code", `${prefix}${randomNum}`, { shouldValidate: true })
  }

  const handleSubmit = form.handleSubmit((values) => {
    createMutation.mutate({
      code: values.code.trim().toUpperCase(),
      description: values.description.trim() || undefined,
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      minSpend: values.minSpend.trim() ? Number(values.minSpend) : 0,
      usageLimit: values.usageLimit.trim() ? Number(values.usageLimit) : null,
      startDate: values.startDate,
      expiredDate: values.expiredDate,
    })
  })

  const handleCancel = () => {
    navigate("/dashboard/coupon")
  }

  return {
    control: form.control,
    discountType: form.watch("discountType"),
    isSubmitting: createMutation.isPending,
    generateRandomCode,
    handleSubmit,
    handleCancel,
  }
}
