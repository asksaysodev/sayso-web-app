import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { DateRange } from "react-day-picker";
import { LuCalendar } from "react-icons/lu"

interface Props {
    applyDateRangeFilter: (range: DateRange) => void;
}

export const INITIAL_DATE_RANGE: DateRange = {
    from: undefined,
};

export default function InsightsCalendarPopover({ applyDateRangeFilter }: Props) {
    const [dateRange, setDateRange] = useState<DateRange>(INITIAL_DATE_RANGE);
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="sayso-outlined-button">
                    <LuCalendar /> <span className="insights-filter-label">Search by date</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    captionLayout="dropdown"
                    onSelect={(range) => {
                        setDateRange(range)
                    }}
                />
                <div className="calendar-buttons-container">
                    <button 
                        className="sayso-outlined-button" 
                        onClick={() => {
                            setDateRange(INITIAL_DATE_RANGE)
                        }}
                    >
                        Reset
                    </button>

                    <button 
                        className="sayso-submit-button" 
                        onClick={() => {
                            applyDateRangeFilter(dateRange);
                            setOpen(false);
                        }}
                    >
                        Apply
                    </button>
                </div>
            </PopoverContent>
      </Popover>
    )
}