import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

type Product = {
  id: string
  name: string
  sku: string
  price: number
  stock: number
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "p-1001", name: "Wild Thyme Honey, 340 g", sku: "FH-HNY-001", price: 9.5, stock: 42 },
  { id: "p-1002", name: "Cold-Pressed Rapeseed Oil, 500 ml", sku: "FH-OIL-014", price: 12.25, stock: 18 },
  { id: "p-1003", name: "Stoneground Oat Flour, 1 kg", sku: "FH-FLR-203", price: 4.8, stock: 65 },
  { id: "p-1004", name: "Smoked Sea Salt Flakes, 150 g", sku: "FH-SLT-008", price: 6.3, stock: 27 },
  { id: "p-1005", name: "Heirloom Tomato Passata, 700 g", sku: "FH-PSS-052", price: 3.9, stock: 0 },
]

const currency = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  const confirmDelete = () => {
    if (!pendingDelete) return
    const removed = pendingDelete
    setProducts((current) => current.filter((product) => product.id !== removed.id))
    setPendingDelete(null)
    toast.success(`Deleted ${removed.name}`)
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Catalog</h1>
        <p className="text-sm text-muted-foreground">
          Fernhill Market products available for sale.
        </p>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
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
              <TableCell className="text-right">{currency.format(product.price)}</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell className="text-right">
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
              <TableCell colSpan={5} className="text-center text-muted-foreground">
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
              {pendingDelete?.name} will be removed from the catalog and can't be added to new
              orders. Its sales history stays in reports and past orders.
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
