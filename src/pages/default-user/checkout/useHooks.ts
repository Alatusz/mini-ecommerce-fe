import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
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

export const shippingOptions: ShippingOption[] = [
  {
    id: "ship-free",
    title: "Free Delivery",
    badge: "STANDARD",
    description: "Delivery in 5-7 business days",
    price: 0,
    estimatedDate: "Estimated delivery: 3-5 business days",
  },
  {
    id: "ship-regular",
    title: "Regular Delivery",
    badge: "POPULAR",
    description: "Delivery in 2-3 business days",
    price: 50,
    estimatedDate: "Estimated delivery: 2-3 business days",
  },
  {
    id: "ship-express",
    title: "Express Delivery",
    badge: "FAST",
    description: "Next-day priority delivery with tracking",
    price: 120,
    estimatedDate: "Estimated delivery: Tomorrow",
  },
]

const normalizeTag = (tag?: string): "HOME" | "OFFICE" | "OTHER" => {
  const upper = (tag || "").toUpperCase()
  if (upper === "HOME" || upper === "OFFICE") return upper
  return "OTHER"
}

export function useCheckout() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  const { data: cartRes, isLoading: isLoadingCart } = useMyCartQuery()
  const { data: addressesRes, isLoading: isLoadingAddresses } =
    useAddressesQuery()
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

  const [selectedShippingId, setSelectedShippingId] =
    useState<string>("ship-free")

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
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (currentStep === 2) {
      if (!selectedShippingId) return
      setCurrentStep(3)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (currentStep === 3) {
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
      })
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/cart")
    } else if (currentStep === 2) {
      setCurrentStep(1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (currentStep === 3) {
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId)
  const selectedShipping = shippingOptions.find(
    (s) => s.id === selectedShippingId
  )

  const cartItemsCount: number = cartRes?.data?.totalItems ?? 0
  const subtotal: number = Number(cartRes?.data?.totalPrice ?? 0)
  const shippingCost = selectedShipping?.price ?? 0
  const tax = 0
  const total = subtotal + shippingCost + tax

  return {
    currentStep,
    setCurrentStep,
    isLoading: isLoadingCart || isLoadingAddresses,
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
    isOrderCompleted,
    createdOrderId,
    isProcessing: createOrderMutation.isPending,
    handleNext,
    handleBack,
    selectedAddress,
    selectedShipping,
    subtotal,
    shippingCost,
    tax,
    total,
  }
}
