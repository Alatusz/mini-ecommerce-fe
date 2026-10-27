import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "./components/DashboardSidebar"
import { DashboardNavbar } from "./components/DashboardNavbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar />

      <SidebarInset>
        {/* ── Top Dashboard Navbar ── */}
        <DashboardNavbar />

        {/* ── Main Routed Page Content ── */}
        <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
