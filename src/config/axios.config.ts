import axios from "axios"
import Cookies from "js-cookie";


// BASE URL 
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const isAuthCheck = error.config?.url?.includes("/auth/me")
      const isLoginRequest = error.config?.url?.includes("/auth/login")

      // เคลียร์สัญญาณสถานะฝั่งหน้าบ้าน
      Cookies.remove("is_logged_in")

      // ถ้าไม่ใช่การเช็คสถานะตอนเปิดเว็บ และไม่ใช่ตอนกด Login ค่อยพาไปหน้า Login
      if (!isAuthCheck && !isLoginRequest) {
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient