import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  useAdminShippingRatesQuery,
  useUpdateShippingRateMutation,
  type ShippingRateItem,
} from "./useHubs"

export function useShippingRates() {
  const navigate = useNavigate()
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useAdminShippingRatesQuery()
  const shippingRates: ShippingRateItem[] = data?.data ?? []

  const updateMutation = useUpdateShippingRateMutation()

  const handleCreate = () => {
    navigate("/dashboard/shipping/create")
  }

  const handleEdit = (rate: ShippingRateItem) => {
    navigate(`/dashboard/shipping/edit/${rate.id}`)
  }

  const handleToggleActive = (rate: ShippingRateItem, isActive: boolean) => {
    setTogglingId(rate.id)
    updateMutation.mutate(
      { id: rate.id, payload: { isActive } },
      {
        onSettled: () => setTogglingId(null),
      }
    )
  }

  return {
    shippingRates,
    isLoading,
    isError,
    refetch,
    togglingId,
    handleCreate,
    handleEdit,
    handleToggleActive,
  }
}
