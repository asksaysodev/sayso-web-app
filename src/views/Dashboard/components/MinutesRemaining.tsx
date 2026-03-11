import { LuHourglass } from "react-icons/lu";
import InformativeCard from "./InformativeCard";
import { useAuth } from "../../../context/AuthContext";
import { AccountUsage } from "@/types/user";
import formatMinutesToDuration from "@/utils/formatters/formatMinutesToDuration";
import { useMemo } from "react";

interface Props {
    accountUsage: AccountUsage;
    isRefetching: boolean;
}

export default function MinutesRemaining({ accountUsage, isRefetching }: Props) {
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
            isLoading={isRefetching}
        >
            <div className='card-content-container'>
                <div>
                    <p className='card-content-lighter-text'>
                        <span className='card-content-bold-text'>{hours}</span> h
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