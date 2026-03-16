import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { DateRange } from "react-day-picker";
import { LuCalendar } from "react-icons/lu"
import dayjs from "dayjs"

interface Props {
    applyDateRangeFilter: (range: DateRange | undefined) => void;
    currentDateRange: DateRange | undefined;
    onResetDateRange: () => void;
}

function formatDateRange(range: DateRange | undefined): string {
    if (!range?.from) return 'Date';
    const from = dayjs(range.from).format('MMM D');
    if (!range.to || dayjs(range.from).isSame(dayjs(range.to), 'day')) return from;
    return `${from} - ${dayjs(range.to).format('MMM D')}`;
}

export const INITIAL_DATE_RANGE: DateRange = {
    from: undefined,
};

export default function InsightsCalendarPopover({ applyDateRangeFilter, currentDateRange, onResetDateRange }: Props) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(INITIAL_DATE_RANGE);
    const [open, setOpen] = useState(false);

    const onReset = () => {
        setDateRange(INITIAL_DATE_RANGE)
        onResetDateRange();
    }
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="sayso-outlined-button">
                    <LuCalendar /> <span className="insights-filter-label">{formatDateRange(currentDateRange)}</span>
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
                        onClick={onReset}
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