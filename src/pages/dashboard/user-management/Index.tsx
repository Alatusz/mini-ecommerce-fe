import { PageContent } from "@/components/common/PageContent"
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
    isUpdatingStatus,
    handleFilterApply,
    handleFilterReset,
    handleStatusChange,
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
        onStatusChange={handleStatusChange}
        isUpdatingStatus={isUpdatingStatus}
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
