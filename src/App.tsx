import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layout/Layout"
import LoginPage from "@/pages/auth/login/Index"
import RegisterPage from "@/pages/auth/register/Index"

const HomePage = () => <div className="p-6 text-xl"> หน้าแรก</div>
const NotFoundPage = () => (
  <div className="p-6 text-xl text-red-500">404 - ไม่พบหน้า</div>
)

export function App() {
  return (
    <Routes>
      {/* หน้าแรก */}
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<HomePage /> }/>
      </Route>

      {/* เข้าสู่ระบบ */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ถ้าพิมพ์ path มั่ว ให้วิ่งกลับหน้าแรก */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
