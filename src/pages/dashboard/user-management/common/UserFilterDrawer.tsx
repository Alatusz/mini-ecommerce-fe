import { useState, useEffect } from "react"
import { SlidersHorizontal, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  USER_ROLE_OPTIONS,
  USER_SEARCH_TARGET_OPTIONS,
  USER_STATUS_OPTIONS,
  type UserSearchTarget,
} from "../useHubs"

export interface UserFilterState {
  searchBy: UserSearchTarget[]
  roles: string[]
  status: string[]
}

export const DEFAULT_USER_FILTERS: UserFilterState = {
  searchBy: [],
  roles: [],
  status: [],
}

interface UserFilterDrawerProps {
  currentFilters: UserFilterState
  onApply: (filters: UserFilterState) => void
  onReset: () => void
}

export function UserFilterDrawer({
  currentFilters,
  onApply,
  onReset,
}: UserFilterDrawerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<UserFilterState>(currentFilters)

  useEffect(() => {
    if (open) {
      setDraft(currentFilters)
    }
  }, [open, currentFilters])

  const activeFilterCount =
    (currentFilters.searchBy.length > 0 ? 1 : 0) +
    (currentFilters.roles.length > 0 ? 1 : 0) +
    (currentFilters.status.length > 0 ? 1 : 0)

  const handleApply = () => {
    onApply(draft)
    setOpen(false)
  }

  const handleReset = () => {
    setDraft(DEFAULT_USER_FILTERS)
    onReset()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-9 cursor-pointer gap-2 border-dashed border-border/80 bg-background/60 px-3 text-xs font-medium hover:bg-muted/60"
          />
        }
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge
            variant="secondary"
            className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-bold text-primary tabular-nums"
          >
            {activeFilterCount}
          </Badge>
        )}
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            User Filters
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Filter users by search target, role, and account status.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Search Target Column */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Search Target Column
            </Label>
            <Select
              multiple
              value={draft.searchBy}
              onValueChange={(values: UserSearchTarget[]) => {
                setDraft((prev) => ({ ...prev, searchBy: values }))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: UserSearchTarget[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === USER_SEARCH_TARGET_OPTIONS.length
                      ? "All Columns"
                      : value
                          .map(
                            (v) =>
                              USER_SEARCH_TARGET_OPTIONS.find((o) => o.value === v)
                                ?.label || v
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {USER_SEARCH_TARGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Roles */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              User Role
            </Label>
            <Select
              multiple
              value={draft.roles}
              onValueChange={(values: string[]) => {
                setDraft((prev) => ({ ...prev, roles: values }))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === USER_ROLE_OPTIONS.length
                      ? "All Roles"
                      : value
                          .map(
                            (id) =>
                              USER_ROLE_OPTIONS.find((r) => r.id === id)?.label || id
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {USER_ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Account Status
            </Label>
            <Select
              multiple
              value={draft.status}
              onValueChange={(values: string[]) => {
                setDraft((prev) => ({ ...prev, status: values }))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string[]) =>
                    !value ||
                    value.length === 0 ||
                    value.length === USER_STATUS_OPTIONS.length
                      ? "All Status"
                      : value
                          .map(
                            (id) =>
                              USER_STATUS_OPTIONS.find((s) => s.id === id)?.label ||
                              id
                          )
                          .join(", ")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {USER_STATUS_OPTIONS.map((st) => (
                    <SelectItem key={st.id} value={st.id}>
                      <span className="flex items-center gap-2">
                        <span className={`size-2 shrink-0 rounded-full ${st.dot}`} />
                        <span>{st.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="mt-auto border-t bg-muted/20 px-6 py-4">
          <div className="flex w-full items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-9 flex-1 cursor-pointer text-xs"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              className="h-9 flex-1 cursor-pointer text-xs"
            >
              Apply Filters
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

