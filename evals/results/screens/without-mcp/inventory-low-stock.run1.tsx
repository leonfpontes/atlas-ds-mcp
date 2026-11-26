import { useMemo, useState } from "react";
import { AlertTriangle, Package } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  onHand: number;
  reorderPoint: number;
};

const ALL_CATEGORIES = "all";

const PRODUCTS: Product[] = [
  { id: "p-1001", sku: "PRD-1001", name: "Organic Whole Milk 1L", category: "Dairy", unit: "bottle", onHand: 42, reorderPoint: 24 },
  { id: "p-1002", sku: "PRD-1002", name: "Free-Range Eggs (12 pk)", category: "Dairy", unit: "carton", onHand: 9, reorderPoint: 15 },
  { id: "p-1003", sku: "PRD-1003", name: "Greek Yogurt 500g", category: "Dairy", unit: "tub", onHand: 30, reorderPoint: 12 },
  { id: "p-2001", sku: "PRD-2001", name: "Sourdough Loaf", category: "Bakery", unit: "loaf", onHand: 6, reorderPoint: 10 },
  { id: "p-2002", sku: "PRD-2002", name: "Croissant (6 pk)", category: "Bakery", unit: "pack", onHand: 18, reorderPoint: 8 },
  { id: "p-3001", sku: "PRD-3001", name: "Baby Spinach 200g", category: "Produce", unit: "bag", onHand: 4, reorderPoint: 10 },
  { id: "p-3002", sku: "PRD-3002", name: "Hass Avocados", category: "Produce", unit: "each", onHand: 56, reorderPoint: 20 },
  { id: "p-3003", sku: "PRD-3003", name: "Cherry Tomatoes 250g", category: "Produce", unit: "punnet", onHand: 14, reorderPoint: 12 },
  { id: "p-4001", sku: "PRD-4001", name: "Extra Virgin Olive Oil 750ml", category: "Pantry", unit: "bottle", onHand: 22, reorderPoint: 6 },
  { id: "p-4002", sku: "PRD-4002", name: "Basmati Rice 2kg", category: "Pantry", unit: "bag", onHand: 3, reorderPoint: 8 },
  { id: "p-4003", sku: "PRD-4003", name: "Rolled Oats 1kg", category: "Pantry", unit: "bag", onHand: 19, reorderPoint: 10 },
  { id: "p-5001", sku: "PRD-5001", name: "Dish Soap 500ml", category: "Household", unit: "bottle", onHand: 11, reorderPoint: 10 },
  { id: "p-5002", sku: "PRD-5002", name: "Recycled Paper Towels (6 pk)", category: "Household", unit: "pack", onHand: 27, reorderPoint: 9 },
];

const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort();

function stockPercent(product: Product) {
  const target = product.reorderPoint * 3;
  return Math.min(100, Math.round((product.onHand / target) * 100));
}

export default function InventoryScreen() {
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);

  const visibleProducts = useMemo(
    () =>
      category === ALL_CATEGORIES
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === category),
    [category],
  );

  const lowStockCount = useMemo(
    () => PRODUCTS.filter((p) => p.onHand <= p.reorderPoint).length,
    [],
  );

  const handleReorder = (product: Product) => {
    toast.success(`Reorder request drafted for ${product.name}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Fernhill Market stock levels across all categories.
        </p>
      </header>

      {lowStockCount > 0 && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          <span>
            {lowStockCount} {lowStockCount === 1 ? "item is" : "items are"} at or
            below the reorder point.
          </span>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2">
              <Package className="size-4" aria-hidden="true" />
              Products
            </CardTitle>
            <CardDescription>
              Showing {visibleProducts.length} of {PRODUCTS.length} products
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Category</span>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48" aria-label="Filter by category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-64">Stock level</TableHead>
                <TableHead className="text-right">On hand</TableHead>
                <TableHead className="text-right">Reorder point</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No products in this category.
                  </TableCell>
                </TableRow>
              )}
              {visibleProducts.map((product) => {
                const isLow = product.onHand <= product.reorderPoint;
                const percent = stockPercent(product);
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {product.sku}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div
                          className="h-2 w-full overflow-hidden rounded-full bg-muted"
                          role="progressbar"
                          aria-label={`Stock level for ${product.name}`}
                          aria-valuenow={percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className={
                              isLow
                                ? "h-full rounded-full bg-destructive"
                                : "h-full rounded-full bg-primary"
                            }
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        {isLow && (
                          <Badge variant="destructive" className="w-fit gap-1">
                            <AlertTriangle className="size-3" aria-hidden="true" />
                            Below reorder point
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <span className={isLow ? "font-semibold text-destructive" : ""}>
                        {product.onHand}
                      </span>{" "}
                      <span className="text-xs text-muted-foreground">{product.unit}</span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {product.reorderPoint}
                    </TableCell>
                    <TableCell className="text-right">
                      {isLow ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReorder(product)}
                        >
                          Reorder
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">In stock</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
