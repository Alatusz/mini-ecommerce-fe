import { Link } from "react-router-dom"
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
    activeTab,
    setActiveTab,
    profileForm,
    handleProfileFieldChange,
    handleSaveProfile,
    isSavingProfile,
    profileSuccess,
    passwordForm,
    setPasswordForm,
    passwordError,
    passwordSuccess,
    isChangingPassword,
    handlePasswordChange,
    addresses,
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddressId,
    addressForm,
    setAddressForm,
    handleOpenAddAddress,
    handleOpenEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
  } = useUserProfile()

  const userInitials =
    (profileForm.firstName.charAt(0) + profileForm.lastName.charAt(0)).toUpperCase() ||
    "U"

  return (
    <div className="mx-auto max-w-4xl py-4 sm:py-8 space-y-6">
      {/* ── User Overview Profile Card ── */}
      <Card className="border-border/60 shadow-2xs overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="size-16 sm:size-20 border-2 border-border/80 shadow-xs">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl sm:text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    {profileForm.firstName} {profileForm.lastName}
                  </h2>
                  <Badge variant="outline" className="text-[10px] capitalize font-medium">
                    {user?.role || "Customer"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="size-3.5" />
                  <span>{user?.email || profileForm.email}</span>
                </p>

                <p className="text-[11px] text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                  <Clock className="size-3" />
                  <span>เป็นสมาชิกตั้งแต่ ตุลาคม 2026</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/products">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs cursor-pointer h-9"
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
      <div className="flex items-center gap-2 border-b border-border/60 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-1 ${
            activeTab === "profile"
              ? "border-primary text-foreground bg-muted/30"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserIcon className="size-4" />
          <span>ข้อมูลส่วนตัว</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("addresses")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-1 ${
            activeTab === "addresses"
              ? "border-primary text-foreground bg-muted/30"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <MapPin className="size-4" />
          <span>ที่อยู่จัดส่ง ({addresses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-1 ${
            activeTab === "security"
              ? "border-primary text-foreground bg-muted/30"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="size-4" />
          <span>ความปลอดภัย & รหัสผ่าน</span>
        </button>
      </div>

      {/* ── Tab Content ── */}

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
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="size-4" />
                    บันทึกข้อมูลเรียบร้อยแล้ว
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="first-name" className="text-xs font-semibold">
                    ชื่อจริง (First Name)
                  </Label>
                  <Input
                    id="first-name"
                    value={profileForm.firstName}
                    onChange={(e) =>
                      handleProfileFieldChange("firstName", e.target.value)
                    }
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="last-name" className="text-xs font-semibold">
                    นามสกุล (Last Name)
                  </Label>
                  <Input
                    id="last-name"
                    value={profileForm.lastName}
                    onChange={(e) =>
                      handleProfileFieldChange("lastName", e.target.value)
                    }
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile-email" className="text-xs font-semibold">
                      อีเมล (Email Address)
                    </Label>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 text-[10px] py-0">
                      ยืนยันแล้ว
                    </Badge>
                  </div>
                  <Input
                    id="profile-email"
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="h-9 text-xs bg-muted/40 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    อีเมลที่ใช้สำหรับเข้าสู่ระบบและรับข้อมูลคำสั่งซื้อ
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-phone" className="text-xs font-semibold">
                    เบอร์โทรศัพท์ (Phone Number)
                  </Label>
                  <Input
                    id="profile-phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      handleProfileFieldChange("phone", e.target.value)
                    }
                    placeholder="+66 8x xxx xxxx"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-bio" className="text-xs font-semibold">
                  คำแนะนำตัว / บันทึกย่อ (Bio)
                </Label>
                <Input
                  id="profile-bio"
                  value={profileForm.bio || ""}
                  onChange={(e) =>
                    handleProfileFieldChange("bio", e.target.value)
                  }
                  placeholder="เขียนอะไรสั้นๆ เกี่ยวกับตัวคุณ..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSavingProfile}
                  className="gap-1.5 text-xs cursor-pointer bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
                >
                  {isSavingProfile ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>{isSavingProfile ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}</span>
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
              className="gap-1.5 text-xs cursor-pointer h-8"
            >
              <Plus className="size-3.5" />
              <span>เพิ่มที่อยู่ใหม่</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <Card
                key={addr.id}
                className="border-border/60 shadow-2xs relative hover:border-foreground/30 transition-all"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">
                        {addr.title}
                      </h4>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
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

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {addr.address}
                  </p>

                  <div className="pt-2 border-t border-border/40 text-xs text-muted-foreground flex items-center gap-1.5">
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
            <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
              <div className="border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  เปลี่ยนรหัสผ่าน (Change Password)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  แนะนำให้ใช้รหัสผ่านที่มีความยาวอย่างน้อย 6 ตัวอักษร
                </p>
              </div>

              {passwordError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 flex items-center gap-2 text-xs text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 p-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>เปลี่ยนรหัสผ่านเรียบร้อยแล้ว</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="current-password" className="text-xs font-semibold">
                  รหัสผ่านปัจจุบัน
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-xs font-semibold">
                  รหัสผ่านใหม่
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-xs font-semibold">
                  ยืนยันรหัสผ่านใหม่
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="h-9 text-xs"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isChangingPassword}
                  className="gap-1.5 text-xs cursor-pointer bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
                >
                  {isChangingPassword ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Shield className="size-3.5" />
                  )}
                  <span>{isChangingPassword ? "กำลังอัปเดต..." : "อัปเดตรหัสผ่าน"}</span>
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

          <div className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <Label htmlFor="modal-address-title" className="text-xs">
                ชื่อที่อยู่ (เช่น บ้าน, ออฟฟิศ, คอนโด)
              </Label>
              <Input
                id="modal-address-title"
                placeholder="บ้าน, ออฟฟิศ"
                value={addressForm.title}
                onChange={(e) =>
                  setAddressForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">ประเภทสถานที่</Label>
              <div className="flex gap-2">
                {(["HOME", "OFFICE", "OTHER"] as const).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setAddressForm((prev) => ({ ...prev, tag }))}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      addressForm.tag === tag
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="modal-street-address" className="text-xs">
                ที่อยู่โดยละเอียด (บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์)
              </Label>
              <Input
                id="modal-street-address"
                placeholder="123/45 ถนนสุขุมวิท..."
                value={addressForm.address}
                onChange={(e) =>
                  setAddressForm((prev) => ({ ...prev, address: e.target.value }))
                }
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="modal-phone" className="text-xs">
                เบอร์โทรศัพท์ผู้รับ
              </Label>
              <Input
                id="modal-phone"
                placeholder="+66 8x xxx xxxx"
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
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
              type="button"
              size="sm"
              onClick={handleSaveAddress}
              disabled={!addressForm.title.trim() || !addressForm.address.trim()}
              className="cursor-pointer text-xs bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
            >
              บันทึกที่อยู่
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
