import { Link } from "react-router-dom"
import type { ReactNode } from "react"
import { Copy, MapPin, Package, Receipt, Star, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type OrderItem } from "../useHooks"

interface OrderDetailsDialogProps {
  order: OrderItem | null
  statusBadge: ReactNode
  onClose: () => void
  onCopyTracking: (code: string) => void
}

export function OrderDetailsDialog({
  order,
  statusBadge,
  onClose,
  onCopyTracking,
}: OrderDetailsDialogProps) {
  return (
    <Dialog open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] sm:max-w-4xl overflow-y-auto p-6">
        <DialogHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pr-8">
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                รายละเอียดคำสั่งซื้อ
              </DialogTitle>
              <DialogDescription className="mt-1 font-mono text-xs text-muted-foreground">
                #{order?.orderNumber} • สั่งซื้อเมื่อ {order?.date}
              </DialogDescription>
            </div>
            {statusBadge}
          </div>
        </DialogHeader>

        {order && (
          <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-12">
            {/* Left Column: Order Items (7 cols) */}
            <div className="space-y-3 md:col-span-7">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Package className="size-3.5 text-primary" />
                <span>รายการสินค้า ({order.items.length} รายการ)</span>
              </h4>

              <div className="divide-y divide-border/50 rounded-xl border border-border/60 bg-card">
                {order.items.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="flex items-center justify-between gap-3 p-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Link
                        to={`/products/${item.id}`}
                        className="size-12 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/30"
                        title={item.name}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-full object-cover"
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.id}`}
                          className="hover:underline"
                          title={item.name}
                        >
                          <p className="truncate text-sm font-medium text-foreground">
                            {item.name}
                          </p>
                        </Link>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground tabular-nums">
                          <span>
                            ฿{item.price.toLocaleString()} × {item.quantity}
                          </span>
                          {item.rating > 0 && (
                            <span className="inline-flex items-center gap-0.5 font-medium text-amber-500">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              {item.rating}/5
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Delivery & Payment Summary (5 cols) */}
            <div className="space-y-4 md:col-span-5">
              {/* Delivery Block */}
              <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4 text-xs">
                <h4 className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" />
                  <span>ข้อมูลการจัดส่ง</span>
                </h4>

                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {order.customer.name}
                    </p>
                    {order.shippingPhone && (
                      <p className="text-muted-foreground tabular-nums">
                        {order.shippingPhone}
                      </p>
                    )}
                  </div>
                  <p className="leading-relaxed text-muted-foreground">
                    {order.shippingAddress || "—"}
                  </p>
                </div>

                {(order.shippingMethodName || order.trackingNumber) && (
                  <div className="space-y-1.5 border-t border-border/50 pt-2.5">
                    {order.shippingMethodName && (
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Truck className="size-3.5" />
                          วิธีจัดส่ง
                        </span>
                        <span className="font-medium text-foreground">
                          {order.shippingMethodName}
                        </span>
                      </div>
                    )}

                    {order.trackingNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">เลขพัสดุ</span>
                        <div className="flex items-center gap-1 font-mono font-semibold text-foreground">
                          <span>{order.trackingNumber}</span>
                          <button
                            type="button"
                            onClick={() => onCopyTracking(order.trackingNumber!)}
                            className="cursor-pointer p-1 text-muted-foreground hover:text-foreground"
                            aria-label="คัดลอกเลขพัสดุ"
                          >
                            <Copy className="size-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Summary Block */}
              <div className="space-y-2.5 rounded-xl border border-border/60 bg-card p-4 text-xs">
                <h4 className="flex items-center gap-1.5 pb-1 font-semibold uppercase tracking-wider text-muted-foreground">
                  <Receipt className="size-3.5 text-primary" />
                  <span>สรุปยอดชำระ</span>
                </h4>

                <div className="flex justify-between text-muted-foreground">
                  <span>ราคาสินค้ารวม</span>
                  <span className="font-medium text-foreground tabular-nums">
                    ฿{order.subtotal.toLocaleString()}
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>
                      ส่วนลด{order.couponCode ? ` (${order.couponCode})` : ""}
                    </span>
                    <span className="font-medium tabular-nums">
                      -฿{order.discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>ค่าจัดส่ง</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {order.shippingCost === 0
                      ? "ฟรี"
                      : `฿${order.shippingCost.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>วิธีชำระเงิน</span>
                  <span className="font-medium text-foreground">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-border/50 pt-2.5">
                  <span className="text-sm font-semibold text-foreground">
                    ยอดสุทธิ
                  </span>
                  <span className="text-base font-bold text-foreground tabular-nums">
                    ฿{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-border/50 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer text-xs"
          >
            ปิดหน้าต่าง
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
