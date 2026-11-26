import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layout/Layout"
import LoginPage from "@/pages/auth/login/Index"
import RegisterPage from "@/pages/auth/register/Index"
import HomePage from "@/pages/home/Index"
import ProductListPage from "@/pages/products/Index"
import CheckoutPage from "@/pages/default-user/checkout/Index"
import ProductDetailPage from "@/pages/default-user/product-detail/Index"
import UserProfilePage from "@/pages/default-user/profile/Index"
import MyOrdersPage from "@/pages/default-user/my-orders/Index"
import DashboardLayout from "@/pages/dashboard/Index"
import DashboardPage from "@/pages/dashboard/default/Index"
import DashboardCategoryPage from "@/pages/dashboard/category/Index"
import DashboardCategoryCreatePage from "@/pages/dashboard/category/create/Index"
import DashboardCategoryEditPage from "@/pages/dashboard/category/edit/Index"
import DashboardProductPage from "@/pages/dashboard/product/Index"
import DashboardProductCreatePage from "@/pages/dashboard/product/create/Index"
import DashboardProductEditPage from "@/pages/dashboard/product/edit/Index"
import DashboardUserManagementPage from "@/pages/dashboard/user-management/Index"
import DashboardOrderPage from "@/pages/dashboard/order/Index"
import DashboardOrderEditPage from "@/pages/dashboard/order/edit/Index"
import DashboardCouponPage from "@/pages/dashboard/coupon/Index"
import DashboardCouponCreatePage from "@/pages/dashboard/coupon/create/Index"
import DashboardCouponEditPage from "@/pages/dashboard/coupon/edit/Index"
import DashboardShippingPage from "@/pages/dashboard/shipping/Index"
import DashboardShippingCreatePage from "@/pages/dashboard/shipping/create/Index"
import DashboardShippingEditPage from "@/pages/dashboard/shipping/edit/Index"
import DashboardSettingsPage from "@/pages/dashboard/settings/Index"
import { RequireAuth, GuestOnly } from "@/components/guards/AuthGuard"

const NotFoundPage = () => (
  <div className="p-6 text-xl text-red-500">404 - ไม่พบหน้า</div>
)

export function App() {
  return (
    <Routes>
      {/* หน้าแรก, หน้ารายการสินค้า, ตะกร้าสินค้า, หน้าชำระเงิน, ประวัติคำสั่งซื้อ, โปรไฟล์ */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="product-detail/:id" element={<ProductDetailPage />} />
        <Route element={<RequireAuth />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
        </Route>
      </Route>

      {/* หน้าจัดการระบบ Dashboard */}
      <Route element={<RequireAuth allowedRoles={["admin", "staff"]} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="order" element={<DashboardOrderPage />} />
          <Route path="order/edit/:id" element={<DashboardOrderEditPage />} />
          <Route path="category" element={<DashboardCategoryPage />} />
          <Route
            path="category/create"
            element={<DashboardCategoryCreatePage />}
          />
          <Route
            path="category/edit/:id"
            element={<DashboardCategoryEditPage />}
          />
          <Route path="product" element={<DashboardProductPage />} />
          <Route path="product/create" element={<DashboardProductCreatePage />} />
          <Route path="product/edit/:id" element={<DashboardProductEditPage />} />
          <Route path="coupon" element={<DashboardCouponPage />} />
          <Route path="coupon/create" element={<DashboardCouponCreatePage />} />
          <Route path="coupon/edit/:id" element={<DashboardCouponEditPage />} />
          <Route path="shipping" element={<DashboardShippingPage />} />
          <Route
            path="shipping/create"
            element={<DashboardShippingCreatePage />}
          />
          <Route
            path="shipping/edit/:id"
            element={<DashboardShippingEditPage />}
          />
          <Route
            path="user-management"
            element={<DashboardUserManagementPage />}
          />
          <Route path="settings" element={<DashboardSettingsPage />} />
        </Route>
      </Route>

      {/* เข้าสู่ระบบ */}
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ถ้าพิมพ์ path มั่ว ให้วิ่งกลับหน้าแรก */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
