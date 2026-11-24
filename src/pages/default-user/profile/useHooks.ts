import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { type AddressItem } from "../checkout/useHooks"
import {
  useProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  type ApiAddressItem,
} from "@/hooks/use-profileHubs"

export interface UserProfileState {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio?: string
}

const normalizeTag = (tag?: string): "HOME" | "OFFICE" | "OTHER" => {
  const upper = (tag || "").toUpperCase()
  if (upper === "HOME" || upper === "OFFICE") return upper
  return "OTHER"
}

export function useUserProfile() {
  const { user } = useAuth()
  const { data: profileRes, isLoading: isLoadingProfile } = useProfileQuery()
  const updateProfileMutation = useUpdateProfileMutation()
  const changePasswordMutation = useChangePasswordMutation()

  const { data: addressesRes } = useAddressesQuery()
  const createAddressMutation = useCreateAddressMutation()
  const updateAddressMutation = useUpdateAddressMutation()
  const deleteAddressMutation = useDeleteAddressMutation()
  const setDefaultAddressMutation = useSetDefaultAddressMutation()

  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "security"
  >("profile")

  const [profileForm, setProfileForm] = useState<UserProfileState>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    bio: "",
  })
  const [profileSuccess, setProfileSuccess] = useState(false)

  useEffect(() => {
    const p = profileRes?.data
    if (!p) return
    setProfileForm({
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      email: p.email || user?.email || "",
      phone: p.phone || "",
      bio: p.bio || "",
    })
  }, [profileRes, user?.email])

  const handleProfileFieldChange = <K extends keyof UserProfileState>(
    field: K,
    value: UserProfileState[K]
  ) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
    if (profileSuccess) setProfileSuccess(false)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(
      {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        bio: profileForm.bio,
      },
      {
        onSuccess: () => {
          setProfileSuccess(true)
          setTimeout(() => setProfileSuccess(false), 3000)
        },
      }
    )
  }

  // Password Change Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

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

    changePasswordMutation.mutate(
      {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordSuccess(true)
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          })
          setTimeout(() => setPasswordSuccess(false), 3000)
        },
        onError: (err: any) => {
          setPasswordError(
            err?.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้"
          )
        },
      }
    )
  }

  // Address Management
  const addresses: AddressItem[] = useMemo(() => {
    const raw: ApiAddressItem[] = addressesRes?.data ?? []
    return raw.map((a) => ({
      id: a.id,
      title: a.title,
      tag: normalizeTag(a.tag),
      address: a.address,
      phone: a.phone,
    }))
  }, [addressesRes])

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

    const payload = {
      title: addressForm.title.trim(),
      tag: addressForm.tag.toLowerCase(),
      address: addressForm.address.trim(),
      phone: addressForm.phone.trim(),
    }

    if (editingAddressId) {
      updateAddressMutation.mutate(
        { id: editingAddressId, data: payload },
        { onSuccess: () => setIsAddressModalOpen(false) }
      )
    } else {
      createAddressMutation.mutate(payload, {
        onSuccess: () => setIsAddressModalOpen(false),
      })
    }
  }

  const handleDeleteAddress = (id: string) => {
    deleteAddressMutation.mutate(id)
  }

  const handleSetDefaultAddress = (id: string) => {
    setDefaultAddressMutation.mutate(id)
  }

  return {
    user,
    isLoadingProfile,
    activeTab,
    setActiveTab,
    profileForm,
    handleProfileFieldChange,
    handleSaveProfile,
    isSavingProfile: updateProfileMutation.isPending,
    profileSuccess,
    passwordForm,
    setPasswordForm,
    passwordError,
    passwordSuccess,
    isChangingPassword: changePasswordMutation.isPending,
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
    handleSetDefaultAddress,
  }
}
