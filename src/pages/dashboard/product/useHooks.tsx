import { useState, useMemo } from "react"
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
  const [stockFilter, setStockFilter] = useState<"All" | "In Stock" | "Low Stock" | "Out of Stock">("All")

  // Modal dialog states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Smartphones",
    price: 0,
    stock: 0,
    image: "/images/hero-airpods.png",
  })
  const [formError, setFormError] = useState("")

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch =
        searchQuery === "" ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilter === "All" || prod.category === categoryFilter

      const matchesStock =
        stockFilter === "All" || prod.status === stockFilter

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, searchQuery, categoryFilter, stockFilter])

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0)
    const lowStockCount = products.filter((p) => p.status === "Low Stock" || p.status === "Out of Stock").length
    const topSeller = [...products].sort((a, b) => b.salesCount - a.salesCount)[0]

    return {
      totalProducts,
      totalInventoryValue,
      lowStockCount,
      topSellerName: topSeller ? topSeller.name : "-",
      topSellerSales: topSeller ? topSeller.salesCount : 0,
    }
  }, [products])

  const openAddDialog = () => {
    setFormData({
      name: "",
      sku: "",
      category: "Smartphones",
      price: 0,
      stock: 0,
      image: "/images/hero-airpods.png",
    })
    setFormError("")
    setIsAddOpen(true)
  }

  const openEditDialog = (prod: ProductItem) => {
    setEditingProduct(prod)
    setFormData({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      image: prod.image,
    })
    setFormError("")
  }

  const openDeleteDialog = (prod: ProductItem) => {
    setDeletingProduct(prod)
  }

  const handleAddProduct = () => {
    if (!formData.name.trim()) {
      setFormError("Product name is required")
      return
    }
    if (!formData.sku.trim()) {
      setFormError("SKU is required")
      return
    }

    const stock = Number(formData.stock) || 0
    let status: ProductItem["status"] = "In Stock"
    if (stock === 0) status = "Out of Stock"
    else if (stock < 5) status = "Low Stock"

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      price: Number(formData.price) || 0,
      stock,
      salesCount: 0,
      image: formData.image || "/images/hero-airpods.png",
      status,
    }

    setProducts((prev) => [newProd, ...prev])
    setIsAddOpen(false)
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return
    if (!formData.name.trim()) {
      setFormError("Product name is required")
      return
    }

    const stock = Number(formData.stock) || 0
    let status: ProductItem["status"] = "In Stock"
    if (stock === 0) status = "Out of Stock"
    else if (stock < 5) status = "Low Stock"

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name.trim(),
              sku: formData.sku.trim().toUpperCase(),
              category: formData.category,
              price: Number(formData.price) || 0,
              stock,
              image: formData.image || p.image,
              status,
            }
          : p
      )
    )
    setEditingProduct(null)
  }

  const handleDeleteProduct = () => {
    if (!deletingProduct) return
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id))
    setDeletingProduct(null)
  }

  return {
    products: filteredProducts,
    rawProducts: products,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    stats,
    // Dialogs
    isAddOpen,
    setIsAddOpen,
    editingProduct,
    setEditingProduct,
    deletingProduct,
    setDeletingProduct,
    formData,
    setFormData,
    formError,
    // Actions
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  }
}
