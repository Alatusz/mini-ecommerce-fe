import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "กรุณากรอกชื่อจริง"),
  lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล"),
  email: z.string(),
  phone: z.string().optional(),
  bio: z.string().optional(),
})

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "กรุณากรอกรหัสผ่านปัจจุบัน"),
    newPassword: z
      .string()
      .min(6, "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่านใหม่"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  })

export const addressSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่อที่อยู่"),
  tag: z.enum(["HOME", "OFFICE", "OTHER"]),
  address: z.string().trim().min(1, "กรุณากรอกที่อยู่โดยละเอียด"),
  phone: z.string().trim().min(1, "กรุณากรอกเบอร์โทรศัพท์ผู้รับ"),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
export type PasswordFormValues = z.infer<typeof passwordSchema>
export type AddressFormValues = z.infer<typeof addressSchema>

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
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profileRes?.firstName || "",
      lastName: profileRes?.lastName || "",
      email: profileRes?.email || "",
      phone: profileRes?.phone || "",
      bio: profileRes?.bio || "",
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: "",
      tag: "HOME",
      address: "",
      phone: "",
    },
  })

  const { reset: resetProfileForm } = profileForm

  useEffect(() => {
    const p = profileRes?.data
    if (!p) return
    resetProfileForm({
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      email: p.email || user?.email || "",
      phone: p.phone || "",
      bio: p.bio || "",
    })
  }, [profileRes, user?.email, resetProfileForm])

  const handleSaveProfile = profileForm.handleSubmit((values) => {
    updateProfileMutation.mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone || "",
        bio: values.bio || "",
      },
      {
        onSuccess: () => {
          setProfileSuccess(true)
          setTimeout(() => setProfileSuccess(false), 3000)
        },
      }
    )
  })

  const handlePasswordChange = passwordForm.handleSubmit((values) => {
    setPasswordError(null)
    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordSuccess(true)
          passwordForm.reset()
          setTimeout(() => setPasswordSuccess(false), 3000)
        },
        onError: (err: any) => {
          setPasswordError(
            err?.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้"
          )
        },
      }
    )
  })

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

  const handleOpenAddAddress = () => {
    setEditingAddressId(null)
    addressForm.reset({
      title: "",
      tag: "HOME",
      address: "",
      phone: "",
    })
    setIsAddressModalOpen(true)
  }

  const handleOpenEditAddress = (addr: AddressItem) => {
    setEditingAddressId(addr.id)
    addressForm.reset({
      title: addr.title,
      tag: addr.tag,
      address: addr.address,
      phone: addr.phone,
    })
    setIsAddressModalOpen(true)
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
        { onSuccess: () => setIsAddressModalOpen(false) }
      )
    } else {
      createAddressMutation.mutate(payload, {
        onSuccess: () => setIsAddressModalOpen(false),
      })
    }
  })

  const handleDeleteAddress = (id: string) => {
    deleteAddressMutation.mutate(id)
  }

  const handleSetDefaultAddress = (id: string) => {
    setDefaultAddressMutation.mutate(id)
  }

  return {
    user,
    profile: profileRes?.data,
    isLoadingProfile,
    activeTab,
    setActiveTab,
    profileControl: profileForm.control,
    handleSaveProfile,
    isSavingProfile: updateProfileMutation.isPending,
    profileSuccess,
    passwordControl: passwordForm.control,
    passwordError,
    passwordSuccess,
    isChangingPassword: changePasswordMutation.isPending,
    handlePasswordChange,
    addresses,
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddressId,
    addressControl: addressForm.control,
    isSavingAddress:
      createAddressMutation.isPending || updateAddressMutation.isPending,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
  }
}
