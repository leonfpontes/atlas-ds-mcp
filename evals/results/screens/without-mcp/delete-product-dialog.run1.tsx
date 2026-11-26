import { useState } from "react"
import { Package, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Product = {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  salesCount: number
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p-1001",
    name: "Heirloom Tomato Seeds",
    sku: "FM-SD-0101",
    category: "Seeds",
    price: 4.5,
    stock: 128,
    salesCount: 342,
  },
  {
    id: "p-1002",
    name: "Cast Iron Skillet, 10in",
    sku: "FM-KT-0220",
    category: "Kitchen",
    price: 34.0,
    stock: 17,
    salesCount: 89,
  },
  {
    id: "p-1003",
    name: "Beeswax Candle Set",
    sku: "FM-HM-0315",
    category: "Home",
    price: 22.75,
    stock: 0,
    salesCount: 214,
  },
  {
    id: "p-1004",
    name: "Stoneware Mixing Bowl",
    sku: "FM-KT-0231",
    category: "Kitchen",
    price: 18.25,
    stock: 42,
    salesCount: 57,
  },
  {
    id: "p-1005",
    name: "Wildflower Honey, 12oz",
    sku: "FM-PT-0410",
    category: "Pantry",
    price: 9.99,
    stock: 63,
    salesCount: 468,
  },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default function CatalogProductsScreen() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  function confirmDelete() {
    if (!pendingDelete) return
    const removed = pendingDelete
    setProducts((current) => current.filter((p) => p.id !== removed.id))
    setPendingDelete(null)
    toast.success(`${removed.name} was removed from the catalog`, {
      description: "Its sales history is still available in reports.",
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market products available for sale.
          </p>
        </div>
        <Badge variant="secondary">{products.length} products</Badge>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-12 text-center">
          <Package className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No products in the catalog.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="w-[1%]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {currency.format(product.price)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.stock === 0 ? (
                      <Badge variant="outline">Out of stock</Badge>
                    ) : (
                      product.stock
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => setPendingDelete(product)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {pendingDelete?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes the product from your catalog so it can no longer be
              sold. Its past sales stay in your sales history and reports
              {pendingDelete
                ? `, including ${pendingDelete.salesCount} recorded sales`
                : ""}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={confirmDelete}
            >
              <Trash2 className="size-4" />
              Delete product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
