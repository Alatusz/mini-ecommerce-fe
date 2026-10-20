import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  // สร้าง QueryClient ไว้ใน useState เพื่อป้องกันการ recreate instance ซ้ำเวลา component re-render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // ข้อมูลถือว่าสดใหม่ 5 นาที (ลดการยิง API ซ้ำซ้อน)
            retry: 1, // หากเน็ตหลุด ให้ลองใหม่ 1 ครั้งก่อน throw error
            refetchOnWindowFocus: false, // ไม่ auto-refetch ทุกครั้งที่สลับหน้าต่าง (UX สบายตาขึ้น)
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
