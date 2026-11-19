import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export interface CategoryDataPoint {
  id: string
  label: string
  total: number
}

interface CategoryRankedBarProps {
  data?: CategoryDataPoint[]
}

export function CategoryRankedBar({ data = [] }: CategoryRankedBarProps) {
  const total = data.reduce((sum, item) => sum + item.total, 0)

  return (
    <Card className="col-span-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Sales by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {data?.slice(0, 5).map((item) => {
          const percent = total > 0 ? Math.round((item.total / total) * 100) : 0

          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  ${item.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
