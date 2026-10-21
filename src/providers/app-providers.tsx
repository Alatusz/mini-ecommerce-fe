import { type ReactNode } from "react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "./query-provider"
import { Toaster } from "@/components/ui/toast"
import { AuthProvider } from "@/context/AuthContext"

interface AppProvidersProps {
  children: ReactNode
}

/**
 * AppProviders ทำหน้าที่เป็น Hub ศูนย์รวม Providers ทั้งหมดของแอปพลิเคชัน
 * ประโยชน์:
 * - main.tsx จะสะอาดมาก มีแค่ <AppProviders><App /></AppProviders>
 * - วันข้างหน้ามี AuthProvider หรือ CartProvider แค่มาเพิ่มที่นี่จุดเดียว
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  )
}
