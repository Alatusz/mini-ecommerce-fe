import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { defaultAddresses, type AddressItem } from "../checkout/useHooks"

export interface UserProfileState {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio?: string
}

export function useUserProfile() {
  const { user } = useAuth()

  // Extract initial name from email or defaults
  const emailPrefix = user?.email ? user.email.split("@")[0] : "sarah"
  const defaultFirst = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)

  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "security">("profile")

  // Personal Info Form
  const [profileForm, setProfileForm] = useState<UserProfileState>({
    firstName: defaultFirst || "Sarah",
    lastName: "Williams",
    email: user?.email || "sarah.w@example.com",
    phone: "+66 81 234 5678",
    bio: "Tech enthusiast & online shopping fan.",
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  const handleProfileFieldChange = <K extends keyof UserProfileState>(
    field: K,
    value: UserProfileState[K]
  ) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
    if (profileSuccess) setProfileSuccess(false)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    setTimeout(() => {
      setIsSavingProfile(false)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    }, 500)
  }

  // Password Change Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (!passwordForm.currentPassword) {
      setPasswordError("กรุณากรอกรหัสผ่านปัจจุบัน")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน")
      return
    }

    setIsChangingPassword(true)
    setTimeout(() => {
      setIsChangingPassword(false)
      setPasswordSuccess(true)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTimeout(() => setPasswordSuccess(false), 3000)
    }, 600)
  }

  // Address Management
  const [addresses, setAddresses] = useState<AddressItem[]>([...defaultAddresses])
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
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

  const handleOpenAddAddress = () => {
    setEditingAddressId(null)
    setAddressForm({
      title: "",
      tag: "HOME",
      address: "",
      phone: "",
    })
    setIsAddressModalOpen(true)
  }

  const handleOpenEditAddress = (addr: AddressItem) => {
    setEditingAddressId(addr.id)
    setAddressForm({
      title: addr.title,
      tag: addr.tag,
      address: addr.address,
      phone: addr.phone,
    })
    setIsAddressModalOpen(true)
  }

  const handleSaveAddress = () => {
    if (!addressForm.title.trim() || !addressForm.address.trim()) return

    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddressId
            ? {
                ...a,
                title: addressForm.title,
                tag: addressForm.tag,
                address: addressForm.address,
                phone: addressForm.phone,
              }
            : a
        )
      )
    } else {
      const newAddr: AddressItem = {
        id: `addr-${Date.now()}`,
        title: addressForm.title,
        tag: addressForm.tag,
        address: addressForm.address,
        phone: addressForm.phone,
      }
      setAddresses((prev) => [...prev, newAddr])
    }

    setIsAddressModalOpen(false)
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  return {
    user,
    activeTab,
    setActiveTab,
    profileForm,
    handleProfileFieldChange,
    handleSaveProfile,
    isSavingProfile,
    profileSuccess,
    passwordForm,
    setPasswordForm,
    passwordError,
    passwordSuccess,
    isChangingPassword,
    handlePasswordChange,
    addresses,
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddressId,
    addressForm,
    setAddressForm,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
  }
}
