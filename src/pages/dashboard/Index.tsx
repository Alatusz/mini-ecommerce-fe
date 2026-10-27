import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "./components/DashboardSidebar"
import { DashboardNavbar } from "./components/DashboardNavbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar />

      <SidebarInset className="min-w-[1200px] h-svh overflow-y-auto overflow-x-auto">
        {/* ── Top Dashboard Navbar ── */}
        <DashboardNavbar />

        {/* ── Main Content Area (Desktop-native) ── */}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
