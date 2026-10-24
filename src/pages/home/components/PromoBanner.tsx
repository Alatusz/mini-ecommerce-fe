import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-black text-white">
      {/* Background Cinematic Banner Image */}
      <div className="relative min-h-[360px] w-full overflow-hidden sm:min-h-[420px]">
        <img
          src="/images/hero-summer-sale.jpg"
          alt="Big Summer Sale Banner"
          className="size-full object-cover opacity-60"
        />

        {/* Center Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
            Big Summer <span className="font-bold text-white">Sale</span>
          </h2>
          <p className="mt-3 max-w-lg text-xs text-zinc-300 sm:text-sm md:text-base">
            Commercially designed for extreme productivity and entertainment
          </p>

          <Link to="/products?sale=true" className="mt-6">
            <Button
              variant="outline"
              className="rounded-md border-white/80 bg-transparent px-8 py-5 text-sm font-semibold text-white"
            >
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PromoBanner
