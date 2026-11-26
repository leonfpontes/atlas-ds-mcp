import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

type Product = {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  sales30d: number
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "p-101", name: "Oat milk, 1 L", sku: "FM-1001", price: 2.49, stock: 84, sales30d: 212 },
  { id: "p-102", name: "Sourdough loaf", sku: "FM-1002", price: 4.5, stock: 26, sales30d: 139 },
  { id: "p-103", name: "Wildflower honey, 340 g", sku: "FM-1003", price: 6.2, stock: 41, sales30d: 58 },
  { id: "p-104", name: "Cold brew concentrate", sku: "FM-1004", price: 9.9, stock: 12, sales30d: 17 },
  { id: "p-105", name: "Heirloom tomatoes, 500 g", sku: "FM-1005", price: 3.75, stock: 0, sales30d: 0 },
]

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  function handleConfirmDelete() {
    if (!pendingDelete) return
    const deleted = pendingDelete
    setProducts((current) => current.filter((p) => p.id !== deleted.id))
    setPendingDelete(null)
    toast.success(`Deleted ${deleted.name}`)
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Product catalog</h1>
        <p className="text-sm text-muted-foreground">Fernhill Market products available in the store.</p>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Sales, 30 days</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium text-foreground">{product.name}</TableCell>
              <TableCell className="text-muted-foreground">{product.sku}</TableCell>
              <TableCell className="text-right">{currency.format(product.price)}</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell className="text-right">{product.sales30d}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${product.name}`}
                  onClick={() => setPendingDelete(product)}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No products in the catalog.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {pendingDelete?.name}?</DialogTitle>
            <DialogDescription>
              This removes the product from the catalog. Its sales history stays in your reports.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Keep product
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </main>
  )
}
