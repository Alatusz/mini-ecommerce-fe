import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

export interface CardDetails {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  sameAsBilling: boolean
}

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

  // Stepper state: 1 = Address, 2 = Shipping, 3 = Payment
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // Step 1: Address states
  const [addresses, setAddresses] = useState<AddressItem[]>(defaultAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState<string>("addr-1")
  const [isAddAddressOpen, setIsAddAddressOpen] = useState<boolean>(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState<{
    title: string
    tag: "HOME" | "OFFICE" | "OTHER"
    address: string
    phone: string
  }>({
    title: "",
    tag: "HOME",
    address: "",
    phone: "",
  })

  // Step 2: Shipping states
  const [selectedShippingId, setSelectedShippingId] =
    useState<string>("ship-free")

  // Step 3: Payment states
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit-card")
  const [cardForm, setCardForm] = useState<CardDetails>({
    cardNumber: "4242 •••• •••• 4242",
    cardHolder: "Alex Johnson",
    expiryDate: "12/28",
    cvv: "321",
    sameAsBilling: true,
  })

  // Completion state
  const [isOrderCompleted, setIsOrderCompleted] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  // Address actions
  const handleOpenAddAddress = () => {
    setEditingAddressId(null)
    setAddressForm({
      title: "",
      tag: "HOME",
      address: "",
      phone: "",
    })
    setIsAddAddressOpen(true)
  }

  const handleOpenEditAddress = (addr: AddressItem) => {
    setEditingAddressId(addr.id)
    setAddressForm({
      title: addr.title,
      tag: addr.tag,
      address: addr.address,
      phone: addr.phone,
    })
    setIsAddAddressOpen(true)
  }

  const handleSaveAddress = () => {
    if (!addressForm.title.trim() || !addressForm.address.trim()) return

    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((item) =>
          item.id === editingAddressId
            ? { ...item, ...addressForm }
            : item
        )
      )
    } else {
      const newId = `addr-${Date.now()}`
      const newAddr: AddressItem = {
        id: newId,
        ...addressForm,
      }
      setAddresses((prev) => [...prev, newAddr])
      setSelectedAddressId(newId)
    }

    setIsAddAddressOpen(false)
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((item) => item.id !== id)
      if (selectedAddressId === id && filtered.length > 0) {
        setSelectedAddressId(filtered[0].id)
      }
      return filtered
    })
  }

  // Navigation actions
  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedAddressId) return
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (currentStep === 2) {
      if (!selectedShippingId) return
      setCurrentStep(3)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (currentStep === 3) {
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

  // Subtotal & summary
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
    addressForm,
    setAddressForm,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
    shippingOptions,
    selectedShippingId,
    setSelectedShippingId,
    paymentMethod,
    setPaymentMethod,
    cardForm,
    setCardForm,
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
