import { useState } from "react"
import {
  initialProducts,
  productCategories,
  type ProductItem,
} from "./common/mockProduct"

export type { ProductItem }
export { productCategories }

export function useProduct() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [stockFilter, setStockFilter] = useState("All")

  // Dialog UI states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null)

  return {
    products,
    setProducts,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    // Dialogs
    isAddOpen,
    setIsAddOpen,
    editingProduct,
    setEditingProduct,
    deletingProduct,
    setDeletingProduct,
  }
}
