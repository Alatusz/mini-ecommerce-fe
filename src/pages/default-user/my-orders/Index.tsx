import { Link } from "react-router-dom"
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Search,
  ArrowRight,
  MapPin,
  RotateCcw,
  Calendar,
  ChevronRight,
} from "lucide-react"

import { useMyOrders } from "./useHooks"
import type { OrderItem } from "@/pages/dashboard/order/common/mockOrder"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const customerSteps = [
  { step: 1, key: "Pending", title: "สั่งซื้อสำเร็จ", sub: "รอตรวจสอบ" },
  { step: 2, key: "Processing", title: "กำลังเตรียมของ", sub: "กำลังแพ็คเกจ" },
  { step: 3, key: "Shipped", title: "ส่งให้บริษัทขนส่ง", sub: "อยู่ระหว่างนำจ่าย" },
  { step: 4, key: "Completed", title: "จัดส่งสำเร็จ", sub: "ได้รับสินค้าแล้ว" },
]

const getStepNumber = (status: OrderItem["status"]): number => {
  switch (status) {
    case "Pending":
      return 1
    case "Processing":
      return 2
    case "Shipped":
      return 3
    case "Completed":
      return 4
    case "Cancelled":
      return 0
  }
}

export default function MyOrdersPage() {
  const {
    orders,
    rawOrders,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    selectedOrder,
    setSelectedOrder,
    cancellingOrder,
    setCancellingOrder,
    copiedCode,
    handleCopy,
    handleCancelOrder,
    stats,
  } = useMyOrders()

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-semibold gap-1"
          >
            <Clock className="size-3" />
            รอดำเนินการ (Pending)
          </Badge>
        )
      case "Processing":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-xs font-semibold gap-1"
          >
            <Package className="size-3" />
            กำลังเตรียมพัสดุ (Processing)
          </Badge>
        )
      case "Shipped":
        return (
          <Badge
            variant="outline"
            className="border-purple-500/30 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 text-xs font-semibold gap-1"
          >
            <Truck className="size-3" />
            อยู่ระหว่างจัดส่ง (Shipped)
          </Badge>
        )
      case "Completed":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold gap-1"
          >
            <CheckCircle2 className="size-3" />
            จัดส่งสำเร็จ (Completed)
          </Badge>
        )
      case "Cancelled":
        return (
          <Badge
            variant="outline"
            className="border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs font-semibold gap-1"
          >
            <XCircle className="size-3" />
            ยกเลิกแล้ว (Cancelled)
          </Badge>
        )
    }
  }

  return (
    <div className="mx-auto max-w-5xl py-4 sm:py-8 space-y-6">
      {/* ── Page Header ── */}
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          คำสั่งซื้อของฉัน (My Orders)
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          ติดตามสถานะพัสดุ ตรวจสอบประวัติการสั่งซื้อ และจัดการรายการคำสั่งซื้อของคุณ
        </p>
      </div>

      {/* ── Search & Status Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "All", label: "ทั้งหมด", count: stats.all },
            { key: "Pending", label: "รอตรวจสอบ", count: stats.pending },
            { key: "Processing", label: "กำลังเตรียมของ", count: stats.processing },
            { key: "Shipped", label: "ระหว่างจัดส่ง", count: stats.shipped },
            { key: "Completed", label: "สำเร็จแล้ว", count: stats.completed },
            { key: "Cancelled", label: "ยกเลิกแล้ว", count: stats.cancelled },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={selectedStatus === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(tab.key)}
              className={`text-xs h-8 px-3 shrink-0 cursor-pointer ${
                selectedStatus === tab.key ? "" : "text-muted-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedStatus === tab.key
                    ? "bg-primary-foreground/20 text-primary-foreground font-semibold"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="ค้นหา #ORD หรือชื่อสินค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-muted/20"
          />
        </div>
      </div>

      {/* ── Orders List ── */}
      {orders.length === 0 ? (
        /* Empty State */
        <Card className="border-border/60 shadow-2xs py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
            <div className="size-14 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center">
              <Package className="size-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {rawOrders.length === 0
                ? "คุณยังไม่มีประวัติการสั่งซื้อ"
                : "ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไข"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {rawOrders.length === 0
                ? "เลือกชมสินค้าและเริ่มสั่งซื้อได้เลย จัดส่งรวดเร็วและปลอดภัยทุกรายการ"
                : "ลองเปลี่ยนคำค้นหาหรือเลือกดูแท็บสถานะอื่น"}
            </p>
            <div className="pt-2">
              <Link to="/products">
                <Button size="sm" className="gap-1.5 text-xs cursor-pointer">
                  <span>เลือกชมสินค้าเลย</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Order Cards */
        <div className="space-y-4">
          {orders.map((order) => {
            const stepNum = getStepNumber(order.status)
            const isCancelled = order.status === "Cancelled"

            return (
              <Card
                key={order.id}
                className="border-border/60 shadow-2xs overflow-hidden transition-all hover:border-foreground/30"
              >
                {/* 1. Order Card Header */}
                <div className="bg-muted/30 px-5 py-3.5 border-b border-border/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sm text-foreground">
                        {order.orderNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.orderNumber)}
                        className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer transition-colors"
                        title="คัดลอกหมายเลขคำสั่งซื้อ"
                      >
                        {copiedCode === order.orderNumber ? (
                          <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>

                    <span className="text-muted-foreground hidden sm:inline">•</span>

                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" />
                      สั่งซื้อเมื่อ {order.date}
                    </span>
                  </div>
                </div>

                <CardContent className="p-5 space-y-5">
                  {/* Cancelled State Banner */}
                  {isCancelled && (
                    <div className="rounded-lg border border-red-500/30 bg-red-50/50 dark:bg-red-950/20 p-3.5 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                      <XCircle className="size-4 shrink-0" />
                      <span>
                        <strong>คำสั่งซื้อนี้ถูกยกเลิกแล้ว (Cancelled):</strong> รายการคำสั่งซื้อนี้ได้รับการยกเลิกเรียบร้อยแล้ว
                      </span>
                    </div>
                  )}

                  {/* 2. Visual Stepper Tracker (เมื่อไม่ใช่ Cancelled) */}
                  {!isCancelled && (
                    <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-2xs">
                      <div className="flex items-start w-full relative">
                        {customerSteps.map((s, idx) => {
                          const isActive = stepNum >= s.step
                          const isLineActive = stepNum > s.step

                          return (
                            <div
                              key={s.step}
                              className="flex-1 flex flex-col items-center relative group"
                            >
                              {/* Horizontal Connecting Line */}
                              {idx < customerSteps.length - 1 && (
                                <div
                                  className={`absolute top-4 h-[2px] transition-all duration-300 pointer-events-none z-0 ${
                                    isLineActive ? "bg-primary" : "bg-border/80"
                                  }`}
                                  style={{
                                    left: "calc(50% + 22px)",
                                    right: "calc(-50% + 22px)",
                                  }}
                                />
                              )}

                              {/* Circle */}
                              <div
                                className={`relative z-10 size-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                                  isActive
                                    ? s.step === stepNum
                                      ? "bg-primary text-primary-foreground ring-4 ring-primary/15 scale-105"
                                      : "bg-primary text-primary-foreground"
                                    : "bg-card text-muted-foreground/70 border-2 border-border/80"
                                }`}
                              >
                                {isActive && s.step < stepNum ? (
                                  <Check className="size-3.5" />
                                ) : (
                                  s.step
                                )}
                              </div>

                              {/* Title & Sub */}
                              <div className="mt-2 text-center flex flex-col items-center">
                                <span
                                  className={`text-xs transition-colors ${
                                    isActive
                                      ? "font-bold text-foreground"
                                      : "font-medium text-muted-foreground"
                                  }`}
                                >
                                  {s.title}
                                </span>
                                <span className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">
                                  {s.sub}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. Items Preview in Order */}
                  <div className="divide-y divide-border/40">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Link
                              to={`/products/${item.id}`}
                              className="size-14 rounded-xl bg-muted/40 p-1.5 border border-border/40 flex items-center justify-center shrink-0 overflow-hidden hover:border-foreground/30 transition-colors"
                              title={item.name}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </Link>
                            <div className="min-w-0">
                              <Link
                                to={`/products/${item.id}`}
                                className="hover:underline transition-colors"
                                title={item.name}
                              >
                                <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                                  {item.name}
                                </h4>
                              </Link>
                              {item.variant && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {item.variant}
                                </p>
                              )}
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                จำนวน: <span className="font-semibold text-foreground">{item.quantity}</span> ชิ้น
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-[11px] text-muted-foreground block">
                              (${item.price.toFixed(2)} / ชิ้น)
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between py-2 text-xs">
                        <span className="text-muted-foreground">
                          รายการสินค้าจำนวน {order.itemsCount} ชิ้น
                        </span>
                        <span className="font-bold text-foreground">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 4. Tracking Bar (if available) */}
                  {order.trackingNumber && (
                    <div className="rounded-lg border border-border/60 bg-muted/20 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="size-4 text-primary shrink-0" />
                        <div>
                          <span className="text-muted-foreground">ขนส่งโดย: </span>
                          <strong className="text-foreground">{order.carrier}</strong>
                          <span className="text-muted-foreground ml-2 font-mono">
                            ({order.trackingNumber})
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(order.trackingNumber!)}
                        className="text-primary hover:underline text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="size-3" />
                        <span>คัดลอกเลขพัสดุ</span>
                      </button>
                    </div>
                  )}

                  {/* 5. Card Footer: Total Amount & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">ยอดรวมคำสั่งซื้อ:</span>
                      <span className="text-base sm:text-lg font-bold text-foreground">
                        ${order.total.toFixed(2)}
                      </span>
                      <Badge variant="secondary" className="text-[10px] ml-1">
                        ชำระผ่าน {order.paymentMethod}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === "Pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCancellingOrder(order)}
                          className="text-xs text-muted-foreground hover:text-destructive cursor-pointer h-8"
                        >
                          ยกเลิกคำสั่งซื้อ
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs cursor-pointer h-8 gap-1"
                      >
                        <span>ดูรายละเอียด & การจัดส่ง</span>
                        <ChevronRight className="size-3.5" />
                      </Button>

                      <Link to="/products">
                        <Button
                          size="sm"
                          className="text-xs cursor-pointer h-8 gap-1 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
                        >
                          <RotateCcw className="size-3" />
                          <span>ซื้อซ้ำ</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ── Order Details Dialog ── */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="text-lg font-bold">
                รายละเอียดคำสั่งซื้อ
              </DialogTitle>
              {selectedOrder && getStatusBadge(selectedOrder.status)}
            </div>
            <DialogDescription className="text-xs text-muted-foreground font-mono">
              {selectedOrder?.orderNumber} • สั่งซื้อเมื่อ {selectedOrder?.date}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-5 pt-2 text-xs">
              {/* Shipping & Delivery Info */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                <h4 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" />
                  ข้อมูลการจัดส่งและผู้รับ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">ชื่อผู้รับ</span>
                    <span className="font-semibold text-foreground">
                      {selectedOrder.customer.name}
                    </span>
                    <span className="text-muted-foreground block text-[11px] mt-0.5">
                      {selectedOrder.customer.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">ที่อยู่จัดส่ง</span>
                    <span className="text-foreground">
                      {selectedOrder.shippingAddress || "123 Sukhumvit Road, Khlong Toei, Bangkok 10110"}
                    </span>
                  </div>
                </div>

                {selectedOrder.trackingNumber && (
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted-foreground">บริษัทขนส่ง: </span>
                      <strong className="text-foreground">{selectedOrder.carrier}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span>เลขพัสดุ: <strong>{selectedOrder.trackingNumber}</strong></span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedOrder.trackingNumber!)}
                        className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="คัดลอกเลขพัสดุ"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <Package className="size-3.5 text-primary" />
                  รายการสินค้าในคำสั่งซื้อ ({selectedOrder.items?.length || selectedOrder.itemsCount} รายการ)
                </h4>

                <div className="rounded-xl border border-border/60 divide-y divide-border/40 overflow-hidden">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Link
                          to={`/products/${item.id}`}
                          className="size-11 rounded-lg bg-muted/40 p-1 border border-border/40 flex items-center justify-center shrink-0 hover:border-foreground/30 transition-colors"
                          title={item.name}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            to={`/products/${item.id}`}
                            className="hover:underline transition-colors"
                            title={item.name}
                          >
                            <p className="font-semibold text-foreground truncate">{item.name}</p>
                          </Link>
                          {item.variant && (
                            <p className="text-[11px] text-muted-foreground">{item.variant}</p>
                          )}
                          <p className="text-[11px] text-muted-foreground">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <span className="font-bold text-foreground shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="rounded-xl border border-border/60 p-4 space-y-2 bg-card">
                <div className="flex justify-between text-muted-foreground">
                  <span>ราคาสินค้ารวม (Subtotal)</span>
                  <span className="text-foreground">${selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>ค่าบริการจัดส่ง (Shipping)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">ฟรี (Free)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>วิธีชำระเงิน</span>
                  <span className="text-foreground">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border/40">
                  <span>ยอดสุทธิ (Total)</span>
                  <span className="text-base">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedOrder(null)}
              className="cursor-pointer text-xs"
            >
              ปิดหน้าต่าง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Cancel Order Dialog ── */}
      <Dialog
        open={!!cancellingOrder}
        onOpenChange={(open) => !open && setCancellingOrder(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              ยืนยันการยกเลิกคำสั่งซื้อ
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1.5">
              คุณต้องการยกเลิกคำสั่งซื้อ{" "}
              <strong className="text-foreground font-mono">
                {cancellingOrder?.orderNumber}
              </strong>{" "}
              ใช่หรือไม่? เมื่อยกเลิกแล้วจะไม่สามารถกู้คืนได้ และยอดเงินจะได้รับการดำเนินการคืนตามเงื่อนไข
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCancellingOrder(null)}
              className="cursor-pointer text-xs"
            >
              ไม่ยกเลิก
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => cancellingOrder && handleCancelOrder(cancellingOrder.id)}
              className="cursor-pointer text-xs gap-1.5"
            >
              <XCircle className="size-3.5" />
              <span>ยืนยันยกเลิกคำสั่งซื้อ</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
