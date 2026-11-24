import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export interface AddressItem {
  id: string
  title: string
  tag: "HOME" | "OFFICE" | "OTHER"
  address: string
  phone: string
}

export interface ShippingOption {
  id: string
  title: string
  badge: string
  description: string
  price: number
  estimatedDate: string
}

export type PaymentMethod = "credit-card" | "paypal" | "cod"

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

export const defaultAddresses: AddressItem[] = [
  {
    id: "addr-1",
    title: "2118 Thornridge",
    tag: "HOME",
    address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
    phone: "(209) 555-0104",
  },
  {
    id: "addr-2",
    title: "Headoffice",
    tag: "OFFICE",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    phone: "(704) 555-0127",
  },
]

export const shippingOptions: ShippingOption[] = [
  {
    id: "ship-free",
    title: "Free Delivery",
    badge: "STANDARD",
    description: "Delivery in 5-7 business days",
    price: 0,
    estimatedDate: "Estimated delivery: 3 Nov",
  },
  {
    id: "ship-regular",
    title: "Regular Delivery",
    badge: "POPULAR",
    description: "Delivery in 3-5 business days",
    price: 8.5,
    estimatedDate: "Estimated delivery: 31 Oct",
  },
  {
    id: "ship-express",
    title: "Express Delivery",
    badge: "FAST",
    description: "Delivery in 1-2 business days with priority tracking",
    price: 29.0,
    estimatedDate: "Estimated delivery: 28 Oct",
  },
]

export function useCheckout() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  const [addresses, setAddresses] = useState<AddressItem[]>(defaultAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState<string>("addr-1")
  const [isAddAddressOpen, setIsAddAddressOpen] = useState<boolean>(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

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
    useState<PaymentMethod>("credit-card")

  const cardForm = useForm<CardDetails>({
    resolver: zodResolver(cardDetailsSchema),
    defaultValues: {
      cardNumber: "4242 •••• •••• 4242",
      cardHolder: "Alex Johnson",
      expiryDate: "12/28",
      cvv: "321",
      sameAsBilling: true,
    },
  })

  const [isOrderCompleted, setIsOrderCompleted] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

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
    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((item) =>
          item.id === editingAddressId ? { ...item, ...values } : item
        )
      )
    } else {
      const newId = `addr-${Date.now()}`
      const newAddr: AddressItem = {
        id: newId,
        ...values,
      }
      setAddresses((prev) => [...prev, newAddr])
      setSelectedAddressId(newId)
    }

    setIsAddAddressOpen(false)
  })

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((item) => item.id !== id)
      if (selectedAddressId === id && filtered.length > 0) {
        setSelectedAddressId(filtered[0].id)
      }
      return filtered
    })
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!selectedAddressId) return
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (currentStep === 2) {
      if (!selectedShippingId) return
      setCurrentStep(3)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (currentStep === 3) {
      if (paymentMethod === "credit-card") {
        const valid = await cardForm.trigger()
        if (!valid) return
      }
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setIsOrderCompleted(true)
      }, 1000)
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

  const subtotal = 2347
  const shippingCost = selectedShipping?.price ?? 0
  const tax = 50
  const total = subtotal + shippingCost + tax

  return {
    currentStep,
    setCurrentStep,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddAddressOpen,
    setIsAddAddressOpen,
    editingAddressId,
    addressControl: addressForm.control,
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
    isProcessing,
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
