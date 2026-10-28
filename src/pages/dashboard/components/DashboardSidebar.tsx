import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  Users,
  Star,
  TicketPercent,
  Image as ImageIcon,
  TrendingUp,
  Layers,
  Truck,
  Bell,
  Settings,
  Store,
  LogOut,
} from "lucide-react"

import Logo from "@/assets/alatusz-logo.svg"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface DashboardSidebarProps {
  activeMenu?: string
  setActiveMenu?: (menu: string) => void
}

export function DashboardSidebar({
  activeMenu: propActiveMenu,
  setActiveMenu,
}: DashboardSidebarProps = {}) {
  const { user, logout } = useAuth()
  const location = useLocation()

  // Derive active menu from URL path if not explicitly provided
  let activeMenu = propActiveMenu
  if (!activeMenu) {
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      activeMenu = "dashboard"
    } else if (location.pathname.startsWith("/dashboard/order")) {
      activeMenu = "orders"
    } else if (location.pathname.startsWith("/dashboard/category")) {
      activeMenu = "categories"
    } else if (location.pathname.startsWith("/dashboard/product")) {
      activeMenu = "products"
    } else if (location.pathname.startsWith("/dashboard/coupon")) {
      activeMenu = "coupons"
    } else if (location.pathname.startsWith("/dashboard/user-management")) {
      activeMenu = "customers"
    } else {
      activeMenu = "dashboard"
    }
  }

  return (
    <Sidebar collapsible="icon">
      {/* ── Brand Header ── */}
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={Logo}
            alt="Mini Ecommerce"
            className="size-8 rounded-md object-contain shrink-0"
          />
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground truncate">
              Mini Ecommerce
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Admin Console
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* ── Nav Items ── */}
      <SidebarContent>
        {/* 1. Store Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Store Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/dashboard" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "dashboard"}
                    onClick={() => setActiveMenu?.("dashboard")}
                    tooltip="Dashboard Overview"
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to="/dashboard/order" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "orders"}
                    onClick={() => setActiveMenu?.("orders")}
                    tooltip="Orders Management"
                    className="cursor-pointer"
                  >
                    <ShoppingBag className="size-4" />
                    <span>Orders</span>
                    <SidebarMenuBadge>8</SidebarMenuBadge>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to="/dashboard/product" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "products"}
                    onClick={() => setActiveMenu?.("products")}
                    tooltip="Products Catalog"
                    className="cursor-pointer"
                  >
                    <Package className="size-4" />
                    <span>Products</span>
                    <SidebarMenuBadge>18</SidebarMenuBadge>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to="/dashboard/category" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "categories"}
                    onClick={() => setActiveMenu?.("categories")}
                    tooltip="Product Categories"
                    className="cursor-pointer"
                  >
                    <Tags className="size-4" />
                    <span>Categories</span>
                    <SidebarMenuBadge>8</SidebarMenuBadge>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to="/dashboard/user-management" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "customers"}
                    onClick={() => setActiveMenu?.("customers")}
                    tooltip="Customers Directory"
                    className="cursor-pointer"
                  >
                    <Users className="size-4" />
                    <span>Customers</span>
                    <SidebarMenuBadge>8</SidebarMenuBadge>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "reviews"}
                  onClick={() => setActiveMenu?.("reviews")}
                  tooltip="Reviews & Ratings"
                  className="cursor-pointer"
                >
                  <Star className="size-4" />
                  <span>Reviews</span>
                  <SidebarMenuBadge>12</SidebarMenuBadge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 2. Marketing & Promotions */}
        <SidebarGroup>
          <SidebarGroupLabel>Marketing & Sales</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/dashboard/coupon" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "coupons"}
                    onClick={() => setActiveMenu?.("coupons")}
                    tooltip="Coupons & Discounts"
                    className="cursor-pointer"
                  >
                    <TicketPercent className="size-4" />
                    <span>Coupons & Promo</span>
                    <SidebarMenuBadge>6</SidebarMenuBadge>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "banners"}
                  onClick={() => setActiveMenu?.("banners")}
                  tooltip="Banners & CMS"
                  className="cursor-pointer"
                >
                  <ImageIcon className="size-4" />
                  <span>Banners & CMS</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 3. Analytics & Logistics */}
        <SidebarGroup>
          <SidebarGroupLabel>Analytics & Logistics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "analytics"}
                  onClick={() => setActiveMenu?.("analytics")}
                  tooltip="Sales & Revenue Analytics"
                  className="cursor-pointer"
                >
                  <TrendingUp className="size-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "inventory"}
                  onClick={() => setActiveMenu?.("inventory")}
                  tooltip="Inventory & Stock"
                  className="cursor-pointer"
                >
                  <Layers className="size-4" />
                  <span>Inventory</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "shipping"}
                  onClick={() => setActiveMenu?.("shipping")}
                  tooltip="Shipping Methods & Rates"
                  className="cursor-pointer"
                >
                  <Truck className="size-4" />
                  <span>Shipping Rates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "notifications"}
                  onClick={() => setActiveMenu?.("notifications")}
                  tooltip="System Notifications"
                  className="cursor-pointer"
                >
                  <Bell className="size-4" />
                  <span>Notifications</span>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 4. System & Store */}
        <SidebarGroup>
          <SidebarGroupLabel>System & Store</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/" className="w-full">
                  <SidebarMenuButton tooltip="Back to Storefront" className="cursor-pointer">
                    <Store className="size-4" />
                    <span>View Storefront</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "settings"}
                  onClick={() => setActiveMenu?.("settings")}
                  tooltip="Store Settings"
                  className="cursor-pointer"
                >
                  <Settings className="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer: Admin Profile ── */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar size="sm">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="text-xs font-semibold truncate text-sidebar-foreground">
                {user?.email || "admin@example.com"}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-mono">
                {user?.role || "Administrator"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Log out"
            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors group-data-[collapsible=icon]:hidden cursor-pointer"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
