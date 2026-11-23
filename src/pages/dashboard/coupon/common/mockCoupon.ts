export interface CouponItem {
  id: string
  code: string
  description: string
  discountType: "percent" | "fixed"
  discountValue: number
  minSpend?: number
  usageLimit?: number
  usageCount: number
  startDate: string
  expiredDate: string
  status: "Active" | "Scheduled" | "Expired"
}

// Calculate status based on current date
export const computeCouponStatus = (
  startDate: string,
  expiredDate: string
): "Active" | "Scheduled" | "Expired" => {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(expiredDate)
  // Set end date to end of day
  end.setHours(23, 59, 59, 999)

  if (now < start) {
    return "Scheduled"
  } else if (now > end) {
    return "Expired"
  }
  return "Active"
}

export const initialCoupons: CouponItem[] = [
  {
    id: "cpn-1",
    code: "WELCOME15",
    description: "15% discount for first-time shoppers on all electronics",
    discountType: "percent",
    discountValue: 15,
    minSpend: 50,
    usageLimit: 1000,
    usageCount: 342,
    startDate: "2026-10-01",
    expiredDate: "2026-12-31",
    status: "Active",
  },
  {
    id: "cpn-2",
    code: "FLASH50",
    description: "$50 flat discount on flagship smartphones and laptops",
    discountType: "fixed",
    discountValue: 50,
    minSpend: 500,
    usageLimit: 200,
    usageCount: 189,
    startDate: "2026-10-20",
    expiredDate: "2026-11-05",
    status: "Active",
  },
  {
    id: "cpn-3",
    code: "MEGA25",
    description: "25% mega discount weekend promotion across audio & gadgets",
    discountType: "percent",
    discountValue: 25,
    minSpend: 100,
    usageLimit: 500,
    usageCount: 500,
    startDate: "2026-10-10",
    expiredDate: "2026-10-25",
    status: "Expired",
  },
  {
    id: "cpn-4",
    code: "BLACKFRIDAY100",
    description: "$100 super voucher for upcoming Black Friday annual event",
    discountType: "fixed",
    discountValue: 100,
    minSpend: 800,
    usageLimit: 300,
    usageCount: 0,
    startDate: "2026-11-20",
    expiredDate: "2026-11-30",
    status: "Scheduled",
  },
  {
    id: "cpn-5",
    code: "AUDIO10",
    description: "10% off all wireless headphones and studio speakers",
    discountType: "percent",
    discountValue: 10,
    minSpend: 30,
    usageLimit: 400,
    usageCount: 128,
    startDate: "2026-10-01",
    expiredDate: "2026-11-15",
    status: "Active",
  },
  {
    id: "cpn-6",
    code: "SAVE20",
    description: "$20 off on smart watches and wearable accessories",
    discountType: "fixed",
    discountValue: 20,
    minSpend: 150,
    usageLimit: 250,
    usageCount: 94,
    startDate: "2026-10-15",
    expiredDate: "2026-11-20",
    status: "Active",
  },
]

let couponStore: CouponItem[] = [...initialCoupons]

export const getStoredCoupons = (): CouponItem[] => {
  return [...couponStore]
}

export const getCouponById = (id: string): CouponItem | undefined => {
  return couponStore.find((c) => c.id === id)
}

export const addCouponToStore = (coupon: CouponItem): void => {
  couponStore = [coupon, ...couponStore]
}

export const updateCouponInStore = (
  id: string,
  updated: Partial<CouponItem>
): CouponItem | null => {
  const index = couponStore.findIndex((c) => c.id === id)
  if (index === -1) return null

  const updatedItem = {
    ...couponStore[index],
    ...updated,
  }

  // Recalculate status if dates changed
  if (updated.startDate || updated.expiredDate) {
    updatedItem.status = computeCouponStatus(
      updatedItem.startDate,
      updatedItem.expiredDate
    )
  }

  couponStore[index] = updatedItem
  return updatedItem
}

export const deleteCouponFromStore = (id: string): boolean => {
  const initialLen = couponStore.length
  couponStore = couponStore.filter((c) => c.id !== id)
  return couponStore.length < initialLen
}
