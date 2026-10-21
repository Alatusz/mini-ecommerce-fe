import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react"

import Logo from "@/assets/alatusz-logo.svg"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Skeleton } from "@/components/ui/skeleton"
import ThemeToggle from "@/components/shares/Theme-toggle"

function Navbar() {
  const { user, logout, isLoading } = useAuth()

  return (
    <nav className="flex h-16 items-center justify-between px-4 sm:px-6">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={Logo}
          alt="Alatusz Dev Logo"
          className="h-9 w-9 rounded-md object-contain"
        />
        <span className="hidden text-base font-bold sm:inline-block">
          Mini Ecommerce
        </span>
      </Link>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar size="default">
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-42">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="truncate">
                  {user.email}
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon />
                  โปรไฟล์ของฉัน
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <ShoppingBag />
                  ประวัติการสั่งซื้อ
                </DropdownMenuItem>

                {user.role === "admin" && (
                  <DropdownMenuItem>
                    <LayoutDashboard />
                    จัดการระบบ
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" onClick={logout}>
                <LogOut />
                ออกจากระบบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                เข้าสู่ระบบ
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">สมัครสมาชิก</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
