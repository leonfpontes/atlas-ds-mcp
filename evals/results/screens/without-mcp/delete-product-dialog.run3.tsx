import { useState } from "react"
import { Package, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  price: number
  stock: number
  unitsSold: number
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "p-1", name: "Organic Honeycrisp Apples", sku: "FRT-APL-001", price: 4.99, stock: 120, unitsSold: 842 },
  { id: "p-2", name: "Sourdough Loaf, Country Style", sku: "BKR-SDF-014", price: 6.5, stock: 34, unitsSold: 317 },
  { id: "p-3", name: "Free-Range Brown Eggs (12ct)", sku: "DRY-EGG-012", price: 5.25, stock: 58, unitsSold: 605 },
  { id: "p-4", name: "Cold-Pressed Orange Juice, 1L", sku: "BEV-OJ-101", price: 7.99, stock: 0, unitsSold: 189 },
  { id: "p-5", name: "Wildflower Honey, 500g", sku: "PNT-HNY-500", price: 9.75, stock: 22, unitsSold: 96 },
]

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default function ProductCatalogScreen() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  const confirmDelete = () => {
    if (!pendingDelete) return
    const removed = pendingDelete
    setProducts((prev) => prev.filter((p) => p.id !== removed.id))
    setPendingDelete(null)
    toast.success(`"${removed.name}" was removed from the catalog`, {
      description: "Its sales history is still available in reports.",
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Product catalog</h1>
            <p className="text-sm text-muted-foreground">Fernhill Market · {products.length} products</p>
          </div>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Units sold</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No products in the catalog.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="text-right tabular-nums">{currency.format(product.price)}</TableCell>
                <TableCell className="text-right">
                  {product.stock > 0 ? (
                    <span className="tabular-nums">{product.stock}</span>
                  ) : (
                    <Badge variant="secondary">Out of stock</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {product.unitsSold.toLocaleString("en-US")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${product.name}`}
                    onClick={() => setPendingDelete(product)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
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
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{pendingDelete?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the product from the catalog so it can no longer be sold. Its sales history stays in
              your reports: past orders and revenue for {pendingDelete?.name} will not be deleted.
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
  )
}
