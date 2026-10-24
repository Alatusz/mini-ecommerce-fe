import { useState } from "react"
import { mockProducts } from "../mockLandingPage"
import ProductCard from "./ProductCard"

type TabType = "all" | "new" | "bestseller" | "featured"

const tabs: { id: TabType; label: string }[] = [
  { id: "new", label: "New Arrival" },
  { id: "bestseller", label: "Bestseller" },
  { id: "featured", label: "Featured Products" },
]

function ProductSection() {
  const [activeTab, setActiveTab] = useState<TabType>("new")

  const filteredProducts = mockProducts.filter((product) => {
    if (activeTab === "new") return product.isNew
    if (activeTab === "bestseller") return product.isBestSeller
    if (activeTab === "featured") return product.isFeatured
    return true
  })

  const displayProducts =
    filteredProducts.length >= 6 ? filteredProducts : mockProducts

  return (
    <section className="flex flex-col gap-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-6 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-2 text-sm font-semibold ${
              activeTab === tab.id
                ? "text-foreground after:absolute after:bottom-[-9px] after:left-0 after:h-0.5 after:w-full after:bg-foreground"
                : "text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid - 6 Columns on Desktop */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default ProductSection
