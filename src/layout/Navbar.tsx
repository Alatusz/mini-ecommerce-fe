import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  LogOut,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  User as UserIcon,
} from "lucide-react"

import Logo from "@/assets/alatusz-logo.svg"
import { useAuth } from "@/context/AuthContext"
import {
  useMyCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartQtyMutation,
  type ApiCartItem,
} from "@/hooks/use-cartHubs"
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
  const { data: cartRes, isLoading: isCartLoading } = useMyCartQuery()
  const updateQtyMutation = useUpdateCartQtyMutation()
  const removeItemMutation = useRemoveCartItemMutation()

  const cartItems: ApiCartItem[] = cartRes?.data?.items ?? []
  const totalItems: number = cartRes?.data?.totalItems ?? 0
  const totalPrice: number = cartRes?.data?.totalPrice ?? 0

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
          <Link
            to="/my-orders"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            คำสั่งซื้อของฉัน
          </Link>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
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
                className="relative cursor-pointer"
                aria-label="ตะกร้าสินค้า"
                title="ตะกร้าสินค้า"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            }
          />
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                ตะกร้าสินค้า
                <Badge variant="secondary" className="ml-auto font-normal">
                  {totalItems} ชิ้น
                </Badge>
              </DrawerTitle>
              <DrawerDescription>
                รายการสินค้าที่คุณเลือกไว้ในตะกร้า
              </DrawerDescription>
            </DrawerHeader>

            {isCartLoading ? (
              <div className="flex flex-1 flex-col gap-3 p-4">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : cartItems.length > 0 ? (
              <div className="flex-1 overflow-y-auto divide-y divide-border/50 px-4">
                {cartItems.map((item) => {
                  const unitPrice = Number(item.product.sellPrice ?? 0)
                  const imgSrc =
                    item.product.images?.[0] || "/alatusz-logo.svg"
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 py-3"
                    >
                      <DrawerClose
                        render={
                          <Link
                            to={`/products/${item.productId}`}
                            className="size-14 shrink-0 overflow-hidden rounded-lg border bg-muted/40"
                          >
                            <img
                              src={imgSrc}
                              alt={item.product.name}
                              className="size-full object-cover"
                            />
                          </Link>
                        }
                      />

                      <div className="min-w-0 flex-1">
                        <DrawerClose
                          render={
                            <Link
                              to={`/products/${item.productId}`}
                              className="line-clamp-1 text-xs font-medium text-foreground hover:underline"
                            >
                              {item.product.name}
                            </Link>
                          }
                        />
                        <div className="mt-0.5 text-xs font-semibold text-foreground tabular-nums">
                          ฿{(unitPrice * item.quantity).toLocaleString()}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={
                              item.quantity <= 1 || updateQtyMutation.isPending
                            }
                            onClick={() =>
                              updateQtyMutation.mutate({
                                itemId: item.id,
                                quantity: item.quantity - 1,
                              })
                            }
                            className="size-6 cursor-pointer"
                            aria-label="ลดจำนวน"
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-5 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={updateQtyMutation.isPending}
                            onClick={() =>
                              updateQtyMutation.mutate({
                                itemId: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                            className="size-6 cursor-pointer"
                            aria-label="เพิ่มจำนวน"
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={removeItemMutation.isPending}
                        onClick={() => removeItemMutation.mutate(item.id)}
                        className="size-7 shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
                        aria-label="ลบสินค้า"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
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
            )}

            <DrawerFooter>
              {cartItems.length > 0 && (
                <div className="mb-1 flex items-center justify-between text-sm font-semibold">
                  <span className="text-muted-foreground">รวมทั้งหมด</span>
                  <span className="tabular-nums">
                    ฿{totalPrice.toLocaleString()}
                  </span>
                </div>
              )}
              {cartItems.length > 0 && (
                <Link to="/checkout" className="w-full">
                  <DrawerClose
                    render={
                      <Button className="w-full cursor-pointer">
                        ดำเนินการสั่งซื้อ
                      </Button>
                    }
                  />
                </Link>
              )}
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
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon />
                    โปรไฟล์ของฉัน
                  </DropdownMenuItem>
                </Link>
                <Link to="/my-orders">
                  <DropdownMenuItem className="cursor-pointer">
                    <ShoppingBag />
                    ประวัติการสั่งซื้อ
                  </DropdownMenuItem>
                </Link>

                {user.role === "admin" && (
                  <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <LayoutDashboard />
                      จัดการระบบ
                    </DropdownMenuItem>
                  </Link>
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
