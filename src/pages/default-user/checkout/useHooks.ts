import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { QUERY_KEYS } from "@/lib/constants"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"
import { useMyCartQuery } from "@/hooks/use-cartHubs"
import {
  useAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  type ApiAddressItem,
} from "@/hooks/use-profileHubs"
import { createOrder } from "@/services/order.services"
import { validateCoupon } from "@/services/coupon.services"
import {
  getActiveShippingRates,
  type ShippingRateItem,
} from "@/services/shippingRate.services"

export interface AddressItem {
  id: string
  title: string
  tag: "HOME" | "OFFICE" | "OTHER"
  address: string
  phone: string
  isDefault?: boolean
}

export interface ShippingOption {
  id: string
  title: string
  badge: string
  description: string
  price: number
  estimatedDate: string
}

export interface CheckoutCartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    images?: string[]
    sellPrice?: number | null
    originalPrice?: number | null
  }
}

export type PaymentMethod = "credit_card" | "promptpay" | "cod"

export const checkoutAddressSchema = z.object({
  title: z.string().trim().min(1, "Address title is required"),
  tag: z.enum(["HOME", "OFFICE", "OTHER"]),
  address: z.string().trim().min(1, "Street address is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
})

export const cardDetailsSchema = z.object({
  cardNumber: z.string().trim().min(1, "Card number is required"),
  cardHolder: z.string().trim().min(1, "Cardholder name is required"),
  expiryDate: z.string().trim().min(1, "Expiry date is required"),
  cvv: z.string().trim().min(3, "CVV is required"),
  sameAsBilling: z.boolean(),
})

export type CheckoutAddressValues = z.infer<typeof checkoutAddressSchema>
export type CardDetails = z.infer<typeof cardDetailsSchema>

const normalizeTag = (tag?: string): "HOME" | "OFFICE" | "OTHER" => {
  const upper = (tag || "").toUpperCase()
  if (upper === "HOME" || upper === "OFFICE") return upper
  return "OTHER"
}

export function useCheckout() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState<1 | 2>(1)

  const { data: cartRes, isLoading: isLoadingCart } = useMyCartQuery()
  const { data: addressesRes, isLoading: isLoadingAddresses } =
    useAddressesQuery()
  const { data: shippingRatesRes, isLoading: isLoadingShipping } = useQuery({
    queryKey: [QUERY_KEYS.STOREFRONT.SHIPPING_RATES],
    queryFn: getActiveShippingRates,
  })
  const createAddressMutation = useCreateAddressMutation()
  const updateAddressMutation = useUpdateAddressMutation()
  const deleteAddressMutation = useDeleteAddressMutation()

  const addresses: AddressItem[] = useMemo(() => {
    const raw: ApiAddressItem[] = addressesRes?.data ?? []
    return raw.map((a) => ({
      id: a.id,
      title: a.title,
      tag: normalizeTag(a.tag),
      address: a.address,
      phone: a.phone,
      isDefault: a.isDefault,
    }))
  }, [addressesRes])

  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [isAddAddressOpen, setIsAddAddressOpen] = useState<boolean>(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddressId("")
      return
    }
    if (!selectedAddressId || !addresses.some((a) => a.id === selectedAddressId)) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0]
      setSelectedAddressId(def.id)
    }
  }, [addresses, selectedAddressId])

  const addressForm = useForm<CheckoutAddressValues>({
    resolver: zodResolver(checkoutAddressSchema),
    defaultValues: {
      title: "",
      tag: "HOME",
      address: "",
      phone: "",
    },
  })

  const subtotal: number = Number(cartRes?.data?.totalPrice ?? 0)

  const shippingOptions: ShippingOption[] = useMemo(() => {
    const raw: ShippingRateItem[] = shippingRatesRes?.data ?? []
    return raw.map((rate) => {
      const hasFreeTier =
        rate.freeMinSpend !== null && rate.freeMinSpend !== undefined
      const freeMin = hasFreeTier ? Number(rate.freeMinSpend) : null
      const isFreeBySpend = freeMin !== null && subtotal >= freeMin
      const effectivePrice = isFreeBySpend ? 0 : Number(rate.price)

      const badge =
        effectivePrice === 0
          ? "FREE"
          : rate.maxDays <= 1
            ? "FAST"
            : "STANDARD"

      const description =
        freeMin !== null
          ? isFreeBySpend
            ? `Free shipping unlocked (min spend ฿${freeMin.toLocaleString()})`
            : `Free shipping on orders over ฿${freeMin.toLocaleString()}`
          : "Standard tracked carrier delivery"

      const estimatedDate =
        rate.minDays === rate.maxDays
          ? `Estimated delivery: ${rate.minDays} business day(s)`
          : `Estimated delivery: ${rate.minDays}-${rate.maxDays} business days`

      return {
        id: rate.id,
        title: rate.name,
        badge,
        description,
        price: effectivePrice,
        estimatedDate,
      }
    })
  }, [shippingRatesRes, subtotal])

  const [selectedShippingId, setSelectedShippingId] = useState<string>("")

  useEffect(() => {
    if (shippingOptions.length === 0) {
      setSelectedShippingId("")
      return
    }
    if (
      !selectedShippingId ||
      !shippingOptions.some((s) => s.id === selectedShippingId)
    ) {
      setSelectedShippingId(shippingOptions[0].id)
    }
  }, [shippingOptions, selectedShippingId])

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card")

  const cardForm = useForm<CardDetails>({
    resolver: zodResolver(cardDetailsSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      sameAsBilling: true,
    },
  })

  const [isOrderCompleted, setIsOrderCompleted] = useState<boolean>(false)
  const [createdOrderId, setCreatedOrderId] = useState<string>("")
  const [couponInput, setCouponInput] = useState<string>("")
  const [appliedCoupon, setAppliedCoupon] = useState<{
    couponCode: string
    discountAmount: number
  } | null>(null)

  const validateCouponMutation = useMutation({
    mutationFn: validateCoupon,
    onSuccess: (res) => {
      setAppliedCoupon({
        couponCode: res.data.couponCode,
        discountAmount: Number(res.data.discountAmount),
      })
      showToast.success(`Coupon "${res.data.couponCode}" applied`)
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Invalid coupon code"
      showToast.error(message)
    },
  })

  const handleApplyCoupon = () => {
    const trimmed = couponInput.trim()
    if (!trimmed) {
      showToast.error("Please enter a coupon code")
      return
    }
    validateCouponMutation.mutate({ code: trimmed, subtotal })
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput("")
  }

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (res) => {
      setCreatedOrderId(res?.data?.id || "")
      setIsOrderCompleted(true)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STOREFRONT.CART],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.ORDERS_LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD.COUPONS_LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STOREFRONT.MY_ORDERS],
      })
    },
    onError: (err: any) => {
      showToast.error(
        err?.response?.data?.message || "Failed to place order"
      )
    },
  })

  const handleOpenAddAddress = () => {
    setEditingAddressId(null)
    addressForm.reset({
      title: "",
      tag: "HOME",
      address: "",
      phone: "",
    })
    setIsAddAddressOpen(true)
  }

  const handleOpenEditAddress = (addr: AddressItem) => {
    setEditingAddressId(addr.id)
    addressForm.reset({
      title: addr.title,
      tag: addr.tag,
      address: addr.address,
      phone: addr.phone,
    })
    setIsAddAddressOpen(true)
  }

  const handleSaveAddress = addressForm.handleSubmit((values) => {
    const payload = {
      title: values.title,
      tag: values.tag.toLowerCase(),
      address: values.address,
      phone: values.phone,
    }

    if (editingAddressId) {
      updateAddressMutation.mutate(
        { id: editingAddressId, data: payload },
        { onSuccess: () => setIsAddAddressOpen(false) }
      )
    } else {
      createAddressMutation.mutate(payload, {
        onSuccess: (res) => {
          if (res?.data?.id) {
            setSelectedAddressId(res.data.id)
          }
          setIsAddAddressOpen(false)
        },
      })
    }
  })

  const handleDeleteAddress = (id: string) => {
    deleteAddressMutation.mutate(id)
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!selectedAddressId) {
        showToast.error("Please select or add a shipping address")
        return
      }
      if (!selectedShippingId) {
        showToast.error("Please select a shipping method")
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (!selectedAddressId) {
        showToast.error("Please select a shipping address")
        setCurrentStep(1)
        return
      }
      if (paymentMethod === "credit_card") {
        const valid = await cardForm.trigger()
        if (!valid) return
      }
      createOrderMutation.mutate({
        addressId: selectedAddressId,
        paymentMethod,
        shippingRateId: selectedShippingId || undefined,
        couponCode: appliedCoupon?.couponCode,
      })
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/products")
    } else if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId)
  const selectedShipping = shippingOptions.find(
    (s) => s.id === selectedShippingId
  )

  const cartItems: CheckoutCartItem[] = cartRes?.data?.items ?? []
  const cartItemsCount: number = cartRes?.data?.totalItems ?? 0
  const shippingCost = selectedShipping?.price ?? 0
  const discountAmount = appliedCoupon
    ? Math.min(appliedCoupon.discountAmount, subtotal)
    : 0
  const total = Math.max(0, subtotal - discountAmount) + shippingCost

  return {
    currentStep,
    setCurrentStep,
    isLoading: isLoadingCart || isLoadingAddresses || isLoadingShipping,
    cartItems,
    cartItemsCount,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddAddressOpen,
    setIsAddAddressOpen,
    editingAddressId,
    addressControl: addressForm.control,
    isSavingAddress:
      createAddressMutation.isPending || updateAddressMutation.isPending,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
    shippingOptions,
    selectedShippingId,
    setSelectedShippingId,
    paymentMethod,
    setPaymentMethod,
    cardControl: cardForm.control,
    couponInput,
    setCouponInput,
    appliedCoupon,
    isValidatingCoupon: validateCouponMutation.isPending,
    handleApplyCoupon,
    handleRemoveCoupon,
    isOrderCompleted,
    createdOrderId,
    isProcessing: createOrderMutation.isPending,
    handleNext,
    handleBack,
    selectedAddress,
    selectedShipping,
    subtotal,
    discountAmount,
    shippingCost,
    total,
  }
}
