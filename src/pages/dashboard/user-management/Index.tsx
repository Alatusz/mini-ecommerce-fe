import { Plus } from "lucide-react"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { useUserManagement } from "./useHooks"
import { UserStatsGrid } from "./common/UserStatsGrid"
import { UserTable } from "./common/UserTable"
import { UserDeleteDialog } from "./common/UserDeleteDialog"

export default function DashboardUserManagementPage() {
  const {
    users,
    total,
    selectedSearchBy,
    selectedRoles,
    selectedStatuses,
    staffCount,
    customerCount,
    totalOrders,
    deletingUser,
    setDeletingUser,
    isDeleting,
    handleFilterApply,
    handleFilterReset,
    handleCreate,
    handleEdit,
    handleDeleteConfirm,
  } = useUserManagement()

  return (
    <PageContent>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer, staff, and administrator accounts.
          </p>
        </div>
        <Button onClick={handleCreate} className="cursor-pointer gap-1.5">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <UserStatsGrid
        total={total}
        staffCount={staffCount}
        customerCount={customerCount}
        totalOrders={totalOrders}
      />

      <UserTable
        data={users}
        total={total}
        selectedSearchBy={selectedSearchBy}
        selectedRoles={selectedRoles}
        selectedStatuses={selectedStatuses}
        onFilterApply={handleFilterApply}
        onFilterReset={handleFilterReset}
        onEdit={handleEdit}
        onDelete={setDeletingUser}
      />

      <UserDeleteDialog
        user={deletingUser}
        isDeleting={isDeleting}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
      />
    </PageContent>
  )
}
