import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Search,
  Bell,
  Store,
  LogOut,
  User as UserIcon,
  Settings,
  Check,
  RotateCcw,
} from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { NotificationBadge } from "@/components/common/NotificationBadge"
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

interface NotificationItem {
  id: string
  title: string
  desc: string
  time: string
  read: boolean
}

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

  // Notification state with unread tracking for transitions.dev notification-badge
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "New order received",
      desc: "Order #ORD-9281 by Alice Johnson ($259.00)",
      time: "5m ago",
      read: false,
    },
    {
      id: "2",
      title: "Inventory low stock alert",
      desc: "iPad Pro M4 (13-inch) is down to 3 units",
      time: "25m ago",
      read: false,
    },
    {
      id: "3",
      title: "New 5-star review posted",
      desc: "Michael Brown reviewed MacBook Pro 16",
      time: "1h ago",
      read: false,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const resetNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: false })))
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
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/60 bg-background/95 px-6 backdrop-blur-md">
      {/* ── Left: Sidebar Trigger & Breadcrumb ── */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="cursor-pointer" />
        <Separator orientation="vertical" className="h-4" />

        <Breadcrumb>
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
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search dashboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            className="h-9 pl-8 text-xs bg-muted/40 rounded-lg border-border/60"
          />
        </div>

        {/* View Storefront Link */}
        <Link to="/" className="inline-flex">
          <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
            <Store className="size-3.5" />
            <span>View Store</span>
          </Button>
        </Link>

        {/* ── Notifications with Transitions.dev Notification Badge ── */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative cursor-pointer text-muted-foreground hover:text-foreground"
                title={`Notifications (${unreadCount} unread)`}
              >
                <Bell className="size-4" />
                {/* Notification badge transition from transitions.dev */}
                <NotificationBadge count={unreadCount} />
              </Button>
            }
          />

          <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl border-border/80">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-foreground">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div>
                {unreadCount > 0 ? (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Mark all as read"
                  >
                    <Check className="size-3" />
                    <span>Mark all read</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetNotifications}
                    className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Reset unread notifications"
                  >
                    <RotateCcw className="size-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-border/40 max-h-72 overflow-y-auto">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleNotification(item.id)}
                  className={`flex items-start gap-3 p-3 transition-colors cursor-pointer hover:bg-muted/40 ${
                    !item.read ? "bg-muted/15" : "opacity-75"
                  }`}
                  title={item.read ? "Click to mark as unread" : "Click to mark as read"}
                >
                  <span
                    className={`mt-1 size-2 rounded-full shrink-0 transition-all ${
                      !item.read
                        ? "bg-red-500 ring-2 ring-red-500/20"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs truncate ${
                          !item.read
                            ? "font-semibold text-foreground"
                            : "font-normal text-muted-foreground"
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 p-2 text-center bg-muted/10">
              <span className="text-[10px] text-muted-foreground font-mono">
                Transitions.dev • Notification badge
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

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
