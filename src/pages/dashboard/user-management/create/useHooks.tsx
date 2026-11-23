import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  addUserToStore,
  type UserItem,
} from "../common/mockUser"

export interface UserFormState {
  name: string
  email: string
  role: UserItem["role"]
  status: UserItem["status"]
}

export function useUserCreate() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<UserFormState>({
    name: "",
    email: "",
    role: "Customer",
    status: "Active",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFieldChange = <K extends keyof UserFormState>(
    field: K,
    value: UserFormState[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormState, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const computeInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "U"
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0")
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    const newUser: UserItem = {
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      status: formData.status,
      ordersCount: 0,
      totalSpent: 0,
      joinedDate: formatDate(new Date()),
      avatar: computeInitials(formData.name),
    }

    addUserToStore(newUser)

    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/dashboard/user-management")
    }, 250)
  }

  const handleCancel = () => {
    navigate("/dashboard/user-management")
  }

  return {
    formData,
    errors,
    isSubmitting,
    handleFieldChange,
    handleSubmit,
    handleCancel,
    computeInitials,
  }
}
