import {
  Smartphone,
  Cpu,
  Layers,
  Camera,
  BatteryCharging,
  Truck,
  Store,
  ShieldCheck,
  Heart,
  Check,
  ChevronDown,
} from "lucide-react"

import {
  useProductDetail,
  colorOptions,
  storageOptions,
} from "./useHooks"
import { Button } from "@/components/ui/button"

function ProductDetailPage() {
  const {
    selectedColor,
    selectedStorage,
    activeImageIndex,
    isWishlist,
    isMoreDesc,
    isAddedToCart,
    isDetailsExpanded,
    thumbnails,
    currentImage,
    handleSelectColor,
    setSelectedStorage,
    setActiveImageIndex,
    handleToggleWishlist,
    setIsMoreDesc,
    handleAddToCart,
    handleToggleDetails,
  } = useProductDetail()

  return (
    <div className="mx-auto max-w-6xl py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left: Product Gallery (Thumbnails + Large Main Image) */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row items-center gap-4 sm:gap-6 justify-center">
          {/* Vertical Thumbnails */}
          <div className="flex sm:flex-col gap-3 justify-center">
            {thumbnails.map((thumb, index) => {
              const isActive = activeImageIndex === index
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`size-16 sm:size-20 rounded-xl border p-2 flex items-center justify-center bg-[#f9f9f9] dark:bg-zinc-900 transition-colors cursor-pointer ${
                    isActive
                      ? "border-foreground ring-1 ring-foreground/20"
                      : "border-border/60 hover:border-foreground/40"
                  }`}
                  aria-label={`View angle ${index + 1}`}
                >
                  <img
                    src={thumb}
                    alt={`Angle ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              )
            })}
          </div>

          {/* Main Large Image */}
          <div className="flex-1 flex items-center justify-center p-2 min-h-[300px] sm:min-h-[460px]">
            <img
              src={currentImage}
              alt="Apple iPhone 14 Pro Max"
              className="max-h-[340px] sm:max-h-[460px] w-auto object-contain select-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Right: Details & Specifications */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Title & Price */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Apple iPhone 14 Pro Max
            </h1>

            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">
                ${selectedStorage.price}
              </span>
              <span className="text-lg sm:text-xl text-muted-foreground line-through font-normal">
                ${selectedStorage.originalPrice}
              </span>
            </div>
          </div>

          {/* Color Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              Select color :
            </span>
            <div className="flex items-center gap-2">
              {colorOptions.map((color) => {
                const isSelected = selectedColor.id === color.id
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleSelectColor(color)}
                    style={{ backgroundColor: color.hex }}
                    className={`size-6 rounded-full border border-black/10 transition-transform cursor-pointer relative ${
                      isSelected
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                        : "hover:scale-105"
                    }`}
                    title={color.name}
                    aria-label={`Select ${color.name}`}
                  />
                )
              })}
            </div>
          </div>

          {/* Storage Capacity Selector */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {storageOptions.map((storage) => {
              const isSelected = selectedStorage.size === storage.size
              return (
                <button
                  key={storage.size}
                  type="button"
                  onClick={() => setSelectedStorage(storage)}
                  className={`h-10 rounded-lg text-xs sm:text-sm font-medium border transition-colors cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? "border-foreground font-semibold text-foreground bg-accent/40"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  {storage.size}
                </button>
              )
            })}
          </div>

          {/* 6 Specs Cards (3x2 Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {/* 1. Screen size */}
            <div className="flex items-center gap-3 rounded-xl bg-[#f4f4f4] dark:bg-zinc-800/80 p-3">
              <Smartphone className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Screen size</p>
                <p className="text-xs font-semibold text-foreground truncate">6.7&quot;</p>
              </div>
            </div>

            {/* 2. CPU */}
            <div className="flex items-center gap-3 rounded-xl bg-[#f4f4f4] dark:bg-zinc-800/80 p-3">
              <Cpu className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">CPU</p>
                <p className="text-xs font-semibold text-foreground truncate">Apple A16 Bionic</p>
              </div>
            </div>

            {/* 3. Number of Cores */}
            <div className="flex items-center gap-3 rounded-xl bg-[#f4f4f4] dark:bg-zinc-800/80 p-3">
              <Layers className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Number of Cores</p>
                <p className="text-xs font-semibold text-foreground truncate">6</p>
              </div>
            </div>

            {/* 4. Main camera */}
            <div className="flex items-center gap-3 rounded-xl bg-[#f4f4f4] dark:bg-zinc-800/80 p-3">
              <Camera className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Main camera</p>
                <p className="text-xs font-semibold text-foreground truncate">48-12 -12 MP</p>
              </div>
            </div>

            {/* 5. Front-camera */}
            <div className="flex items-center gap-3 rounded-xl bg-[#f4f4f4] dark:bg-zinc-800/80 p-3">
              <Camera className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Front-camera</p>
                <p className="text-xs font-semibold text-foreground truncate">12 MP</p>
              </div>
            </div>

            {/* 6. Battery capacity */}
            <div className="flex items-center gap-3 rounded-xl bg-[#f4f4f4] dark:bg-zinc-800/80 p-3">
              <BatteryCharging className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Battery capacity</p>
                <p className="text-xs font-semibold text-foreground truncate">4323 mAh</p>
              </div>
            </div>
          </div>

          {/* Description Paragraph */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Enhanced capabilities thanks to an enlarged display of 6.7 inches and
            work without recharging throughout the day. Incredible photos as in
            weak, yes and in bright light using the new system with two cameras{" "}
            {isMoreDesc && (
              <span>
                along with Photonic Engine for phenomenal detail and color accuracy,
                and Action mode for smooth, steady, handheld video.
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsMoreDesc(!isMoreDesc)}
              className="font-medium text-foreground underline underline-offset-2 ml-1 cursor-pointer"
            >
              {isMoreDesc ? "less" : "more..."}
            </button>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleToggleWishlist}
              className={`w-full sm:flex-1 h-12 rounded-lg text-xs sm:text-sm font-medium border-foreground/40 hover:bg-accent cursor-pointer transition-colors ${
                isWishlist ? "text-red-500 border-red-500/40" : ""
              }`}
            >
              <Heart
                className={`size-4 mr-2 ${isWishlist ? "fill-red-500" : ""}`}
              />
              {isWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
            </Button>

            <Button
              onClick={handleAddToCart}
              className="w-full sm:flex-1 h-12 rounded-lg text-xs sm:text-sm font-medium bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer transition-colors"
            >
              {isAddedToCart ? (
                <>
                  <Check className="size-4 mr-2" />
                  Added!
                </>
              ) : (
                "Add to Card"
              )}
            </Button>
          </div>

          {/* Value Props Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/50">
            {/* 1. Free Delivery */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
                <Truck className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Free Delivery</p>
                <p className="text-xs font-semibold text-foreground">1-2 day</p>
              </div>
            </div>

            {/* 2. In Stock */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
                <Store className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">In Stock</p>
                <p className="text-xs font-semibold text-foreground">Today</p>
              </div>
            </div>

            {/* 3. Guaranteed */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Guaranteed</p>
                <p className="text-xs font-semibold text-foreground">1 year</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Specifications Section matching Attachment */}
      <section className="mt-10 sm:mt-14 rounded-2xl bg-card border border-border/40 p-6 sm:p-10 lg:p-12 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Details
        </h2>

        <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Just as a book is judged by its cover, the first thing you notice when
          you pick up a modern smartphone is the display. Nothing surprising,
          because advanced technologies allow you to practically level the
          display frames and cutouts for the front camera and speaker, leaving
          no room for bold design solutions. And how good that in such realities
          Apple everything is fine with displays. Both critics and mass
          consumers always praise the quality of the picture provided by the
          products of the Californian brand. And last year&apos;s 6.7-inch Retina
          panels, which had ProMotion, caused real admiration for many.
        </p>

        {/* 1. Screen Specifications */}
        <div className="mt-8">
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Screen
          </h3>

          <div className="mt-3 divide-y divide-border/40 text-xs sm:text-sm">
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Screen diagonal</span>
              <span className="font-normal text-foreground">6.7&quot;</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">The screen resolution</span>
              <span className="font-normal text-foreground">2796x1290</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">The screen refresh rate</span>
              <span className="font-normal text-foreground">120 Hz</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">The pixel density</span>
              <span className="font-normal text-foreground">460 ppi</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Screen type</span>
              <span className="font-normal text-foreground">OLED</span>
            </div>

            <div className="flex items-start justify-between py-3">
              <span className="text-muted-foreground">Additionally</span>
              <div className="flex flex-col items-end gap-1 text-right text-foreground font-normal">
                <span>Dynamic Island</span>
                <span>Always-On display</span>
                <span>HDR display</span>
                <span>True Tone</span>
                <span>Wide color (P3)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CPU Specifications */}
        <div className="mt-8">
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            CPU
          </h3>

          <div className="mt-3 divide-y divide-border/40 text-xs sm:text-sm">
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">CPU</span>
              <span className="font-normal text-foreground">A16 Bionic</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Number of cores</span>
              <span className="font-normal text-foreground">6</span>
            </div>
          </div>
        </div>

        {/* Expanded Additional Specifications (When View More is toggled) */}
        {isDetailsExpanded && (
          <>
            {/* 3. Main Camera */}
            <div className="mt-8">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Main camera
              </h3>

              <div className="mt-3 divide-y divide-border/40 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Resolution</span>
                  <span className="font-normal text-foreground">48 MP + 12 MP + 12 MP</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Aperture</span>
                  <span className="font-normal text-foreground">ƒ/1.78, ƒ/2.2, ƒ/2.8</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Optical zoom</span>
                  <span className="font-normal text-foreground">3x in, 2x out, 6x optical zoom range</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Video recording</span>
                  <span className="font-normal text-foreground">4K video recording at 24/25/30/60 fps</span>
                </div>
              </div>
            </div>

            {/* 4. Battery & Power */}
            <div className="mt-8">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Battery & Power
              </h3>

              <div className="mt-3 divide-y divide-border/40 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Battery capacity</span>
                  <span className="font-normal text-foreground">4323 mAh</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Charging</span>
                  <span className="font-normal text-foreground">Fast charging up to 50% in 30 minutes</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Wireless charging</span>
                  <span className="font-normal text-foreground">MagSafe up to 15W, Qi up to 7.5W</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* View More / View Less Button */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={handleToggleDetails}
            className="h-10 px-6 rounded-lg text-xs sm:text-sm font-medium gap-1.5 cursor-pointer border-border hover:bg-accent hover:text-foreground"
          >
            {isDetailsExpanded ? "View Less" : "View More"}
            <ChevronDown
              className={`size-4 transition-transform duration-200 ${
                isDetailsExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </section>
    </div>
  )
}

export default ProductDetailPage
