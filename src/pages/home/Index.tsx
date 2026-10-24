import HeroSection from "./components/HeroSection"
import CategorySection from "./components/CategorySection"
import ProductSection from "./components/ProductSection"
import ShowcaseSection from "./components/ShowcaseSection"
import DiscountSection from "./components/DiscountSection"
import PromoBanner from "./components/PromoBanner"

function HomePage() {
  return (
    <div className="flex flex-col gap-14 py-2">
      {/* 1. Hero Banner + Bento Grid Showcase */}
      <HeroSection />

      {/* 2. Browse By Category (Grid-10) */}
      <CategorySection />

      {/* 3. Products Section with Tabs (Grid-6) */}
      <ProductSection />

      {/* 4. Middle 4-Card Showcase */}
      <ShowcaseSection />

      {/* 5. Discounts up to -50% (Grid-6) */}
      <DiscountSection />

      {/* 6. Big Summer Sale Banner */}
      <PromoBanner />
    </div>
  )
}

export default HomePage
