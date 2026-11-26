import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

type Product = {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "p-1001", name: "Ashgrove Wildflower Honey 340 g", sku: "FH-HNY-340", category: "Pantry", price: 6.5, stock: 42 },
  { id: "p-1002", name: "Cold-Pressed Rapeseed Oil 500 ml", sku: "FH-OIL-500", category: "Pantry", price: 9.25, stock: 18 },
  { id: "p-1003", name: "Stoneground Oat Flour 1 kg", sku: "FH-FLR-1K", category: "Baking", price: 3.8, stock: 65 },
  { id: "p-1004", name: "Sourdough Rye Loaf", sku: "FH-BRD-RYE", category: "Bakery", price: 5.4, stock: 9 },
  { id: "p-1005", name: "Fernhill Sparkling Elderflower 750 ml", sku: "FH-DRK-750", category: "Drinks", price: 4.6, stock: 0 },
]

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value)

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  const confirmDelete = () => {
    if (!pendingDelete) return
    const removed = pendingDelete
    setProducts((current) => current.filter((p) => p.id !== removed.id))
    setPendingDelete(null)
    toast.success(`${removed.name} deleted`)
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Product catalog</h1>
        <p className="text-sm text-muted-foreground">Fernhill Market</p>
      </header>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${product.name}`}
                    onClick={() => setPendingDelete(product)}
                  >
                    <Trash2 className="text-destructive" />
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
      </div>

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
              This removes the product from the catalog. Its sales history stays in your reports
              and past orders. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep product</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </main>
  )
}
