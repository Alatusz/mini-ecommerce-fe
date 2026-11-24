import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export interface TopProduct {
  id: string
  name: string
  image?: string
  unitsSold: number
  revenue: number
}

interface TopProductsCardProps {
  data?: TopProduct[]
}

export function TopProductsCard({ data = [] }: TopProductsCardProps) {
  return (
    <Card className="col-span-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Top Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data?.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.unitsSold} sold
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              ${product.revenue.toLocaleString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
