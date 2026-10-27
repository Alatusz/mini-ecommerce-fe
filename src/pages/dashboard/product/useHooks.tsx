import { useState, useCallback } from "react"
import {
  getStoredProducts,
  deleteProductFromStore,
  productCategories,
  type ProductItem,
} from "./common/mockProduct"

export type { ProductItem }
export { productCategories }

export function useProduct() {
  const [products, setProducts] = useState<ProductItem[]>(getStoredProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [stockFilter, setStockFilter] = useState("All")

  // Delete modal state
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null)

  const refreshProducts = useCallback(() => {
    setProducts(getStoredProducts())
  }, [])

  const handleDeleteProduct = (id: string) => {
    deleteProductFromStore(id)
    refreshProducts()
    setDeletingProduct(null)
  }

  return {
    products,
    setProducts,
    refreshProducts,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    deletingProduct,
    setDeletingProduct,
    handleDeleteProduct,
  }
}
