import { useState } from "react";
import { Package, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  name: string;
  sku: string;
  price: number;
  stock: number;
  unitsSold: number;
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p-1001",
    name: "Sourdough Loaf",
    sku: "BKR-SD-001",
    price: 6.5,
    stock: 24,
    unitsSold: 412,
  },
  {
    id: "p-1002",
    name: "Wildflower Honey 500g",
    sku: "PNT-HNY-500",
    price: 9.25,
    stock: 3,
    unitsSold: 187,
  },
  {
    id: "p-1003",
    name: "Oat Milk 1L",
    sku: "DRY-OAT-1L",
    price: 2.8,
    stock: 0,
    unitsSold: 640,
  },
  {
    id: "p-1004",
    name: "Heirloom Tomatoes (1kg)",
    sku: "PRD-TOM-HR",
    price: 4.9,
    stock: 15,
    unitsSold: 98,
  },
  {
    id: "p-1005",
    name: "Cold-Pressed Olive Oil 750ml",
    sku: "PNT-OLV-750",
    price: 14.0,
    stock: 8,
    unitsSold: 75,
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function ProductCatalogScreen() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const removed = pendingDelete;
    setProducts((current) => current.filter((p) => p.id !== removed.id));
    setPendingDelete(null);
    toast.success(`${removed.name} was removed from the catalog`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="size-6 text-muted-foreground" aria-hidden />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Product catalog
            </h1>
            <p className="text-sm text-muted-foreground">
              Fernhill Market · {products.length} products
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Units sold</TableHead>
              <TableHead className="w-[1%] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No products in the catalog.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {product.sku}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {currency.format(product.price)}
                </TableCell>
                <TableCell className="text-right">
                  {product.stock === 0 ? (
                    <Badge variant="destructive">Out of stock</Badge>
                  ) : (
                    <span className="tabular-nums">{product.stock}</span>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {product.unitsSold.toLocaleString("en-US")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${product.name}`}
                    onClick={() => setPendingDelete(product)}
                  >
                    <Trash2 className="size-4 text-destructive" aria-hidden />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {pendingDelete?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes {pendingDelete?.name} from the product catalog. Its
              sales history stays in your reports and is not deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
