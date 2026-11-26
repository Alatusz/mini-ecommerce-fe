import { Link } from "react-router-dom"
import { Controller } from "react-hook-form"
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  MapPin,
  Lock,
  Plus,
  Pencil,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Clock,
} from "lucide-react"

import { useUserProfile } from "./useHooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function UserProfilePage() {
  const {
    user,
    profile,
    activeTab,
    setActiveTab,
    profileControl,
    handleSaveProfile,
    isSavingProfile,
    profileSuccess,
    passwordControl,
    passwordError,
    passwordSuccess,
    isChangingPassword,
    handlePasswordChange,
    addresses,
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddressId,
    addressControl,
    isSavingAddress,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
  } = useUserProfile()

  const fullName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()

  const userInitials =
    (
      (profile?.firstName || "").charAt(0) +
      (profile?.lastName || "").charAt(0)
    ).toUpperCase() ||
    (profile?.email || user?.email || "U").charAt(0).toUpperCase()

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("th-TH", {
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-4 sm:py-8">
      {/* ── User Overview Profile Card ── */}
      <Card className="overflow-hidden border-border/60 shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Avatar className="size-16 border-2 border-border/80 shadow-xs sm:size-20">
                <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground sm:text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h2 className="text-lg font-bold text-foreground sm:text-xl">
                    {fullName || profile?.email || user?.email || "User"}
                  </h2>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium capitalize"
                  >
                    {profile?.role || user?.role || "Customer"}
                  </Badge>
                </div>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
                  <Mail className="size-3.5" />
                  <span>{profile?.email || user?.email}</span>
                </p>

                {memberSince && (
                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground sm:justify-start">
                    <Clock className="size-3" />
                    <span>เป็นสมาชิกตั้งแต่ {memberSince}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/products">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 cursor-pointer gap-1.5 text-xs"
                >
                  <ShoppingBag className="size-3.5" />
                  <span>เลือกซื้อสินค้า</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border/60 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`-mb-1 flex cursor-pointer items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
            activeTab === "profile"
              ? "border-primary bg-muted/30 text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserIcon className="size-4" />
          <span>ข้อมูลส่วนตัว</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("addresses")}
          className={`-mb-1 flex cursor-pointer items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
            activeTab === "addresses"
              ? "border-primary bg-muted/30 text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <MapPin className="size-4" />
          <span>ที่อยู่จัดส่ง ({addresses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`-mb-1 flex cursor-pointer items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
            activeTab === "security"
              ? "border-primary bg-muted/30 text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="size-4" />
          <span>ความปลอดภัย & รหัสผ่าน</span>
        </button>
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === "profile" && (
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  แก้ไขข้อมูลส่วนตัว
                </h3>
                {profileSuccess && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    บันทึกข้อมูลเรียบร้อยแล้ว
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="firstName"
                  control={profileControl}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="first-name"
                        className="text-xs font-semibold"
                      >
                        ชื่อจริง (First Name)
                      </Label>
                      <Input
                        {...field}
                        id="first-name"
                        aria-invalid={fieldState.invalid}
                        className="h-9 text-xs"
                      />
                      {fieldState.error && (
                        <p className="text-[11px] text-destructive">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="lastName"
                  control={profileControl}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="last-name"
                        className="text-xs font-semibold"
                      >
                        นามสกุล (Last Name)
                      </Label>
                      <Input
                        {...field}
                        id="last-name"
                        aria-invalid={fieldState.invalid}
                        className="h-9 text-xs"
                      />
                      {fieldState.error && (
                        <p className="text-[11px] text-destructive">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="email"
                  control={profileControl}
                  render={({ field }) => (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="profile-email"
                          className="text-xs font-semibold"
                        >
                          อีเมล (Email Address)
                        </Label>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 py-0 text-[10px] text-emerald-600"
                        >
                          ยืนยันแล้ว
                        </Badge>
                      </div>
                      <Input
                        {...field}
                        id="profile-email"
                        type="email"
                        disabled
                        className="h-9 cursor-not-allowed bg-muted/40 text-xs"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        อีเมลที่ใช้สำหรับเข้าสู่ระบบและรับข้อมูลคำสั่งซื้อ
                      </p>
                    </div>
                  )}
                />

                <Controller
                  name="phone"
                  control={profileControl}
                  render={({ field }) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="profile-phone"
                        className="text-xs font-semibold"
                      >
                        เบอร์โทรศัพท์ (Phone Number)
                      </Label>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id="profile-phone"
                        placeholder="+66 8x xxx xxxx"
                        className="h-9 text-xs"
                      />
                    </div>
                  )}
                />
              </div>

              <Controller
                name="bio"
                control={profileControl}
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="profile-bio"
                      className="text-xs font-semibold"
                    >
                      คำแนะนำตัว / บันทึกย่อ (Bio)
                    </Label>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="profile-bio"
                      placeholder="เขียนอะไรสั้นๆ เกี่ยวกับตัวคุณ..."
                      className="h-9 text-xs"
                    />
                  </div>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSavingProfile}
                  className="cursor-pointer gap-1.5 text-xs"
                >
                  {isSavingProfile ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>
                    {isSavingProfile
                      ? "กำลังบันทึก..."
                      : "บันทึกการเปลี่ยนแปลง"}
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Shipping Addresses */}
      {activeTab === "addresses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">
              ที่อยู่สำหรับจัดส่งพัสดุ
            </h3>
            <Button
              type="button"
              size="sm"
              onClick={handleOpenAddAddress}
              className="h-8 cursor-pointer gap-1.5 text-xs"
            >
              <Plus className="size-3.5" />
              <span>เพิ่มที่อยู่ใหม่</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <Card
                key={addr.id}
                className="relative border-border/60 shadow-2xs"
              >
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">
                        {addr.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold uppercase"
                      >
                        {addr.tag}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenEditAddress(addr)}
                        className="cursor-pointer text-muted-foreground hover:text-foreground"
                        title="แก้ไขที่อยู่"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="cursor-pointer text-muted-foreground hover:text-destructive"
                        title="ลบที่อยู่"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {addr.address}
                  </p>

                  <div className="flex items-center gap-1.5 border-t border-border/40 pt-2 text-xs text-muted-foreground">
                    <Phone className="size-3" />
                    <span>{addr.phone}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === "security" && (
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-6">
            <form
              onSubmit={handlePasswordChange}
              className="max-w-md space-y-5"
            >
              <div className="border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  เปลี่ยนรหัสผ่าน (Change Password)
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  แนะนำให้ใช้รหัสผ่านที่มีความยาวอย่างน้อย 6 ตัวอักษร
                </p>
              </div>

              {passwordError && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>เปลี่ยนรหัสผ่านเรียบร้อยแล้ว</span>
                </div>
              )}

              <Controller
                name="currentPassword"
                control={passwordControl}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="current-password"
                      className="text-xs font-semibold"
                    >
                      รหัสผ่านปัจจุบัน
                    </Label>
                    <Input
                      {...field}
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                      className="h-9 text-xs"
                    />
                    {fieldState.error && (
                      <p className="text-[11px] text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="newPassword"
                control={passwordControl}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="new-password"
                      className="text-xs font-semibold"
                    >
                      รหัสผ่านใหม่
                    </Label>
                    <Input
                      {...field}
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                      className="h-9 text-xs"
                    />
                    {fieldState.error && (
                      <p className="text-[11px] text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="confirmPassword"
                control={passwordControl}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="confirm-password"
                      className="text-xs font-semibold"
                    >
                      ยืนยันรหัสผ่านใหม่
                    </Label>
                    <Input
                      {...field}
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                      className="h-9 text-xs"
                    />
                    {fieldState.error && (
                      <p className="text-[11px] text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isChangingPassword}
                  className="cursor-pointer gap-1.5 text-xs"
                >
                  {isChangingPassword ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Shield className="size-3.5" />
                  )}
                  <span>
                    {isChangingPassword ? "กำลังอัปเดต..." : "อัปเดตรหัสผ่าน"}
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── Add / Edit Address Dialog ── */}
      <Dialog
        open={isAddressModalOpen}
        onOpenChange={(open) => !open && setIsAddressModalOpen(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingAddressId ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่ใหม่"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSaveAddress}
            className="space-y-3.5 py-2 text-xs"
          >
            <Controller
              name="title"
              control={addressControl}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label htmlFor="modal-address-title" className="text-xs">
                    ชื่อที่อยู่ (เช่น บ้าน, ออฟฟิศ, คอนโด)
                  </Label>
                  <Input
                    {...field}
                    id="modal-address-title"
                    placeholder="บ้าน, ออฟฟิศ"
                    aria-invalid={fieldState.invalid}
                    className="h-9 text-xs"
                  />
                  {fieldState.error && (
                    <p className="text-[11px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="tag"
              control={addressControl}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label className="text-xs">ประเภทสถานที่</Label>
                  <div className="flex gap-2">
                    {(["HOME", "OFFICE", "OTHER"] as const).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => field.onChange(tag)}
                        className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                          field.value === tag
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />

            <Controller
              name="address"
              control={addressControl}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label htmlFor="modal-street-address" className="text-xs">
                    ที่อยู่โดยละเอียด (บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด,
                    รหัสไปรษณีย์)
                  </Label>
                  <Input
                    {...field}
                    id="modal-street-address"
                    placeholder="123/45 ถนนสุขุมวิท..."
                    aria-invalid={fieldState.invalid}
                    className="h-9 text-xs"
                  />
                  {fieldState.error && (
                    <p className="text-[11px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="phone"
              control={addressControl}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label htmlFor="modal-phone" className="text-xs">
                    เบอร์โทรศัพท์ผู้รับ
                  </Label>
                  <Input
                    {...field}
                    id="modal-phone"
                    placeholder="+66 8x xxx xxxx"
                    aria-invalid={fieldState.invalid}
                    className="h-9 text-xs"
                  />
                  {fieldState.error && (
                    <p className="text-[11px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <DialogFooter className="gap-2 pt-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddressModalOpen(false)}
                className="cursor-pointer text-xs"
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSavingAddress}
                className="cursor-pointer text-xs"
              >
                {isSavingAddress ? "กำลังบันทึก..." : "บันทึกที่อยู่"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
