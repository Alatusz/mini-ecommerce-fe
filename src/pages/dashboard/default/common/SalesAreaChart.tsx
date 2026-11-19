import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export interface SalesDataPoint {
  date: string
  total: number
}

interface SalesAreaChartProps {
  data?: SalesDataPoint[]
  config?: ChartConfig
}

const DEFAULT_CHART_CONFIG: ChartConfig = {
  total: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
}

function formatShortDate(value: string): string {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function SalesAreaChart({
  data = [],
  config = DEFAULT_CHART_CONFIG,
}: SalesAreaChartProps) {
  const mergedConfig: ChartConfig = {
    ...DEFAULT_CHART_CONFIG,
    ...config,
    total: config?.total ?? config?.revenue ?? DEFAULT_CHART_CONFIG.total,
  }

  return (
    <Card className="col-span-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Revenue & Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={mergedConfig} className="h-[260px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={formatShortDate}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatShortDate(String(value))}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--color-total)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fillTotal)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
