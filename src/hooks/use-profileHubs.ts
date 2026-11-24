import { useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import { queryClient } from "@/lib/queryClient"
import { showToast } from "@/lib/toast"
import { useAuth } from "@/context/AuthContext"
import {
  getProfile,
  updateProfile,
  changePassword,
  type IProfile,
  type IChangePassword,
} from "@/services/user.services"
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type IAddress,
} from "@/services/address.services"

export interface ApiAddressItem {
  id: string
  title: string
  tag: string
  address: string
  phone: string
  isDefault: boolean
}

export function useProfileQuery() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [QUERY_KEYS.STOREFRONT.PROFILE],
    queryFn: getProfile,
    enabled: Boolean(user),
  })
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (data: IProfile) => updateProfile(data),
    onSuccess: () => {
      showToast.success("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STOREFRONT.PROFILE],
      })
    },
    onError: (err: any) => {
      showToast.error(
        err?.response?.data?.message || "ไม่สามารถบันทึกข้อมูลโปรไฟล์ได้"
      )
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: IChangePassword) => changePassword(data),
    onSuccess: () => {
      showToast.success("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว")
    },
    onError: (err: any) => {
      showToast.error(
        err?.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้"
      )
    },
  })
}

export function useAddressesQuery() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [QUERY_KEYS.STOREFRONT.ADDRESSES],
    queryFn: getAddresses,
    enabled: Boolean(user),
  })
}

export function useCreateAddressMutation() {
  return useMutation({
    mutationFn: (data: IAddress) => createAddress(data),
    onSuccess: () => {
      showToast.success("เพิ่มที่อยู่เรียบร้อยแล้ว")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STOREFRONT.ADDRESSES],
      })
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || "ไม่สามารถเพิ่มที่อยู่ได้")
    },
  })
}

export function useUpdateAddressMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IAddress> }) =>
      updateAddress(id, data),
    onSuccess: () => {
      showToast.success("อัปเดตที่อยู่เรียบร้อยแล้ว")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STOREFRONT.ADDRESSES],
      })
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || "ไม่สามารถอัปเดตที่อยู่ได้")
    },
  })
}

export function useDeleteAddressMutation() {
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      showToast.success("ลบที่อยู่เรียบร้อยแล้ว")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STOREFRONT.ADDRESSES],
      })
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.message || "ไม่สามารถลบที่อยู่ได้")
    },
  })
}

export function useSetDefaultAddressMutation() {
  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onSuccess: () => {
      showToast.success("ตั้งเป็นที่อยู่หลักเรียบร้อยแล้ว")
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STOREFRONT.ADDRESSES],
      })
    },
  })
}
