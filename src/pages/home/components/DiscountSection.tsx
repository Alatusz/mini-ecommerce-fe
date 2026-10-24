import { mockDiscountProducts } from "../mockLandingPage"
import ProductCard from "./ProductCard"

function DiscountSection() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          Discounts up to -50%
        </h2>
      </div>

      {/* Product Grid - 6 Columns on Desktop */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {mockDiscountProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default DiscountSection
