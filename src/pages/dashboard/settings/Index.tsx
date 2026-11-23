import {
  Sun,
  Moon,
  Monitor,
  Check,
  Palette,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Layers,
  Store,
} from "lucide-react"

import { useSettings } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardSettingsPage() {
  const {
    theme,
    handleThemeModeChange,
    color,
    presets,
    handleColorChange,
    demoSwitch,
    setDemoSwitch,
    demoSlider,
    setDemoSlider,
    demoCheckbox,
    setDemoCheckbox,
  } = useSettings()

  return (
    <PageContent>
      <div className="mx-auto max-w-4xl space-y-6 pt-1 pb-10">
        {/* ── Page Header ── */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Store Settings
          </h1>
          <p className="text-xs text-muted-foreground">
            Customize the admin console appearance, brand color palettes, and interface theme.
          </p>
        </div>

        {/* ── Section 1: Color Presets (Swatches) ── */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Palette className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Brand Color Swatches
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose a primary accent color for buttons, active navigation, focus rings, and badges.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {presets.map((preset) => {
                const isSelected = color === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleColorChange(preset.id)}
                    aria-pressed={isSelected}
                    className={`group relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border/60 hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      {/* Color Circle */}
                      <span
                        className="size-6 rounded-full shadow-xs ring-1 ring-black/10 dark:ring-white/20 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: preset.swatchHex }}
                      />
                      {isSelected && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-foreground block">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground line-clamp-1">
                        {preset.description}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Section 2: Interface Theme Mode ── */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Interface Theme
                </CardTitle>
                <CardDescription className="text-xs">
                  Select your preferred mode. You can also press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground font-semibold">D</kbd> anywhere to quick-toggle dark mode.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "light" as const, label: "Light", icon: Sun },
                { id: "dark" as const, label: "Dark", icon: Moon },
                { id: "system" as const, label: "System", icon: Monitor },
              ].map((opt) => {
                const Icon = opt.icon
                const isSelected = theme === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleThemeModeChange(opt.id)}
                    aria-pressed={isSelected}
                    className={`flex items-center justify-center gap-2 rounded-lg border py-3 px-4 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/20 shadow-xs"
                        : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Section 3: Live Component Sandbox (Interactive Preview) ── */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Layers className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Live UI Preview Sandbox
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Test how the selected theme palette dynamically transforms core Shadcn components in real-time.
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-[11px] font-mono">
                Active: {color.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Buttons Row */}
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Buttons & Actions
              </Label>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button size="sm" className="h-8 text-xs cursor-pointer shadow-xs">
                  Primary Button
                </Button>
                <Button size="sm" variant="secondary" className="h-8 text-xs cursor-pointer">
                  Secondary
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs cursor-pointer">
                  Outline
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-xs cursor-pointer">
                  Ghost
                </Button>
                <Button size="sm" variant="destructive" className="h-8 text-xs cursor-pointer">
                  Destructive
                </Button>
              </div>
            </div>

            {/* Badges & Tags */}
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Badges & Chips
              </Label>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="text-xs">Primary Badge</Badge>
                <Badge variant="secondary" className="text-xs">Secondary</Badge>
                <Badge variant="outline" className="text-xs">Outline</Badge>
                <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-0 text-xs">
                  Soft Tinted
                </Badge>
              </div>
            </div>

            {/* Interactive Form Controls */}
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Form Controls & Progress
              </Label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-center rounded-lg border border-border/60 bg-muted/20 p-4">
                {/* Switch */}
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="demo-switch" className="text-xs cursor-pointer">
                    Push Notifications
                  </Label>
                  <Switch
                    id="demo-switch"
                    checked={demoSwitch}
                    onCheckedChange={setDemoSwitch}
                  />
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="demo-checkbox"
                    checked={demoCheckbox}
                    onCheckedChange={(checked) => setDemoCheckbox(Boolean(checked))}
                  />
                  <Label htmlFor="demo-checkbox" className="text-xs cursor-pointer">
                    Automatic Stock Sync
                  </Label>
                </div>

                {/* Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Discount Rate</span>
                    <span className="font-semibold text-foreground font-mono">{demoSlider}%</span>
                  </div>
                  <Slider
                    value={[demoSlider]}
                    onValueChange={(val) => {
                      if (Array.isArray(val)) {
                        setDemoSlider(val[0])
                      } else if (typeof val === "number") {
                        setDemoSlider(val)
                      }
                    }}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Progress Bar & Tabs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Progress */}
              <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">Storage Quota</span>
                  <span className="font-mono text-muted-foreground">72%</span>
                </div>
                <Progress value={72} className="h-2" />
                <p className="text-[11px] text-muted-foreground">
                  3.6 GB of 5.0 GB used
                </p>
              </div>

              {/* Sample Tab Navigation */}
              <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-4">
                <div className="text-xs font-medium text-foreground">
                  Segmented Tabs
                </div>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview" className="text-xs cursor-pointer">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="text-xs cursor-pointer">
                      Orders
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="text-xs cursor-pointer">
                      Reports
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Sample Metric Cards */}
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Dashboard Widget Accent
              </Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                    <TrendingUp className="size-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground">Total Revenue</div>
                    <div className="text-sm font-bold text-foreground">฿148,500</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShoppingBag className="size-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground">Active Orders</div>
                    <div className="text-sm font-bold text-foreground">24 orders</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/5 text-primary">
                    <Store className="size-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground">Store Health</div>
                    <div className="text-sm font-bold text-foreground">99.8% Online</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
