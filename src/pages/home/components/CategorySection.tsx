import {
  Smartphone,
  Watch,
  Camera,
  Headphones,
  Laptop,
  Gamepad2,
  Tablet,
  Speaker,
  Cable,
  Glasses,
  type LucideIcon,
} from "lucide-react"

import { mockCategories } from "../mockLandingPage"

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Watch,
  Camera,
  Headphones,
  Laptop,
  Gamepad2,
  Tablet,
  Speaker,
  Cable,
  Glasses,
}

function CategorySection() {
  return (
    <section className="flex flex-col gap-6">
      {/* Header with Title & Arrow Navigation */}
      <div className="flex items-center justify-start">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          Browse By Category
        </h2>
      </div>

      {/* Categories Grid - 10 Columns on Desktop */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
        {mockCategories.map((category) => {
          const IconComponent = iconMap[category.iconName] || Smartphone

          return (
            <button
              key={category.id}
              className="flex flex-col items-center justify-center gap-2.5 rounded-xl border bg-[#ededed]/50 p-4 text-center dark:bg-card"
            >
              <IconComponent className="size-7 stroke-[1.5]" />
              <span className="w-full truncate text-xs font-semibold tracking-tight">
                {category.name}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategorySection
