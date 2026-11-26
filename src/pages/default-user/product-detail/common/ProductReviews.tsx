import { MessageSquare, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { type ProductReviewItem } from "@/services/product.services"

interface ProductReviewsProps {
  ratingAvg?: number
  ratingCount?: number
  ratingBreakdown?: Record<number, number>
  reviews?: ProductReviewItem[]
}

export function ProductReviews({
  ratingAvg = 0,
  ratingCount,
  ratingBreakdown,
  reviews,
}: ProductReviewsProps) {
  const totalRatings = ratingCount ?? reviews?.length ?? 0

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count =
      ratingBreakdown?.[star] ??
      reviews?.filter((r) => r.rating === star).length ??
      0
    const percent =
      totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0
    return { star, count, percent }
  })

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Col 1: Rating Summary & 5-Level Breakdown */}
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Overall Rating
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-foreground tabular-nums">
                    {ratingAvg.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= Math.round(ratingAvg)
                    return (
                      <Star
                        key={star}
                        className={`size-4 ${
                          filled
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on{" "}
                  <span className="font-semibold text-foreground tabular-nums">
                    {totalRatings}
                  </span>{" "}
                  {totalRatings === 1 ? "verified rating" : "verified ratings"}
                </p>
              </div>

              <div className="flex-1 space-y-2 sm:max-w-xs">
                {ratingCounts.map(({ star, count, percent }) => (
                  <div key={star} className="flex items-center gap-2.5 text-xs">
                    <span className="flex w-7 shrink-0 items-center justify-end gap-0.5 font-medium text-foreground tabular-nums">
                      {star}
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-7 shrink-0 text-right text-muted-foreground tabular-nums">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Col 2: Review List / Empty State */}
        {(reviews?.length ?? 0) > 0 ? (
          <Card className="border-border/60 shadow-2xs">
            <CardContent className="max-h-72 space-y-4 overflow-y-auto p-6">
              {reviews!.map((rev) => (
                <div
                  key={rev.id}
                  className="space-y-1.5 border-b border-border/40 pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {rev.reviewerName}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`size-3.5 ${
                            s <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {rev.review && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {rev.review}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/60 shadow-2xs">
            <CardContent className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
              <MessageSquare className="size-5" />
              <span className="text-sm font-medium">
                ยังไม่มีรีวิวสำหรับสินค้านี้
              </span>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
