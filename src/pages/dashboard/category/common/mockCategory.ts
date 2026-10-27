export interface CategoryItem {
  id: string
  name: string
  slug: string
  itemCount: number
  description: string
  status?: "Active" | "Archived"
  icon?: string
}

export const initialCategories: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Smartphones",
    slug: "smartphones",
    itemCount: 142,
    description: "Latest flagship phones, foldable devices, and mobile technology.",
    status: "Active",
  },
  {
    id: "cat-2",
    name: "Audio & Headphones",
    slug: "audio",
    itemCount: 88,
    description: "Noise cancelling over-ear headphones, Hi-Fi DACs, and wireless earbuds.",
    status: "Active",
  },
  {
    id: "cat-3",
    name: "Wearables & Watches",
    slug: "wearables",
    itemCount: 64,
    description: "Smartwatches, biometric fitness trackers, and health sensors.",
    status: "Active",
  },
  {
    id: "cat-4",
    name: "Computers & Laptops",
    slug: "computers",
    itemCount: 52,
    description: "High-performance laptops, ultrabooks, workstations, and displays.",
    status: "Active",
  },
  {
    id: "cat-5",
    name: "Gaming & Consoles",
    slug: "gaming",
    itemCount: 45,
    description: "Next-gen consoles, mechanical keyboards, gaming mice, and VR headsets.",
    status: "Active",
  },
  {
    id: "cat-6",
    name: "Accessories",
    slug: "accessories",
    itemCount: 180,
    description: "GaN fast chargers, braided cables, MagSafe docks, and protective cases.",
    status: "Active",
  },
  {
    id: "cat-7",
    name: "Photography & Cameras",
    slug: "cameras",
    itemCount: 29,
    description: "Mirrorless camera bodies, prime lenses, gimbals, and studio lighting.",
    status: "Active",
  },
  {
    id: "cat-8",
    name: "Smart Home",
    slug: "smart-home",
    itemCount: 38,
    description: "IoT hubs, intelligent lights, security cameras, and voice speakers.",
    status: "Active",
  },
]
