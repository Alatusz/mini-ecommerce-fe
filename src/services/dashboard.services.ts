import apiClient from "@/config/axios.config"

export interface IDateRange {
  startDate?: string
  endDate?: string
  tz?: string
}

export const dashboardOverView = async ({
  startDate,
  endDate,
  tz = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: IDateRange = {}) => {
  const response = await apiClient.get("/dashboard", {
    params: {
      startDate,
      endDate,
      tz,
    },
  })

  return response.data
}
