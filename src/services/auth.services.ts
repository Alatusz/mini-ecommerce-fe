import apiClient from "@/config/axios.config"

export const register = async (data: { email: string; password: string }) => {
  const response = await apiClient.post("/auth/register", data)

  return response.data
}

export const login = async (data: { email: string; password: string }) => {
  const response = await apiClient.post("/auth/login", data)

  return response.data
}

export const getMe = async () => {
  const response = await apiClient.get("/auth/me")

  return response.data
}

export const logout = async () => {
  const response = await apiClient.post("/auth/logout")

  return response.data
}
