import {LuChevronLeft,LuChevronRight} from "react-icons/lu";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { WeeklyActivityDirection } from "../types";

dayjs.extend(isoWeek);

interface Props {
    onWeekChange: (direction: WeeklyActivityDirection) => void;
    hasPreviousWeek?: boolean;
    hasNextWeek?: boolean;
    weekOffset: number;
}

export default function WeekSelector({ onWeekChange, hasPreviousWeek = false, hasNextWeek = false, weekOffset }: Props) {
    const currentWeek = dayjs().subtract(weekOffset, 'week');
    
    const weekStart = currentWeek.startOf('isoWeek');
    const weekEnd = currentWeek.endOf('isoWeek');
    
    const handlePrevWeek = () => {
        onWeekChange?.('prev');
    };

    const handleNextWeek = () => {
        onWeekChange?.('next');
    };
    
    const dateRangeText = `${weekStart.format('MMM D')} - ${weekEnd.format('MMM D')}`;    
    
    return (
        <div className="week-selector-container">
            <button className="week-selector-button" onClick={handlePrevWeek} disabled={!hasPreviousWeek}>
                <LuChevronLeft/>
            </button>

            <span className="week-selector-date-text">{dateRangeText}</span>

            <button className="week-selector-button" onClick={handleNextWeek} disabled={!hasNextWeek}>
                <LuChevronRight/>
            </button>
        </div>
    )
}