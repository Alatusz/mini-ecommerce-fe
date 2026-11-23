import axios from "axios"

import { toast as toastManager } from "@/components/ui/toast"

type ToastType = "success" | "warning" | "error"

function getErrorDescription(error: unknown) {
  if (typeof error === "string") {
    return error
  }

  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    const message = error.response?.data?.message
    if (typeof message === "string" && message.trim()) {
      return message
    }

    if (!error.response && error.message) {
      return error.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Something went wrong. Please try again."
}

function show(type: ToastType, description: string) {
  toastManager.add({ type, description })
}

export const showToast = {
  success: (description: string) => show("success", description),
  warning: (description: string) => show("warning", description),
  error: (error: unknown) => show("error", getErrorDescription(error)),
}
