import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import Cookies from "js-cookie"
import { getMe, logout as logoutService } from "@/services/auth.services"

export interface User {
  id: string
  email: string
  role: string
}

export interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initAuth = async () => {
      // 1. เช็ค Cookie สัญญาณ: ถ้าไม่มี แปลว่าผู้ใช้เป็น Guest แน่นอน ไม่ต้องยิงถาม Backend
      const isLoggedIn = Cookies.get("is_logged_in")

      if (!isLoggedIn) {
        setUser(null)
        setIsLoading(false)
        return
      }

      // 2. ถ้ามีสัญญาณ ค่อยยิงถาม Backend เพื่อดึงข้อมูล User ตัวจริง
      try {
        const res = await getMe()
        setUser(res.data)
      } catch (error) {
        Cookies.remove("is_logged_in")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const logout = async () => {
    try {
      await logoutService()
    } catch (error) {
      console.error("Logout Failed", error)
    } finally {
      Cookies.remove("is_logged_in")
      setUser(null)
      window.location.href = "/login"
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
