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
} from "lucide-react"

import Logo from "@/assets/alatusz-logo.svg"
import { useLanguage } from "@/context/LanguageContext"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
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
  const location = useLocation()
  const { dict } = useLanguage()
  const s = dict.sidebar

  // Derive active menu from URL path if not explicitly provided
  let activeMenu = propActiveMenu
  if (!activeMenu) {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      activeMenu = "dashboard"
    } else if (location.pathname.startsWith("/dashboard/order")) {
      activeMenu = "orders"
    } else if (location.pathname.startsWith("/dashboard/category")) {
      activeMenu = "categories"
    } else if (location.pathname.startsWith("/dashboard/product")) {
      activeMenu = "products"
    } else if (location.pathname.startsWith("/dashboard/coupon")) {
      activeMenu = "coupons"
    } else if (location.pathname.startsWith("/dashboard/shipping")) {
      activeMenu = "shipping"
    } else if (location.pathname.startsWith("/dashboard/user-management")) {
      activeMenu = "customers"
    } else if (location.pathname.startsWith("/dashboard/settings")) {
      activeMenu = "settings"
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
            className="size-8 shrink-0 rounded-md object-contain"
          />
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-bold text-sidebar-foreground">
              Mini Ecommerce
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {s.console}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* ── Nav Items ── */}
      <SidebarContent>
        {/* 1. Store Management */}
        <SidebarGroup>
          <SidebarGroupLabel>{s.groups.storeManagement}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/dashboard" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "dashboard"}
                    onClick={() => setActiveMenu?.("dashboard")}
                    tooltip={s.items.dashboard}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="size-4" />
                    <span>{s.items.dashboard}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to="/dashboard/order" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "orders"}
                    onClick={() => setActiveMenu?.("orders")}
                    tooltip={s.items.orders}
                    className="cursor-pointer"
                  >
                    <ShoppingBag className="size-4" />
                    <span>{s.items.orders}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to="/dashboard/product" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "products"}
                    onClick={() => setActiveMenu?.("products")}
                    tooltip={s.items.products}
                    className="cursor-pointer"
                  >
                    <Package className="size-4" />
                    <span>{s.items.products}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to="/dashboard/category" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "categories"}
                    onClick={() => setActiveMenu?.("categories")}
                    tooltip={s.items.categories}
                    className="cursor-pointer"
                  >
                    <Tags className="size-4" />
                    <span>{s.items.categories}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to="/dashboard/user-management" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "customers"}
                    onClick={() => setActiveMenu?.("customers")}
                    tooltip={s.items.customers}
                    className="cursor-pointer"
                  >
                    <Users className="size-4" />
                    <span>{s.items.customers}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "reviews"}
                  onClick={() => setActiveMenu?.("reviews")}
                  tooltip={s.items.reviews}
                  className="cursor-pointer"
                >
                  <Star className="size-4" />
                  <span>{s.items.reviews}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 2. Marketing & Promotions */}
        <SidebarGroup>
          <SidebarGroupLabel>{s.groups.marketingSales}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/dashboard/coupon" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "coupons"}
                    onClick={() => setActiveMenu?.("coupons")}
                    tooltip={s.items.coupons}
                    className="cursor-pointer"
                  >
                    <TicketPercent className="size-4" />
                    <span>{s.items.coupons}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "banners"}
                  onClick={() => setActiveMenu?.("banners")}
                  tooltip={s.items.banners}
                  className="cursor-pointer"
                >
                  <ImageIcon className="size-4" />
                  <span>{s.items.banners}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 3. Analytics & Logistics */}
        <SidebarGroup>
          <SidebarGroupLabel>{s.groups.analyticsLogistics}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "analytics"}
                  onClick={() => setActiveMenu?.("analytics")}
                  tooltip={s.items.analytics}
                  className="cursor-pointer"
                >
                  <TrendingUp className="size-4" />
                  <span>{s.items.analytics}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "inventory"}
                  onClick={() => setActiveMenu?.("inventory")}
                  tooltip={s.items.inventory}
                  className="cursor-pointer"
                >
                  <Layers className="size-4" />
                  <span>{s.items.inventory}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to="/dashboard/shipping" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "shipping"}
                    onClick={() => setActiveMenu?.("shipping")}
                    tooltip="Shipping Methods & Rates"
                    className="cursor-pointer"
                  >
                    <Truck className="size-4" />
                    <span>Shipping Rates</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "notifications"}
                  onClick={() => setActiveMenu?.("notifications")}
                  tooltip={s.items.notifications}
                  className="cursor-pointer"
                >
                  <Bell className="size-4" />
                  <span>{s.items.notifications}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 4. System & Store */}
        <SidebarGroup>
          <SidebarGroupLabel>{s.groups.systemStore}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/" className="w-full">
                  <SidebarMenuButton
                    tooltip={s.items.viewStorefront}
                    className="cursor-pointer"
                  >
                    <Store className="size-4" />
                    <span>{s.items.viewStorefront}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to="/dashboard/settings" className="w-full">
                  <SidebarMenuButton
                    isActive={activeMenu === "settings"}
                    onClick={() => setActiveMenu?.("settings")}
                    tooltip={s.items.settings}
                    className="cursor-pointer"
                  >
                    <Settings className="size-4" />
                    <span>{s.items.settings}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
