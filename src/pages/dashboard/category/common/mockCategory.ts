export interface CategoryItem {
  id: string
  name: string
  slug: string
  productCount?: number
  image?: string
  status?: "active" | "archived" | "draft" | "Active" | "Archived"
  icon?: string
}

export const initialCategories: CategoryItem[] = [
  {
    id: "category-1",
    name: "Smartphones",
    slug: "smartphones",
    productCount: 142,
    image: "/images/detail-purple.png",
    status: "Active",
  },
  {
    id: "category-2",
    name: "Audio & Headphones",
    slug: "audio",
    productCount: 88,
    image: "/images/hero-airpods.png",
    status: "Active",
  },
  {
    id: "category-3",
    name: "Wearables & Watches",
    slug: "wearables",
    productCount: 64,
    image: "/images/cart-watch.png",
    status: "Active",
  },
  {
    id: "category-4",
    name: "Computers & Laptops",
    slug: "computers",
    productCount: 52,
    image: "/images/hero-macbook.png",
    status: "Active",
  },
  {
    id: "category-5",
    name: "Gaming & Consoles",
    slug: "gaming",
    productCount: 45,
    image: "/images/hero-ps5.png",
    status: "Active",
  },
  {
    id: "category-6",
    name: "Accessories",
    slug: "accessories",
    productCount: 180,
    image: "/images/showcase-gadgets.png",
    status: "Active",
  },
  {
    id: "category-7",
    name: "Photography & Cameras",
    slug: "cameras",
    productCount: 29,
    image: "/images/showcase-foldable.png",
    status: "Active",
  },
  {
    id: "category-8",
    name: "Smart Home",
    slug: "smart-home",
    productCount: 38,
    image: "/images/showcase-ipad.png",
    status: "Active",
  },
]

let categoryStore: CategoryItem[] = [...initialCategories]

export const getStoredCategories = (): CategoryItem[] => {
  return [...categoryStore]
}

export const getCategoryById = (id: string): CategoryItem | undefined => {
  return categoryStore.find((c) => c.id === id)
}

export const addCategoryToStore = (category: CategoryItem): void => {
  categoryStore = [category, ...categoryStore]
}

export const updateCategoryInStore = (
  id: string,
  updated: Partial<CategoryItem>
): CategoryItem | null => {
  const index = categoryStore.findIndex((c) => c.id === id)
  if (index === -1) return null
  const newItem = { ...categoryStore[index], ...updated }
  categoryStore[index] = newItem
  return newItem
}

export const deleteCategoryFromStore = (id: string): boolean => {
  const initialLen = categoryStore.length
  categoryStore = categoryStore.filter((c) => c.id !== id)
  return categoryStore.length < initialLen
}
