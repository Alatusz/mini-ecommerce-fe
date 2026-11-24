import { useMemo } from "react"
import {
  useStorefrontProductsQuery,
  mapProductToCard,
} from "../useHubs"
import ProductCard from "./ProductCard"
import { Skeleton } from "@/components/ui/skeleton"

function DiscountSection() {
  const { data, isLoading } = useStorefrontProductsQuery({ limit: 12 })

  const discountProducts = useMemo(() => {
    return (data?.data ?? []).map(mapProductToCard).slice(0, 6)
  }, [data])

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          Discounts up to -50%
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {discountProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

export default DiscountSection
