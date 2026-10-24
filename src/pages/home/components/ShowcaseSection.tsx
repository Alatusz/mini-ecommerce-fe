import { Link } from "react-router-dom"
import { mockShowcaseCards } from "../mockLandingPage"
import { Button } from "@/components/ui/button"

function ShowcaseSection() {
  return (
    <section className="py-2">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {mockShowcaseCards.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col justify-between overflow-hidden rounded-2xl border p-6 ${
              item.bgColor || "bg-white dark:bg-card"
            }`}
          >
            {/* Product Image */}
            <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl">
              <img
                src={item.image}
                alt={item.title}
                className="max-h-44 w-auto object-contain"
              />
            </div>

            {/* Information & Action */}
            <div className="flex flex-col items-start gap-2">
              <span className="text-[0.6875rem] font-semibold tracking-wider text-muted-foreground uppercase">
                {item.subtitle}
              </span>
              <h3 className="text-xl font-bold tracking-tight">
                {item.title}
              </h3>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <Link to={item.link} className="mt-3 w-full">
                <Button
                  variant="outline"
                  className={`w-full rounded-lg text-xs font-semibold ${
                    item.textColor === "text-white"
                      ? "border-white/60 bg-transparent text-white"
                      : "border-foreground/40 bg-transparent text-foreground"
                  }`}
                >
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ShowcaseSection
