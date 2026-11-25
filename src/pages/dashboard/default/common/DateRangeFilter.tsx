import { useState } from "react"
import { Calendar as CalendarIcon, ChevronDown, ArrowRight } from "lucide-react"
import { format, subDays, subMonths, subYears } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DateRangeFilterProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  className?: string
  align?: "start" | "center" | "end"
  maxDate?: Date
}

interface PresetItem {
  key: string
  label: string
  getRange: () => DateRange
}

export function DateRangeFilter({
  value,
  onChange,
  className,
  align = "end",
  maxDate = new Date(),
}: DateRangeFilterProps) {
  // วันที่สูงสุดที่อนุญาตให้เลือก (Default คือวันปัจจุบัน)
  const effectiveMaxDate = maxDate

  // Presets definition matching the mockup
  const presets: PresetItem[] = [
    {
      key: "today",
      label: "Today",
      getRange: () => ({
        from: effectiveMaxDate,
        to: effectiveMaxDate,
      }),
    },
    {
      key: "week",
      label: "Last 7 days",
      getRange: () => ({
        from: subDays(effectiveMaxDate, 6),
        to: effectiveMaxDate,
      }),
    },
    {
      key: "month",
      label: "Last 12 Months",
      getRange: () => ({
        from: subMonths(effectiveMaxDate, 12),
        to: effectiveMaxDate,
      }),
    },
    {
      key: "year",
      label: "Last Year",
      getRange: () => ({
        from: subYears(effectiveMaxDate, 1),
        to: effectiveMaxDate,
      }),
    },
    {
      key: "all-time",
      label: "All time",
      getRange: () => ({
        from: new Date(effectiveMaxDate.getFullYear() - 2, 0, 1),
        to: effectiveMaxDate,
      }),
    },
    {
      key: "custom",
      label: "Custom",
      getRange: () => ({
        from: undefined,
        to: undefined,
      }),
    },
  ]

  const defaultInitial = presets.find((p) => p.key === "month")!.getRange()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>("last-12-months")
  const [tempRange, setTempRange] = useState<DateRange | undefined>(
    value || defaultInitial
  )
  const [appliedRange, setAppliedRange] = useState<DateRange | undefined>(
    value || defaultInitial
  )
  const [currentMonth, setCurrentMonth] = useState<Date>(
    tempRange?.from || subMonths(effectiveMaxDate, 1)
  )

  // Handle Preset Click
  const handleSelectPreset = (preset: PresetItem) => {
    setSelectedPreset(preset.key)
    if (preset.key !== "custom") {
      const range = preset.getRange()
      setTempRange(range)
      if (range.from) {
        setCurrentMonth(range.from)
      }
    }
  }

  // Handle Calendar Select
  const handleCalendarSelect = (range: DateRange | undefined) => {
    setTempRange(range)
    setSelectedPreset("custom")
  }

  // Apply Action
  const handleApply = () => {
    setAppliedRange(tempRange)
    setIsOpen(false)
    onChange?.(tempRange)
  }

  // Cancel Action
  const handleCancel = () => {
    setTempRange(appliedRange)
    setIsOpen(false)
  }

  // Label display for trigger button
  const formatTriggerLabel = () => {
    if (!appliedRange?.from) return "เลือกช่วงวันที่ (Date Range)"
    if (appliedRange.from && !appliedRange.to) {
      return format(appliedRange.from, "dd MMM yyyy")
    }
    if (appliedRange.from && appliedRange.to) {
      return `${format(appliedRange.from, "dd MMM yyyy")} - ${format(appliedRange.to, "dd MMM yyyy")}`
    }
    return "เลือกช่วงวันที่ (Date Range)"
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 cursor-pointer gap-2 border-border/60 px-3 text-xs font-normal shadow-xs",
              isOpen && "border-ring ring-2 ring-ring/20",
              className
            )}
          >
            <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {formatTriggerLabel()}
            </span>
            <ChevronDown
              className={cn(
                "size-3 shrink-0 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        }
      />

      <PopoverContent
        align={align}
        sideOffset={8}
        className="w-auto overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-xl focus:outline-none"
      >
        <div className="flex flex-col">
          {/* Main Top Area: Left Preset Sidebar + Right Calendar */}
          <div className="flex flex-col divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0">
            {/* Left Column: Preset Menu */}
            <div className="flex w-full shrink-0 flex-col gap-1 bg-muted/30 p-3 sm:w-44">
              <span className="px-3 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                ช่วงเวลาที่กำหนด
              </span>
              {presets.map((preset) => {
                const isActive = selectedPreset === preset.key
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={cn(
                      "w-full cursor-pointer rounded-md px-3 py-2 text-left text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary font-semibold text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>

            {/* Right Column: 2-Month Calendar (Shadcn UI Base) */}
            <div className="bg-background p-3">
              <Calendar
                mode="range"
                selected={tempRange}
                onSelect={handleCalendarSelect}
                numberOfMonths={2}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                disabled={{ after: effectiveMaxDate }}
                className="p-1"
                classNames={{
                  months:
                    "flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border gap-4",
                  month:
                    "first:pr-0 md:first:pr-4 last:pl-0 md:last:pl-4 space-y-3",
                  caption_label:
                    "text-sm font-semibold text-foreground text-center",
                  weekday:
                    "text-[11px] font-medium text-muted-foreground text-center w-8",
                  day: "size-8 p-0 text-xs font-normal text-center rounded-md hover:bg-accent transition-colors",
                  today: "border border-primary font-bold text-foreground",
                }}
              />
            </div>
          </div>

          {/* Bottom Bar: Date Inputs Display + Cancel/Set Date */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-3 sm:flex-row">
            {/* Left: Date Display Boxes */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={
                  tempRange?.from
                    ? format(tempRange.from, "dd / MM / yyyy")
                    : "-- / -- / ----"
                }
                className="h-8 w-32 rounded-md border border-input bg-background px-2.5 text-center font-mono text-xs text-foreground shadow-2xs focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                placeholder="DD / MM / YYYY"
              />
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                readOnly
                value={
                  tempRange?.to
                    ? format(tempRange.to, "dd / MM / yyyy")
                    : "-- / -- / ----"
                }
                className="h-8 w-32 rounded-md border border-input bg-background px-2.5 text-center font-mono text-xs text-foreground shadow-2xs focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                placeholder="DD / MM / YYYY"
              />
            </div>

            {/* Right: Actions */}
            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="h-8 cursor-pointer px-3.5 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                className="h-8 cursor-pointer px-4 text-xs font-semibold shadow-xs"
              >
                Set Date
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateRangeFilter
