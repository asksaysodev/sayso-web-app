import { useState } from "react";
import { LuChartColumnIncreasing } from "react-icons/lu";
import InformativeCard from "./InformativeCard";
import WeekSelector from "./WeekSelector";
import getWeeklyActivity from "../services/getWeeklyActivity";
import { useQuery } from "@tanstack/react-query";
import { WeeklyActivityDirection } from "../types";

export default function WeeklyActivityCard() {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const [tooltipY, setTooltipY] = useState(0);
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const [weekOffset, setWeekOffset] = useState(0);

    const { data: weeklyActivity, isLoading: isLoadingWeeklyActivity, isRefetching: isRefetchingWeeklyActivity } = useQuery({
        queryKey: ['dashboard-weekly-activity', weekOffset],
        queryFn: () => getWeeklyActivity(weekOffset),
    });
    
    const { totalMinutes = 0, hasNextWeek, hasPreviousWeek, dailyActivity = [] } = weeklyActivity || {};

    const handleWeekChange = (direction: WeeklyActivityDirection) => {
        setShouldAnimate(false);
        
        if (direction === 'prev') {
            setWeekOffset(prev => prev + 1);
        } else if (direction === 'next') {
            setWeekOffset(prev => Math.max(0, prev - 1));
        }
        
        setTimeout(() => setShouldAnimate(true), 10);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const wrapperRect = e.currentTarget.closest('.activity-bar-wrapper')?.getBoundingClientRect();
        
        const y = e.clientY - (wrapperRect?.top ?? 0);
        setTooltipY(y);
        setHoveredBar(index);
    };

    const handleMouseLeave = () => {
        setHoveredBar(null);
    };

    return (
          <InformativeCard
                icon={<LuChartColumnIncreasing />}
                title={'Activity'}
                description={`${totalMinutes} total minutes this week`}
                rightContent={<WeekSelector onWeekChange={handleWeekChange} hasNextWeek={hasNextWeek} hasPreviousWeek={hasPreviousWeek} weekOffset={weekOffset}/>}
                isLoading={isRefetchingWeeklyActivity || isLoadingWeeklyActivity}
            >
                <div className='activity-chart-container'>
                    {dailyActivity.map(({ date, activity }, index) => (
                        <div key={date.date} className='activity-bar-wrapper'>
                            {hoveredBar === index && (
                                <div
                                    className='activity-tooltip'
                                    style={{ top: `${tooltipY}px` }}
                                >
                                    {activity?.minutes ?? 0} min
                                </div>
                            )}
                            <div className='activity-bar-container'>
                                <div
                                    className={`activity-bar ${shouldAnimate ? 'animate' : ''} ${!activity?.minutes ? 'zero-activity-bar' : ''}`}
                                    style={{ height: `${((activity?.minutes ?? 0) / totalMinutes) * 100}%` }}
                                    onMouseMove={(e) => handleMouseMove(e, index)}
                                    onMouseLeave={handleMouseLeave}
                                />
                            </div>
                            <p className='activity-day-label'>{date.dayShort}</p>
                        </div>
                    ))}
                </div>
            </InformativeCard>
    )
}

