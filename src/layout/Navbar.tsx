import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import Logo from "@/assets/alatusz-logo.svg"

function Navbar() {
  const navigate = useNavigate()

  const navMenus = [
    { title: "สมัครสมาชิก", href: "/register" },
    { title: "เข้าสู่ระบบ", href: "/login" },
  ]

  return (
    <nav className="flex max-h-[60px] items-center justify-between bg-background/95 px-6 py-4">
      <img
        src={Logo}
        width="45px"
        onClick={() => navigate("/")}
        className="cursor-pointer rounded-md object-cover"
      />
      <div className="flex items-center gap-4">
        {navMenus.map((menu) => (
          <Button
            size="default"
            variant="default"
            key={menu.title}
            onClick={() => navigate(menu.href)}
            className="cursor-pointer"
          >
            {menu.title}
          </Button>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
