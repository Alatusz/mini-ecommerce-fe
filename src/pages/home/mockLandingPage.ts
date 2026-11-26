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

// ---------- 4 Showcase Cards ----------
export const mockShowcaseCards: ShowcaseItem[] = [
  {
    id: "show-01",
    title: "Popular Products",
    subtitle: "Everyday Tech",
    description:
      "Essential smart wearables and high-fidelity wireless audio engineered for seamless daily connectivity.",
    image: "/images/showcase-gadgets.png",
    link: "/products?category=accessories",
    bgColor: "bg-white dark:bg-zinc-900",
  },
  {
    id: "show-02",
    title: "iPad Pro",
    subtitle: "M4 Ultra Fast",
    description:
      "Incredible thinness, game-changing performance, and breakthrough Ultra Retina XDR display.",
    image: "/images/showcase-ipad.png",
    link: "/products?category=tablets",
    bgColor: "bg-[#f5f5f7] dark:bg-zinc-900",
  },
  {
    id: "show-03",
    title: "Samsung Galaxy",
    subtitle: "Unfold Your World",
    description:
      "The ultimate 7.6-inch main screen opens to an expansive workspace and powerhouse gaming platform.",
    image: "/images/showcase-foldable.png",
    link: "/products?category=phones",
    bgColor: "bg-[#eaeaea] dark:bg-zinc-900",
  },
  {
    id: "show-04",
    title: "MacBook Pro",
    subtitle: "M3 Max Power",
    description:
      "The most advanced chips ever built for a pro laptop. Phenomenal battery life and Liquid Retina XDR.",
    image: "/images/showcase-macbook.png",
    link: "/products?category=computers",
    bgColor: "bg-[#2c2c2c] text-white dark:bg-black",
    textColor: "text-white",
  },
]
