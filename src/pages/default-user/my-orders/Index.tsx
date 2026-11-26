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
  RotateCcw,
  Calendar,
  ChevronRight,
  Star,
} from "lucide-react"

import { useMyOrders, type OrderItem } from "./useHooks"
import { OrderDetailsDialog } from "./common/OrderDetailsDialog"
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
import { Textarea } from "@/components/ui/textarea"

const customerSteps = [
  { step: 1, key: "Pending", title: "สั่งซื้อสำเร็จ", sub: "รอตรวจสอบ" },
  { step: 2, key: "Processing", title: "กำลังเตรียมของ", sub: "กำลังแพ็คเกจ" },
  {
    step: 3,
    key: "Shipped",
    title: "ส่งให้บริษัทขนส่ง",
    sub: "อยู่ระหว่างนำจ่าย",
  },
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
    ratingTargetItem,
    setRatingTargetItem,
    selectedStars,
    setSelectedStars,
    reviewText,
    setReviewText,
    isRating,
    handleSubmitRating,
  } = useMyOrders()

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-amber-500/30 bg-amber-50 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          >
            <Clock className="size-3" />
            รอดำเนินการ (Pending)
          </Badge>
        )
      case "Processing":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-blue-500/30 bg-blue-50 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          >
            <Package className="size-3" />
            กำลังเตรียมพัสดุ (Processing)
          </Badge>
        )
      case "Shipped":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-purple-500/30 bg-purple-50 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
          >
            <Truck className="size-3" />
            อยู่ระหว่างจัดส่ง (Shipped)
          </Badge>
        )
      case "Completed":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/30 bg-emerald-50 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="size-3" />
            จัดส่งสำเร็จ (Completed)
          </Badge>
        )
      case "Cancelled":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-red-500/30 bg-red-50 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            <XCircle className="size-3" />
            ยกเลิกแล้ว (Cancelled)
          </Badge>
        )
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-4 sm:py-8">
      {/* ── Page Header ── */}
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          คำสั่งซื้อของฉัน (My Orders)
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          ติดตามสถานะพัสดุ ตรวจสอบประวัติการสั่งซื้อ
          และจัดการรายการคำสั่งซื้อของคุณ
        </p>
      </div>

      {/* ── Search & Status Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "All", label: "ทั้งหมด", count: stats.all },
            { key: "Pending", label: "รอตรวจสอบ", count: stats.pending },
            {
              key: "Processing",
              label: "กำลังเตรียมของ",
              count: stats.processing,
            },
            { key: "Shipped", label: "ระหว่างจัดส่ง", count: stats.shipped },
            { key: "Completed", label: "สำเร็จแล้ว", count: stats.completed },
            { key: "Cancelled", label: "ยกเลิกแล้ว", count: stats.cancelled },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={selectedStatus === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(tab.key)}
              className={`h-8 shrink-0 cursor-pointer px-3 text-xs ${
                selectedStatus === tab.key ? "" : "text-muted-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`py-0.2 ml-1.5 rounded-full px-1.5 text-[10px] ${
                  selectedStatus === tab.key
                    ? "bg-primary-foreground/20 font-semibold text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full shrink-0 sm:w-64">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ค้นหา #ORD หรือชื่อสินค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 bg-muted/20 pl-8 text-xs"
          />
        </div>
      </div>

      {/* ── Orders List ── */}
      {orders.length === 0 ? (
        /* Empty State */
        <Card className="border-border/60 py-16 text-center shadow-2xs">
          <CardContent className="mx-auto flex max-w-sm flex-col items-center justify-center space-y-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
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
                <Button size="sm" className="cursor-pointer gap-1.5 text-xs">
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
                className="overflow-hidden border-border/60 shadow-2xs transition-all hover:border-foreground/30"
              >
                {/* 1. Order Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 bg-muted/30 px-5 py-3.5 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-bold text-foreground">
                        {order.orderNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.orderNumber)}
                        className="cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                        title="คัดลอกหมายเลขคำสั่งซื้อ"
                      >
                        {copiedCode === order.orderNumber ? (
                          <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>

                    <span className="hidden text-muted-foreground sm:inline">
                      •
                    </span>

                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="size-3" />
                      สั่งซื้อเมื่อ {order.date}
                    </span>
                  </div>
                </div>

                <CardContent className="space-y-5 p-5">
                  {/* Cancelled State Banner */}
                  {isCancelled && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-50/50 p-3.5 text-xs text-red-700 dark:bg-red-950/20 dark:text-red-300">
                      <XCircle className="size-4 shrink-0" />
                      <span>
                        <strong>คำสั่งซื้อนี้ถูกยกเลิกแล้ว (Cancelled):</strong>{" "}
                        รายการคำสั่งซื้อนี้ได้รับการยกเลิกเรียบร้อยแล้ว
                      </span>
                    </div>
                  )}

                  {/* 2. Visual Stepper Tracker (เมื่อไม่ใช่ Cancelled) */}
                  {!isCancelled && (
                    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-2xs sm:p-5">
                      <div className="relative flex w-full items-start">
                        {customerSteps.map((s, idx) => {
                          const isActive = stepNum >= s.step
                          const isLineActive = stepNum > s.step

                          return (
                            <div
                              key={s.step}
                              className="group relative flex flex-1 flex-col items-center"
                            >
                              {/* Horizontal Connecting Line */}
                              {idx < customerSteps.length - 1 && (
                                <div
                                  className={`pointer-events-none absolute top-4 z-0 h-[2px] transition-all duration-300 ${
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
                                className={`relative z-10 flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
                                  isActive
                                    ? s.step === stepNum
                                      ? "scale-105 bg-primary text-primary-foreground ring-4 ring-primary/15"
                                      : "bg-primary text-primary-foreground"
                                    : "border-2 border-border/80 bg-card text-muted-foreground/70"
                                }`}
                              >
                                {isActive && s.step < stepNum ? (
                                  <Check className="size-3.5" />
                                ) : (
                                  s.step
                                )}
                              </div>

                              {/* Title & Sub */}
                              <div className="mt-2 flex flex-col items-center text-center">
                                <span
                                  className={`text-xs transition-colors ${
                                    isActive
                                      ? "font-bold text-foreground"
                                      : "font-medium text-muted-foreground"
                                  }`}
                                >
                                  {s.title}
                                </span>
                                <span className="mt-0.5 hidden text-[10px] text-muted-foreground sm:block">
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
                          className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Link
                              to={`/products/${item.id}`}
                              className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-muted/40 p-1.5 transition-colors hover:border-foreground/30"
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
                                className="transition-colors hover:underline"
                                title={item.name}
                              >
                                <h4 className="truncate text-xs font-semibold text-foreground sm:text-sm">
                                  {item.name}
                                </h4>
                              </Link>
                              {item.variant && (
                                <p className="mt-0.5 text-[11px] text-muted-foreground">
                                  {item.variant}
                                </p>
                              )}
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                จำนวน:{" "}
                                <span className="font-semibold text-foreground">
                                  {item.quantity}
                                </span>{" "}
                                ชิ้น
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <span className="text-xs font-bold text-foreground sm:text-sm">
                              ฿{(item.price * item.quantity).toLocaleString()}
                            </span>
                            <span className="block text-[11px] text-muted-foreground">
                              (฿{item.price.toLocaleString()} / ชิ้น)
                            </span>
                            {order.status === "Completed" &&
                              (item.rating > 0 ? (
                                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-500">
                                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                  {item.rating}/5
                                </span>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setRatingTargetItem(item)
                                    setSelectedStars(0)
                                  }}
                                  className="mt-1.5 h-7 cursor-pointer gap-1 text-xs"
                                >
                                  <Star className="size-3" />
                                  <span>รีวิว</span>
                                </Button>
                              ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between py-2 text-xs">
                        <span className="text-muted-foreground">
                          รายการสินค้าจำนวน {order.itemsCount} ชิ้น
                        </span>
                        <span className="font-bold text-foreground">
                          ฿{order.total.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 4. Tracking Bar (if available) */}
                  {order.trackingNumber && (
                    <div className="flex flex-col justify-between gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 text-xs sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <Truck className="size-4 shrink-0 text-primary" />
                        <div>
                          <span className="text-muted-foreground">
                            ขนส่งโดย:{" "}
                          </span>
                          <strong className="text-foreground">
                            {order.carrier}
                          </strong>
                          <span className="ml-2 font-mono text-muted-foreground">
                            ({order.trackingNumber})
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(order.trackingNumber!)}
                        className="flex cursor-pointer items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Copy className="size-3" />
                        <span>คัดลอกเลขพัสดุ</span>
                      </button>
                    </div>
                  )}

                  {/* 5. Card Footer: Total Amount & Action Buttons */}
                  <div className="flex flex-col justify-between gap-3 border-t border-border/40 pt-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        ยอดรวมคำสั่งซื้อ:
                      </span>
                      <span className="text-base font-bold text-foreground sm:text-lg">
                        ฿{order.total.toLocaleString()}
                      </span>
                      <Badge variant="secondary" className="ml-1 text-[10px]">
                        ชำระผ่าน {order.paymentMethod}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === "Pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCancellingOrder(order)}
                          className="h-8 cursor-pointer text-xs text-muted-foreground hover:text-destructive"
                        >
                          ยกเลิกคำสั่งซื้อ
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="h-8 cursor-pointer gap-1 text-xs"
                      >
                        <span>ดูรายละเอียด & การจัดส่ง</span>
                        <ChevronRight className="size-3.5" />
                      </Button>

                      <Link to="/products">
                        <Button
                          size="sm"
                          className="h-8 cursor-pointer gap-1 text-xs"
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
      <OrderDetailsDialog
        order={selectedOrder}
        statusBadge={selectedOrder ? getStatusBadge(selectedOrder.status) : null}
        onClose={() => setSelectedOrder(null)}
        onCopyTracking={handleCopy}
      />

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
            <DialogDescription className="pt-1.5 text-xs text-muted-foreground">
              คุณต้องการยกเลิกคำสั่งซื้อ{" "}
              <strong className="font-mono text-foreground">
                {cancellingOrder?.orderNumber}
              </strong>{" "}
              ใช่หรือไม่? เมื่อยกเลิกแล้วจะไม่สามารถกู้คืนได้
              และยอดเงินจะได้รับการดำเนินการคืนตามเงื่อนไข
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-3 sm:gap-0">
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
              onClick={() =>
                cancellingOrder && handleCancelOrder(cancellingOrder.id)
              }
              className="cursor-pointer gap-1.5 text-xs"
            >
              <XCircle className="size-3.5" />
              <span>ยืนยันยกเลิกคำสั่งซื้อ</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Rate Product */}
      <Dialog
        open={Boolean(ratingTargetItem)}
        onOpenChange={(open) => {
          if (!open) {
            setRatingTargetItem(null)
            setSelectedStars(0)
            setReviewText("")
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              ให้คะแนนสินค้า
            </DialogTitle>
            <DialogDescription className="pt-1 text-xs text-muted-foreground">
              เลือกจำนวนดาวเพื่อให้คะแนนความพึงพอใจสำหรับสินค้านี้
            </DialogDescription>
          </DialogHeader>

          {ratingTargetItem && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                <img
                  src={ratingTargetItem.image}
                  alt={ratingTargetItem.name}
                  className="size-12 rounded-md border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                    {ratingTargetItem.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    จำนวน {ratingTargetItem.quantity} ชิ้น
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= selectedStars
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedStars(star)}
                      aria-label={`ให้ ${star} ดาว`}
                      className="cursor-pointer p-1"
                    >
                      <Star
                        className={`size-7 ${
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="เขียนรีวิวสินค้า (ไม่บังคับ)..."
            className="text-xs sm:text-sm"
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setRatingTargetItem(null)
                setSelectedStars(0)
                setReviewText("")
              }}
              disabled={isRating}
              className="cursor-pointer text-xs"
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={selectedStars === 0 || isRating}
              onClick={handleSubmitRating}
              className="cursor-pointer gap-1.5 text-xs"
            >
              <Star className="size-3.5" />
              <span>{isRating ? "กำลังส่ง..." : "ส่งคะแนน"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
