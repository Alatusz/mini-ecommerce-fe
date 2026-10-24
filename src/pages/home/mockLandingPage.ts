// ============================
// Mock Data สำหรับหน้า Landing Page
// (ตรงตามดีไซน์ Cyber Tech E-Commerce)
// ============================

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isBestSeller?: boolean
  isFeatured?: boolean
  stock: number
}

export interface Category {
  id: string
  name: string
  slug: string
  iconName: string
  productCount: number
}

export interface ShowcaseItem {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  link: string
  bgColor?: string
  textColor?: string
}

// ---------- 10 Tech Categories (Grid-10) ----------
export const mockCategories: Category[] = [
  { id: "cat-phones", name: "Phones", slug: "phones", iconName: "Smartphone", productCount: 142 },
  { id: "cat-watches", name: "Smart Watches", slug: "watches", iconName: "Watch", productCount: 96 },
  { id: "cat-cameras", name: "Cameras", slug: "cameras", iconName: "Camera", productCount: 58 },
  { id: "cat-headphones", name: "Headphones", slug: "headphones", iconName: "Headphones", productCount: 124 },
  { id: "cat-computers", name: "Computers", slug: "computers", iconName: "Laptop", productCount: 85 },
  { id: "cat-gaming", name: "Gaming", slug: "gaming", iconName: "Gamepad2", productCount: 110 },
  { id: "cat-tablets", name: "Tablets", slug: "tablets", iconName: "Tablet", productCount: 64 },
  { id: "cat-audio", name: "Audio", slug: "audio", iconName: "Speaker", productCount: 78 },
  { id: "cat-accessories", name: "Accessories", slug: "accessories", iconName: "Cable", productCount: 230 },
  { id: "cat-vr", name: "VR & Smart Tech", slug: "vr", iconName: "Glasses", productCount: 35 },
]

// ---------- Mock Products ----------
export const mockProducts: Product[] = [
  {
    id: "prod-iphone-14-pro",
    name: "Apple iPhone 14 Pro Max 128GB Deep Purple",
    price: 39900,
    originalPrice: 44900,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop",
    category: "phones",
    rating: 4.9,
    reviewCount: 320,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    stock: 25,
  },
  {
    id: "prod-cinema-cam",
    name: "Blackmagic Pocket Cinema Camera 4K Pro",
    price: 45900,
    originalPrice: 52000,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    category: "cameras",
    rating: 4.8,
    reviewCount: 124,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    stock: 10,
  },
  {
    id: "prod-apple-watch",
    name: "Apple Watch Series 9 GPS 41mm Starlight Sport",
    price: 15900,
    originalPrice: 17900,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop",
    category: "watches",
    rating: 4.7,
    reviewCount: 289,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    stock: 35,
  },
  {
    id: "prod-airpods-max",
    name: "AirPods Max Silver with Smart Case",
    price: 19900,
    originalPrice: 22900,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop",
    category: "headphones",
    rating: 4.9,
    reviewCount: 412,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    stock: 14,
  },
  {
    id: "prod-galaxy-watch",
    name: "Samsung Galaxy Watch 6 Classic 47mm Black",
    price: 13900,
    originalPrice: 15900,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "watches",
    rating: 4.6,
    reviewCount: 178,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    stock: 20,
  },
  {
    id: "prod-galaxy-zfold",
    name: "Samsung Galaxy Z Fold 5 512GB Phantom Black",
    price: 59900,
    originalPrice: 65900,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&fit=crop",
    category: "phones",
    rating: 4.8,
    reviewCount: 195,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    stock: 12,
  },
  {
    id: "prod-sony-earbuds",
    name: "Sony WF-1000XM5 Wireless Noise Canceling Earbuds",
    price: 8990,
    originalPrice: 10990,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    category: "headphones",
    rating: 4.7,
    reviewCount: 260,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    stock: 40,
  },
  {
    id: "prod-ipad-10",
    name: "Apple iPad 10.9-inch (10th Gen) Wi-Fi 64GB Silver",
    price: 14900,
    originalPrice: 17900,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
    category: "tablets",
    rating: 4.8,
    reviewCount: 512,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    stock: 30,
  },
  {
    id: "prod-macbook-air",
    name: "Apple MacBook Air 15-inch M2 Chip 256GB Silver",
    price: 47900,
    originalPrice: 52900,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    category: "computers",
    rating: 4.9,
    reviewCount: 388,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    stock: 18,
  },
  {
    id: "prod-ps5-digital",
    name: "Sony PlayStation 5 Digital Edition Console",
    price: 15690,
    originalPrice: 18900,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
    category: "gaming",
    rating: 4.9,
    reviewCount: 740,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    stock: 8,
  },
  {
    id: "prod-vision-pro",
    name: "Apple Vision Pro 256GB Spatial Headset",
    price: 129900,
    originalPrice: 139900,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&h=500&fit=crop",
    category: "vr",
    rating: 4.9,
    reviewCount: 89,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    stock: 5,
  },
  {
    id: "prod-keyboard-rgb",
    name: "Logitech G Pro X Mechanical Gaming Keyboard RGB",
    price: 4290,
    originalPrice: 4990,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop",
    category: "gaming",
    rating: 4.6,
    reviewCount: 215,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    stock: 45,
  },
]

// ---------- Discounted Products (Grid-6) ----------
export const mockDiscountProducts: Product[] = [
  {
    id: "disc-01",
    name: "Apple iPhone 14 128GB Gold Edition",
    price: 24900,
    originalPrice: 32900,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
    category: "phones",
    rating: 4.7,
    reviewCount: 340,
    stock: 15,
  },
  {
    id: "disc-02",
    name: "AirPods Max Space Gray High-Fidelity",
    price: 16900,
    originalPrice: 22900,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "headphones",
    rating: 4.8,
    reviewCount: 210,
    stock: 12,
  },
  {
    id: "disc-03",
    name: "Apple Watch Ultra 2 GPS + Cellular 49mm",
    price: 28900,
    originalPrice: 34900,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop",
    category: "watches",
    rating: 4.9,
    reviewCount: 178,
    stock: 9,
  },
  {
    id: "disc-04",
    name: "Apple iPhone 13 128GB Midnight Edition",
    price: 19900,
    originalPrice: 27900,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
    category: "phones",
    rating: 4.8,
    reviewCount: 620,
    stock: 22,
  },
  {
    id: "disc-05",
    name: "Apple iPad Pro 11-inch M4 OLED 256GB",
    price: 36900,
    originalPrice: 42900,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop",
    category: "tablets",
    rating: 4.9,
    reviewCount: 145,
    stock: 10,
  },
  {
    id: "disc-06",
    name: "Samsung Galaxy Z Fold 5 Phantom Black",
    price: 49900,
    originalPrice: 65900,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop",
    category: "phones",
    rating: 4.8,
    reviewCount: 190,
    stock: 14,
  },
]

// ---------- 4 Showcase Cards ----------
export const mockShowcaseCards: ShowcaseItem[] = [
  {
    id: "show-01",
    title: "Popular Products",
    subtitle: "Everyday Tech",
    description: "Essential smart wearables and high-fidelity wireless audio engineered for seamless daily connectivity.",
    image: "/images/showcase-gadgets.png",
    link: "/products?category=accessories",
    bgColor: "bg-white dark:bg-zinc-900",
  },
  {
    id: "show-02",
    title: "iPad Pro",
    subtitle: "M4 Ultra Fast",
    description: "Incredible thinness, game-changing performance, and breakthrough Ultra Retina XDR display.",
    image: "/images/showcase-ipad.png",
    link: "/products?category=tablets",
    bgColor: "bg-[#f5f5f7] dark:bg-zinc-900",
  },
  {
    id: "show-03",
    title: "Samsung Galaxy",
    subtitle: "Unfold Your World",
    description: "The ultimate 7.6-inch main screen opens to an expansive workspace and powerhouse gaming platform.",
    image: "/images/showcase-foldable.png",
    link: "/products?category=phones",
    bgColor: "bg-[#eaeaea] dark:bg-zinc-900",
  },
  {
    id: "show-04",
    title: "MacBook Pro",
    subtitle: "M3 Max Power",
    description: "The most advanced chips ever built for a pro laptop. Phenomenal battery life and Liquid Retina XDR.",
    image: "/images/showcase-macbook.png",
    link: "/products?category=computers",
    bgColor: "bg-[#2c2c2c] text-white dark:bg-black",
    textColor: "text-white",
  },
]

export interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

export const mockFeatures: Feature[] = [
  {
    id: "feat-01",
    icon: "🚚",
    title: "จัดส่งฟรี",
    description: "สั่งซื้อครบ ฿500 จัดส่งฟรีทั่วประเทศ",
  },
  {
    id: "feat-02",
    icon: "🔄",
    title: "คืนสินค้าง่าย",
    description: "เปลี่ยน-คืนได้ภายใน 30 วัน",
  },
  {
    id: "feat-03",
    icon: "🔒",
    title: "ชำระเงินปลอดภัย",
    description: "ระบบเข้ารหัส SSL 100%",
  },
  {
    id: "feat-04",
    icon: "💬",
    title: "ซัพพอร์ต 24/7",
    description: "ทีมงานพร้อมช่วยเหลือตลอด 24 ชั่วโมง",
  },
]

