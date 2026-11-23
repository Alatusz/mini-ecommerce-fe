import { useState, useMemo } from "react"
import {
  getStoredCoupons,
  deleteCouponFromStore,
  type CouponItem,
} from "./common/mockCoupon"

export function useCoupon() {
  const [coupons, setCoupons] = useState<CouponItem[]>(() => getStoredCoupons())
  const [filterStatus, setFilterStatus] = useState<string>("All")
  const [filterType, setFilterType] = useState<string>("All")
  const [deletingCoupon, setDeletingCoupon] = useState<CouponItem | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev))
    }, 2000)
  }

  const handleDeleteCoupon = (id: string) => {
    deleteCouponFromStore(id)
    setCoupons(getStoredCoupons())
    setDeletingCoupon(null)
  }

  const filteredCoupons = useMemo(() => {
    return coupons.filter((item) => {
      if (filterStatus !== "All" && item.status !== filterStatus) {
        return false
      }
      if (filterType !== "All" && item.discountType !== filterType) {
        return false
      }
      return true
    })
  }, [coupons, filterStatus, filterType])

  const stats = useMemo(() => {
    const total = coupons.length
    const active = coupons.filter((c) => c.status === "Active").length
    const scheduled = coupons.filter((c) => c.status === "Scheduled").length
    const expired = coupons.filter((c) => c.status === "Expired").length
    const totalRedemptions = coupons.reduce((acc, c) => acc + c.usageCount, 0)

    return {
      total,
      active,
      scheduled,
      expired,
      totalRedemptions,
    }
  }, [coupons])

  return {
    coupons: filteredCoupons,
    rawCoupons: coupons,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    deletingCoupon,
    setDeletingCoupon,
    copiedCode,
    handleCopyCode,
    handleDeleteCoupon,
    stats,
  }
}
