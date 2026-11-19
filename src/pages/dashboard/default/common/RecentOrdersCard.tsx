import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

export interface OrderItem {
  id: string
  userId: string
  totalAmount: number
  status: "completed" | "processing" | "pending" | "cancelled"
  paymentMethod: string
  paymentStatus: ""
  shippingAddress: string
  shippingPhone: string
}

interface RecentOrdersCardProps {
  data?: OrderItem[]
}

export function RecentOrdersCard({ data = [] }: RecentOrdersCardProps) {
  return (
    <Card className="col-span-8">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
        <Link
          to="/dashboard/orders"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium tabular-nums">
                  {order.id}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] font-medium">
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {order.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
