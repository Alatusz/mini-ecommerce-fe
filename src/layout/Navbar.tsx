import { Link } from "react-router-dom"
import {
  Heart,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  ShoppingCart,
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
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import ThemeToggle from "@/components/shares/Theme-toggle"

function Navbar() {
  const { user, logout, isLoading } = useAuth()
  const isMobile = useIsMobile()

  return (
    <nav className="flex h-16 items-center justify-between px-4 sm:px-6">
      {/* Brand Logo & Nav */}
      <div className="flex items-center gap-6">
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

        <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            หน้าแรก
          </Link>
          <Link
            to="/products"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            สินค้าทั้งหมด
          </Link>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Wishlist Drawer */}
        <Drawer
          showSwipeHandle={isMobile}
          swipeDirection={isMobile ? "down" : "right"}
        >
          <DrawerTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer hover:bg-accent"
                aria-label="รายการโปรด"
                title="รายการโปรด"
              >
                <Heart className="h-5 w-5" />
              </Button>
            }
          />
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                รายการโปรด
                <Badge variant="secondary" className="ml-auto font-normal">
                  0 รายการ
                </Badge>
              </DrawerTitle>
              <DrawerDescription>
                สินค้าที่คุณบันทึกไว้สำหรับเลือกดูภายหลัง
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Heart className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                ยังไม่มีสินค้าในรายการโปรด
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                กดไอคอนหัวใจที่สินค้าเพื่อบันทึกรายการที่คุณสนใจ
              </p>
            </div>

            <DrawerFooter>
              <DrawerClose
                render={
                  <Button variant="outline" className="w-full cursor-pointer">
                    ปิด
                  </Button>
                }
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Cart Drawer */}
        <Drawer
          showSwipeHandle={isMobile}
          swipeDirection={isMobile ? "down" : "right"}
        >
          <DrawerTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer hover:bg-accent"
                aria-label="ตะกร้าสินค้า"
                title="ตะกร้าสินค้า"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            }
          />
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                ตะกร้าสินค้า
                <Badge variant="secondary" className="ml-auto font-normal">
                  0 ชิ้น
                </Badge>
              </DrawerTitle>
              <DrawerDescription>
                รายการสินค้าที่คุณเลือกไว้ในตะกร้า
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                ไม่มีสินค้าในตะกร้า
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                เลือกช้อปสินค้าที่ชอบแล้วเพิ่มลงในตะกร้าได้เลย
              </p>
            </div>

            <DrawerFooter>
              <Link to="/cart" className="w-full">
                <DrawerClose
                  render={
                    <Button className="w-full cursor-pointer">
                      ดูตะกร้าสินค้า
                    </Button>
                  }
                />
              </Link>
              <DrawerClose
                render={
                  <Button variant="outline" className="w-full cursor-pointer">
                    ปิด
                  </Button>
                }
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

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
