import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"

const INITIAL_PRODUCTS = [
  { id: "p-1001", name: "Oat milk, 1 L", sku: "FH-1001", price: "$2.49", stock: 42 },
  { id: "p-1002", name: "Sourdough loaf", sku: "FH-1002", price: "$5.20", stock: 18 },
  { id: "p-1003", name: "Wild honey, 500 g", sku: "FH-1003", price: "$8.90", stock: 9 },
  { id: "p-1004", name: "Free-range eggs, 12", sku: "FH-1004", price: "$4.75", stock: 27 },
]

type Product = (typeof INITIAL_PRODUCTS)[number]

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  function confirmDelete() {
    if (!pendingDelete) return
    const name = pendingDelete.name
    setProducts((current) => current.filter((p) => p.id !== pendingDelete.id))
    setPendingDelete(null)
    toast.success(`Deleted ${name}`)
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Fernhill Market catalog</CardTitle>
          <CardDescription>Products available in the store.</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableCell className="text-right">{product.price}</TableCell>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
