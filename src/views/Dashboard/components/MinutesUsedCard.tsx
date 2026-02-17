import { LuClock } from "react-icons/lu";
import InformativeCard from "./InformativeCard";
import { useMemo } from "react";
import { AccountUsage } from "@/types/user";

interface Props {
    accountUsage: AccountUsage;
    isRefetching: boolean;
}

export default function MinutesUsedCard({ accountUsage, isRefetching }: Props) {
    const { usedMinutes = 0, planMinutes = 0 } = accountUsage || {};

    const usedPercentage = useMemo(() => {
        if (planMinutes === 0) return 0;
        const percentage = (usedMinutes / planMinutes) * 100;
        return Math.min(Number(percentage.toFixed(2)), 100);
    }, [usedMinutes, planMinutes]);

    return (
        <InformativeCard
            icon={<LuClock />}
            title={'Minutes Used'}
            description={'Total AI Coach time this billing period'}
            isLoading={isRefetching}
        >
            <div className='card-content-container'>
                <div>
                    <p className='card-content-lighter-text'>
                        <span className='card-content-bold-text'>{usedMinutes}</span> / {planMinutes} min ({usedPercentage}%)
                    </p>
                </div>
                <div className='progress-bar-container'>
                    <div className='progress-bar-fill' style={{ width: `${usedPercentage}%` }}/>
                </div>
            </div>
        </InformativeCard>
    )
}