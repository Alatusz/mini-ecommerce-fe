import { Link } from "react-router-dom"
import { ArrowLeft, Loader2, PackageX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProductDetail } from "./useHooks"
import { ProductGallery } from "./common/ProductGallery"
import { ProductInfo } from "./common/ProductInfo"
import { ProductReviews } from "./common/ProductReviews"

function ProductDetailPage() {
  const {
    product,
    isLoading,
    isNotFound,
    category,
    thumbnails,
    activeImageIndex,
    setActiveImageIndex,
    currentImage,
    currentPrice,
    originalPrice,
    discountPercent,
    quantity,
    maxStock,
    isOutOfStock,
    isWishlist,
    isAddedToCart,
    isAddingToCart,
    handleDecrement,
    handleIncrement,
    handleAddToCart,
    handleToggleWishlist,
  } = useProductDetail()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm font-medium">Loading product...</p>
      </div>
    )
  }

  if (isNotFound || !product) {
    return (
      <div className="mx-auto max-w-md py-24 text-center space-y-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border bg-muted/40 text-muted-foreground">
          <PackageX className="size-6" />
        </div>
        <h1 className="text-xl font-semibold">Product not found</h1>
        <p className="text-sm text-muted-foreground">
          This product may have been removed or is no longer available.
        </p>
        <Link to="/products" className="inline-block">
          <Button variant="outline" className="gap-2 cursor-pointer">
            <ArrowLeft className="size-4" />
            <span>Back to Products</span>
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl py-4 sm:py-8 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <ProductGallery
          productName={product.name}
          thumbnails={thumbnails}
          activeImageIndex={activeImageIndex}
          currentImage={currentImage}
          onSelectImage={setActiveImageIndex}
        />

        <ProductInfo
          product={product}
          category={category}
          currentPrice={currentPrice}
          originalPrice={originalPrice}
          discountPercent={discountPercent}
          quantity={quantity}
          maxStock={maxStock}
          isOutOfStock={isOutOfStock}
          isWishlist={isWishlist}
          isAddedToCart={isAddedToCart}
          isAddingToCart={isAddingToCart}
          onDecrement={handleDecrement}
          onIncrement={handleIncrement}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
      </div>

      <ProductReviews
        ratingAvg={product.ratingAvg}
        ratingCount={product.ratingCount}
        ratingBreakdown={product.ratingBreakdown}
        reviews={product.reviews}
      />
    </div>
  )
}

export default ProductDetailPage
