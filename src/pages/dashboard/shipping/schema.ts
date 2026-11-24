import { z } from "zod"

export const shippingRateSchema = z
  .object({
    name: z.string().trim().min(1, "Method name is required"),
    price: z.number({ message: "Price is required" }).min(0, "Price must be >= 0"),
    freeMinSpend: z
      .number({ message: "Free shipping threshold must be a number" })
      .min(0, "Must be >= 0")
      .nullable(),
    minDays: z
      .number({ message: "Min days is required" })
      .int("Must be a whole number")
      .min(0, "Min days must be >= 0"),
    maxDays: z
      .number({ message: "Max days is required" })
      .int("Must be a whole number")
      .min(0, "Max days must be >= 0"),
    sortOrder: z
      .number({ message: "Sort order is required" })
      .int("Must be a whole number")
      .min(0, "Sort order must be >= 0"),
    isActive: z.boolean(),
  })
  .refine((data) => data.maxDays >= data.minDays, {
    message: "Max days must be greater than or equal to Min days",
    path: ["maxDays"],
  })

export type ShippingRateFormValues = z.infer<typeof shippingRateSchema>

export const DEFAULT_SHIPPING_RATE_VALUES: ShippingRateFormValues = {
  name: "",
  price: 0,
  freeMinSpend: null,
  minDays: 1,
  maxDays: 3,
  sortOrder: 0,
  isActive: true,
}
