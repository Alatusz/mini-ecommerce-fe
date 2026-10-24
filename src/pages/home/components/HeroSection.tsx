import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

function HeroSection() {
  return (
    <section className="flex flex-col gap-6">
      {/* Top Banner (iPhone 14 Pro Flagship) */}
      <div className="overflow-hidden rounded-2xl bg-[#211C24] text-white">
        <div className="grid grid-cols-1 items-center gap-8 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-12 lg:gap-12">
          {/* Left Text */}
          <div className="flex flex-col items-start gap-4 text-left lg:col-span-6 xl:col-span-7">
            <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase sm:text-sm">
              Pro.Beyond.
            </span>
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-6xl xl:text-7xl">
              IPhone 14 <span className="font-bold text-white">Pro</span>
            </h1>
            <p className="max-w-md text-sm text-zinc-400 sm:text-base">
              Created to change everything for the better. For everyone
            </p>
            <Link to="/products?category=phones">
              <Button
                variant="outline"
                className="mt-2 rounded-md border-white/80 bg-transparent px-8 py-5 text-sm font-medium text-white"
              >
                Shop Now
              </Button>
            </Link>
          </div>

          {/* Right Hero Image (Isolated Object with Transparent Background) */}
          <div className="flex justify-center lg:col-span-6 lg:justify-end xl:col-span-5">
            <div className="max-w-sm sm:max-w-md">
              <img
                src="/images/hero-iphone.png"
                alt="iPhone 14 Pro"
                className="size-full max-h-96 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Showcase */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (PS5 + AirPods + Vision Pro) */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Top Wide: Playstation 5 */}
          <div className="flex flex-col items-center justify-between overflow-hidden rounded-2xl border bg-white p-6 sm:flex-row dark:bg-card">
            <div className="flex w-full justify-center sm:w-1/2">
              <img
                src="/images/hero-ps5.png"
                alt="Playstation 5"
                className="h-44 w-auto object-contain"
              />
            </div>
            <div className="mt-4 flex w-full flex-col items-start gap-2 sm:mt-0 sm:w-1/2">
              <h3 className="text-2xl font-bold tracking-tight">Playstation 5</h3>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Incredibly powerful CPUs, GPUs, and an SSD with Integrated I/O will redefine your PlayStation experience.
              </p>
              <Link to="/products?category=gaming" className="mt-2 text-xs font-semibold underline underline-offset-4">
                Explore PS5 &rarr;
              </Link>
            </div>
          </div>

          {/* Bottom Row: AirPods Max & Apple Vision Pro */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* AirPods Max */}
            <div className="flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#ededed] p-6 dark:bg-zinc-900">
              <div className="flex h-40 items-center justify-center">
                <img
                  src="/images/hero-airpods.png"
                  alt="Apple AirPods Max"
                  className="max-h-36 w-auto object-contain"
                />
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                <h4 className="text-lg font-bold">Apple AirPods Max</h4>
                <p className="text-xs text-muted-foreground">
                  Computational audio. Listen, it&apos;s powerful
                </p>
              </div>
            </div>

            {/* Apple Vision Pro */}
            <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-[#353535] p-6 text-white dark:bg-zinc-950">
              <div className="flex h-40 items-center justify-center">
                <img
                  src="/images/hero-vision-pro.png"
                  alt="Apple Vision Pro"
                  className="max-h-36 w-auto object-contain"
                />
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                <h4 className="text-lg font-bold text-white">Apple Vision Pro</h4>
                <p className="text-xs text-zinc-400">
                  An immersive way to experience entertainment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: MacBook Air (Tall Card) */}
        <div className="flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#ededed] p-8 lg:col-span-5 dark:bg-zinc-900">
          <div className="flex flex-col items-start gap-3">
            <h3 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              Macbook <span className="font-bold">Air</span>
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              The new 15-inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.
            </p>
            <Link to="/products?category=computers" className="mt-2">
              <Button
                variant="outline"
                className="rounded-md border-foreground/60 bg-transparent px-6 py-2.5 text-xs font-semibold text-foreground"
              >
                Shop Now
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <img
              src="/images/hero-macbook.png"
              alt="MacBook Air"
              className="max-h-56 w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
