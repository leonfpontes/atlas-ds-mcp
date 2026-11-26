import { useState } from "react"
import { Trash2 } from "lucide-react"
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
import { Toaster } from "@/components/ui/sonner"

type Product = {
  id: string
  name: string
  sku: string
  price: string
  unitsSold: number
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "p-1", name: "Wildflower honey, 340 g", sku: "HON-340", price: "$7.50", unitsSold: 412 },
  { id: "p-2", name: "Sourdough loaf", sku: "BRD-SOUR", price: "$6.00", unitsSold: 268 },
  { id: "p-3", name: "Oat milk, 1 L", sku: "DRY-OAT1", price: "$3.25", unitsSold: 190 },
  { id: "p-4", name: "Heirloom tomatoes, 500 g", sku: "PRD-TOM5", price: "$4.80", unitsSold: 97 },
]

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  function openDeleteDialog(product: Product) {
    setProductToDelete(product)
    setDialogOpen(true)
  }

  function confirmDelete() {
    if (!productToDelete) return
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
    setDialogOpen(false)
    toast.success(`${productToDelete.name} deleted`)
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <Toaster />

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Catalog</h1>
        <p className="text-sm text-muted-foreground">Fernhill Market products</p>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Units sold</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No products in the catalog.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="text-right">{product.price}</TableCell>
                <TableCell className="text-right">{product.unitsSold}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${product.name}`}
                    onClick={() => openDeleteDialog(product)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {productToDelete?.name}?</DialogTitle>
            <DialogDescription>
              The product will be removed from the catalog. Its sales history stays in your reports.
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
    </main>
  )
}
