import { LuHourglass } from "react-icons/lu";
import InformativeCard from "./InformativeCard";
import { useAuth } from "../../../context/AuthContext";
import formatMinutesToDuration from "@/utils/formatters/formatMinutesToDuration";
import { useMemo } from "react";
import { TimeWidgetsSharedProps } from "../types";

export default function MinutesRemaining({ accountUsage, isRefetching, isLoading = false }: TimeWidgetsSharedProps) {
    const { globalUser } = useAuth();

    const { remainingMinutes = 0, planMinutes = 0, usedMinutes = 0 } = accountUsage || {};

    const usedPercentage = useMemo(() => {
        if (planMinutes === 0) return 0;
        const percentage = (usedMinutes / planMinutes) * 100;
        return Math.min(Number(percentage.toFixed(2)), 100);
    }, [usedMinutes, planMinutes]);
    
    const isTrialing = globalUser?.subscription_status === "trialing";
    const planHours = Math.floor(planMinutes / 60);
    const cardDescription = `${usedPercentage}% used of your ${planHours} ${isTrialing ? 'trial' : 'plan'} hours`;
    const { hours, mins } = useMemo(()=> formatMinutesToDuration(remainingMinutes), [remainingMinutes]);
    
    return (
        <InformativeCard
            icon={<LuHourglass />}
            title={'Time Remaining'}
            description={cardDescription}
            isLoading={isRefetching || isLoading}
        >
            <div className='card-content-container'>
                <div>
                    <p className='card-content-lighter-text'>
                        <span className='card-content-bold-text'>{hours}</span> h{mins === 0 ? 'ours' : ''}
                        {mins > 0 && (
                            <>
                                {' '}
                                <span className='card-content-bold-text'>{mins}</span> min
                            </>
                        )}
                    </p>
                </div>
                <div className='progress-bar-container'>
                    <div className='progress-bar-fill' style={{ width: `${usedPercentage}%` }}/>
                </div>
            </div>
        </InformativeCard>
    )
}