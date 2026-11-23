import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  getUserById,
  updateUserInStore,
  deleteUserFromStore,
  type UserItem,
} from "../common/mockUser"

export interface UserEditFormState {
  name: string
  email: string
  role: UserItem["role"]
  status: UserItem["status"]
}

export function useUserEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [user, setUser] = useState<UserItem | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)
  const [formData, setFormData] = useState<UserEditFormState>({
    name: "",
    email: "",
    role: "Customer",
    status: "Active",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof UserEditFormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const computeInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "U"
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  useEffect(() => {
    if (!id) {
      setIsNotFound(true)
      return
    }

    const found = getUserById(id)
    if (!found) {
      setIsNotFound(true)
      return
    }

    setUser(found)
    setFormData({
      name: found.name,
      email: found.email,
      role: found.role,
      status: found.status,
    })
    setIsNotFound(false)
  }, [id])

  const handleFieldChange = <K extends keyof UserEditFormState>(
    field: K,
    value: UserEditFormState[K]
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
    const newErrors: Partial<Record<keyof UserEditFormState, string>> = {}

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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!id || !validate()) return

    setIsSubmitting(true)

    updateUserInStore(id, {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      status: formData.status,
      avatar: computeInitials(formData.name),
    })

    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/dashboard/user-management")
    }, 250)
  }

  const handleDelete = () => {
    if (!id) return
    setIsDeleting(true)
    deleteUserFromStore(id)
    setTimeout(() => {
      setIsDeleting(false)
      navigate("/dashboard/user-management")
    }, 250)
  }

  const handleCancel = () => {
    navigate("/dashboard/user-management")
  }

  return {
    id,
    user,
    isNotFound,
    formData,
    errors,
    isSubmitting,
    isDeleting,
    handleFieldChange,
    handleSubmit,
    handleDelete,
    handleCancel,
    computeInitials,
  }
}
