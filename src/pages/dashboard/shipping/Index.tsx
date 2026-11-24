import { Pencil, Plus, Truck } from "lucide-react"
import { PageContent } from "@/components/common/PageContent"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useShippingRates } from "./useHooks"

const formatTHB = (amount: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 2,
  }).format(amount)

export default function DashboardShippingPage() {
  const {
    shippingRates,
    isLoading,
    isError,
    refetch,
    togglingId,
    handleCreate,
    handleEdit,
    handleToggleActive,
  } = useShippingRates()

  return (
    <PageContent>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipping Rates</h1>
          <p className="text-sm text-muted-foreground">
            Manage delivery methods, shipping fees, and free-shipping thresholds.
          </p>
        </div>
        <Button onClick={handleCreate} className="cursor-pointer gap-1.5">
          <Plus className="h-4 w-4" />
          Add Shipping Rate
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading shipping rates...
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <p className="text-sm text-destructive">
                Failed to load shipping rates.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="cursor-pointer"
              >
                Retry
              </Button>
            </div>
          ) : shippingRates.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-10 text-center">
              <Truck className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No shipping rates configured</p>
              <p className="text-sm text-muted-foreground">
                Add your first shipping method so customers can choose delivery at
                checkout.
              </p>
              <Button
                onClick={handleCreate}
                size="sm"
                className="mt-2 cursor-pointer gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Shipping Rate
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Method Name</TableHead>
                  <TableHead>Shipping Fee</TableHead>
                  <TableHead>Free Min Spend</TableHead>
                  <TableHead>Delivery SLA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingRates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {rate.sortOrder}
                    </TableCell>
                    <TableCell className="font-medium">{rate.name}</TableCell>
                    <TableCell>
                      {Number(rate.price) === 0 ? (
                        <Badge variant="secondary">Free</Badge>
                      ) : (
                        formatTHB(Number(rate.price))
                      )}
                    </TableCell>
                    <TableCell>
                      {rate.freeMinSpend !== null &&
                      rate.freeMinSpend !== undefined ? (
                        formatTHB(Number(rate.freeMinSpend))
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {rate.minDays === rate.maxDays
                        ? `${rate.minDays} days`
                        : `${rate.minDays}–${rate.maxDays} days`}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rate.isActive}
                          disabled={togglingId === rate.id}
                          onCheckedChange={(checked) =>
                            handleToggleActive(rate, checked)
                          }
                        />
                        <Badge
                          variant={rate.isActive ? "default" : "secondary"}
                        >
                          {rate.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(rate)}
                        className="cursor-pointer gap-1.5"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageContent>
  )
}
