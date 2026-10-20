import { Button } from "@/components/ui/button"
import Logo from "@/assets/alatusz-logo.svg"
import ThemeToggle from "@/components/shares/Theme-toggle"
import { Link } from "react-router-dom"

function Navbar() {
  const navMenus = [
    { title: "สมัครสมาชิก", href: "/register" },
    { title: "เข้าสู่ระบบ", href: "/login" },
  ]

  return (
    <nav className="flex max-h-[60px] items-center justify-between bg-background/95 px-6 py-4">
      <Link to="/">
        <img
          src={Logo}
          width="45px"
          className="cursor-pointer rounded-md object-cover"
        />
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {navMenus.map((menu) => (
          <Button
            size="default"
            variant="default"
            key={menu.title}
            className="cursor-pointer"
          >
            <Link to={menu.href}>{menu.title}</Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
