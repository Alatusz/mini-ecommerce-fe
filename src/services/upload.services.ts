import apiClient from "@/config/axios.config"

export interface UploadResponse {
  message: string
  url: string
  filename: string
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append("image", file)

  const response = await apiClient.post<UploadResponse>(
    "/upload/single",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data
}

