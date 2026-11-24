import { useNavigate } from "react-router-dom"
import { LayoutGrid } from "lucide-react"
import { useStorefrontCategoriesQuery } from "../useHubs"
import { Skeleton } from "@/components/ui/skeleton"

function CategorySection() {
  const navigate = useNavigate()
  const { data, isLoading } = useStorefrontCategoriesQuery(10)
  const categories = data?.data ?? []

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          Browse By Category
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-dashed py-8 text-center text-xs text-muted-foreground">
          No categories available
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => navigate(`/products?category=${category.id}`)}
              className="flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border bg-[#ededed]/50 p-4 text-center transition-colors hover:border-foreground/30 hover:bg-muted dark:bg-card"
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="size-8 rounded-md object-cover"
                />
              ) : (
                <LayoutGrid className="size-7 stroke-[1.5]" />
              )}
              <span className="w-full truncate text-xs font-semibold tracking-tight">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default CategorySection
