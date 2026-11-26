interface ProductGalleryProps {
  productName: string
  thumbnails: string[]
  activeImageIndex: number
  currentImage: string
  onSelectImage: (index: number) => void
}

export function ProductGallery({
  productName,
  thumbnails,
  activeImageIndex,
  currentImage,
  onSelectImage,
}: ProductGalleryProps) {
  return (
    <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
      {thumbnails.length > 1 && (
        <div className="flex sm:flex-col gap-3 justify-center sm:justify-start">
          {thumbnails.map((thumb, index) => {
            const isActive = activeImageIndex === index
            return (
              <button
                key={index}
                type="button"
                onClick={() => onSelectImage(index)}
                className={`size-16 sm:size-20 overflow-hidden rounded-xl border bg-muted/30 cursor-pointer ${
                  isActive
                    ? "border-foreground ring-1 ring-foreground/20"
                    : "border-border/60"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={thumb}
                  alt={`${productName} ${index + 1}`}
                  className="size-full object-cover"
                />
              </button>
            )
          })}
        </div>
      )}

      <div className="w-full flex-1 overflow-hidden rounded-2xl border border-border/60 bg-muted/20 aspect-square">
        <img
          src={currentImage}
          alt={productName}
          className="size-full object-cover select-none"
        />
      </div>
    </div>
  )
}
