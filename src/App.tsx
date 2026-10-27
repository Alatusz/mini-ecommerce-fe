import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layout/Layout"
import LoginPage from "@/pages/auth/login/Index"
import RegisterPage from "@/pages/auth/register/Index"
import HomePage from "@/pages/home/Index"
import ProductListPage from "@/pages/products/Index"
import CartPage from "@/pages/default-user/cart/Index"
import CheckoutPage from "@/pages/default-user/checkout/Index"
import DashboardLayout from "@/pages/dashboard/Index"
import DashboardPage from "@/pages/dashboard/default/Index"
import DashboardCategoryPage from "@/pages/dashboard/category/Index"
import DashboardProductPage from "@/pages/dashboard/product/Index"
import DashboardUserManagementPage from "@/pages/dashboard/user-management/Index"

const NotFoundPage = () => (
  <div className="p-6 text-xl text-red-500">404 - ไม่พบหน้า</div>
)

export function App() {
  return (
    <Routes>
      {/* หน้าแรก, หน้ารายการสินค้า, ตะกร้าสินค้า, หน้าชำระเงิน */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>

      {/* หน้าจัดการระบบ Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="category" element={<DashboardCategoryPage />} />
        <Route path="product" element={<DashboardProductPage />} />
        <Route path="user-management" element={<DashboardUserManagementPage />} />
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
