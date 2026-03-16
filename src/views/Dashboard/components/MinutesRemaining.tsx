import { LuHourglass } from "react-icons/lu";
import InformativeCard from "./InformativeCard";
import { useAuth } from "../../../context/AuthContext";
import formatMinutesToDuration from "@/utils/formatters/formatMinutesToDuration";
import { useMemo } from "react";
import { TimeWidgetsSharedProps } from "../types";

export default function MinutesRemaining({ accountUsage, isRefetching, isLoading = false }: TimeWidgetsSharedProps) {
    const { globalUser } = useAuth();

    const { remainingMinutes = 0, planMinutes = 0 } = accountUsage || {};

    const isTrialing = globalUser?.subscription_status === "trialing";
    const planHours = Math.floor(planMinutes / 60);
    const cardDescription = `${planHours} ${isTrialing ? 'trial' : 'plan'} hour${planHours > 1 ? 's' : ''}`;
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
            </div>
        </InformativeCard>
    )
}