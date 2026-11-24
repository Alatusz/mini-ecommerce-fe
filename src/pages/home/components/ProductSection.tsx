import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import {
  useStorefrontProductsQuery,
  mapProductToCard,
} from "../useHubs"
import ProductCard from "./ProductCard"
import { Skeleton } from "@/components/ui/skeleton"

type TabType = "all" | "new" | "discount"

const tabs: { id: TabType; label: string }[] = [
  { id: "all", label: "All Products" },
  { id: "new", label: "New Arrival" },
  { id: "discount", label: "On Sale" },
]

function ProductSection() {
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const { data, isLoading } = useStorefrontProductsQuery({ limit: 12 })

  const displayProducts = useMemo(() => {
    const raw = data?.data ?? []
    const mapped = raw.map(mapProductToCard)

    if (activeTab === "discount") {
      return mapped.slice(0, 6)
    }
    if (activeTab === "new") {
      return mapped.slice(0, 6)
    }
    return mapped.slice(0, 12)
  }, [data, activeTab])

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative cursor-pointer pb-2 text-sm font-semibold ${
                activeTab === tab.id
                  ? "text-foreground after:absolute after:bottom-[-9px] after:left-0 after:h-0.5 after:w-full after:bg-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          to="/products"
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <span>View all</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed py-10 text-center text-xs text-muted-foreground">
          No products available
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductSection
