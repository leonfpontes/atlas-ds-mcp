import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
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

interface Product {
  id: string
  name: string
  sku: string
  price: string
  unitsSold: number
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "p-101", name: "Organic Honeycrisp Apples", sku: "FRU-1001", price: "$3.49", unitsSold: 412 },
  { id: "p-102", name: "Stone-Ground Whole Wheat Flour", sku: "PAN-2038", price: "$5.25", unitsSold: 186 },
  { id: "p-103", name: "Fernhill Cold Brew Concentrate", sku: "BEV-3317", price: "$12.99", unitsSold: 254 },
  { id: "p-104", name: "Wildflower Honey, 12 oz", sku: "PAN-2144", price: "$8.75", unitsSold: 97 },
  { id: "p-105", name: "Free-Range Brown Eggs, Dozen", sku: "DAI-4410", price: "$6.10", unitsSold: 530 },
]

export default function ProductCatalogScreen() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  function confirmDelete() {
    if (!pendingDelete) return
    const removed = pendingDelete
    setProducts((current) => current.filter((p) => p.id !== removed.id))
    setPendingDelete(null)
    toast.success(`${removed.name} was removed from the catalog`)
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Product catalog</CardTitle>
          <CardDescription>
            {products.length} {products.length === 1 ? "product" : "products"} in Fernhill Market
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell className="text-right">{product.price}</TableCell>
                  <TableCell className="text-right">{product.unitsSold}</TableCell>
                  <TableCell>
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
              This removes the product from the catalog. Its sales history stays in your
              reports, and the {pendingDelete?.unitsSold ?? 0} units already sold are still
              counted.
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
