import { Link, useLocation } from "react-router-dom"
import {
  Search,
  Bell,
  Store,
  LogOut,
  User as UserIcon,
  Settings,
} from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ThemeToggle from "@/components/shares/Theme-toggle"

interface DashboardNavbarProps {
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  activeMenu?: string
}

export function DashboardNavbar({
  searchQuery = "",
  setSearchQuery,
  activeMenu: propActiveMenu,
}: DashboardNavbarProps = {}) {
  const { user, logout } = useAuth()
  const location = useLocation()

  let activeMenu = propActiveMenu
  if (!activeMenu) {
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      activeMenu = "dashboard"
    } else if (location.pathname.startsWith("/dashboard/category")) {
      activeMenu = "categories"
    } else if (location.pathname.startsWith("/dashboard/product")) {
      activeMenu = "products"
    } else if (location.pathname.startsWith("/dashboard/user-management")) {
      activeMenu = "customers"
    } else {
      activeMenu = "dashboard"
    }
  }

  const menuTitles: Record<string, string> = {
    dashboard: "Overview",
    orders: "Orders Management",
    products: "Products Catalog",
    categories: "Product Categories",
    customers: "Customers Directory",
    reviews: "Reviews & Ratings",
    coupons: "Coupons & Discounts",
    banners: "Banners & CMS",
    analytics: "Sales & Revenue",
    inventory: "Inventory & Stock",
    shipping: "Shipping Rates",
    notifications: "System Notifications",
    settings: "Store Settings",
  }

  const formattedMenuTitle =
    menuTitles[activeMenu] ||
    activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/60 bg-background/95 px-4 sm:px-6 backdrop-blur-md">
      {/* ── Left: Sidebar Trigger & Breadcrumb ── */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="cursor-pointer" />
        <Separator orientation="vertical" className="h-4" />

        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/" />}>Store</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/dashboard" />}>
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{formattedMenuTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Right: Search & Actions & Admin Profile ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar */}
        <div className="relative w-40 sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search dashboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            className="h-9 pl-8 text-xs bg-muted/40 rounded-lg border-border/60"
          />
        </div>

        {/* View Storefront Link */}
        <Link to="/" className="hidden md:inline-flex">
          <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
            <Store className="size-3.5" />
            <span>View Store</span>
          </Button>
        </Link>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative cursor-pointer text-muted-foreground hover:text-foreground"
          title="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-red-500" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar size="sm" className="cursor-pointer border border-border/60">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="truncate font-semibold">
                {user?.email || "admin@example.com"}
              </DropdownMenuLabel>
              <span className="px-2 pb-1.5 text-[11px] text-muted-foreground block">
                {user?.role || "Administrator"}
              </span>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon />
                <span>Admin Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings />
                <span>Store Settings</span>
              </DropdownMenuItem>
              <Link to="/">
                <DropdownMenuItem className="cursor-pointer">
                  <Store />
                  <span>Go to Storefront</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={logout}
              className="cursor-pointer"
            >
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
