export interface ProductItem {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  salesCount: number
  image: string
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

export const initialProducts: ProductItem[] = [
  {
    id: "prod-1",
    name: "Apple iPhone 14 Pro Max 128GB",
    sku: "IPH14-128-PUR",
    category: "Smartphones",
    price: 1399,
    stock: 45,
    salesCount: 142,
    image: "/images/detail-purple.png",
    status: "In Stock",
  },
  {
    id: "prod-2",
    name: "AirPods Max Silver Edition",
    sku: "AIRMAX-SLV",
    category: "Audio",
    price: 549,
    stock: 4,
    salesCount: 98,
    image: "/images/hero-airpods.png",
    status: "Low Stock",
  },
  {
    id: "prod-3",
    name: "Apple Watch Series 9 GPS 41mm",
    sku: "AW9-41-STAR",
    category: "Wearables",
    price: 399,
    stock: 28,
    salesCount: 87,
    image: "/images/cart-watch.png",
    status: "In Stock",
  },
  {
    id: "prod-4",
    name: "MacBook Pro 16\" M3 Max 36GB",
    sku: "MBP16-M3-SLV",
    category: "Computers",
    price: 3499,
    stock: 12,
    salesCount: 34,
    image: "/images/hero-airpods.png",
    status: "In Stock",
  },
  {
    id: "prod-5",
    name: "Sony PlayStation 5 Digital Edition",
    sku: "PS5-DIGI-WHT",
    category: "Gaming",
    price: 449,
    stock: 0,
    salesCount: 215,
    image: "/images/detail-purple.png",
    status: "Out of Stock",
  },
  {
    id: "prod-6",
    name: "Sony WH-1000XM5 Wireless Headphones",
    sku: "WH1000XM5-BLK",
    category: "Audio",
    price: 399,
    stock: 19,
    salesCount: 76,
    image: "/images/hero-airpods.png",
    status: "In Stock",
  },
  {
    id: "prod-7",
    name: "Samsung Galaxy S24 Ultra 256GB",
    sku: "SGS24U-256-GRY",
    category: "Smartphones",
    price: 1299,
    stock: 31,
    salesCount: 65,
    image: "/images/detail-purple.png",
    status: "In Stock",
  },
  {
    id: "prod-8",
    name: "Anker Prime 200W GaN Charging Dock",
    sku: "ANK-PRIME-200",
    category: "Accessories",
    price: 129,
    stock: 3,
    salesCount: 110,
    image: "/images/cart-watch.png",
    status: "Low Stock",
  },
]

export const productCategories = [
  "All",
  "Smartphones",
  "Audio",
  "Wearables",
  "Computers",
  "Gaming",
  "Accessories",
]
