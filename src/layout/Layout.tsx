import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <Navbar />
      </header>
      {/* BODY */}
      <main className="container mx-auto flex-1 px-4 py-6">
        <Outlet />
      </main>
      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Alatusz.Dev. All rights reserved</p>
      </footer>
    </div>
  )
}

export default MainLayout
