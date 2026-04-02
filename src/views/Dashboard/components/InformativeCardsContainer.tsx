import { useQuery } from "@tanstack/react-query";
import MinutesRemaining from "./MinutesRemaining";
import WeeklyActivityCard from "./WeeklyActivityCard";
import getAccountUsage from "../services/getAccountUsage";
import Tips from "./Tips";

export default function InformativeCardsContainer() {

    const { data: accountUsage, isRefetching, isLoading } = useQuery({
        queryKey: ['dashboard-account-usage'],
        queryFn: getAccountUsage,
    });

    return (
        <div className='dashboard-cards-container'>
            <Tips />

            <div className='dashboard-cards-right-column'>
                <MinutesRemaining
                    accountUsage={accountUsage!}
                    isRefetching={isRefetching}
                    isLoading={isLoading}
                />
                <WeeklyActivityCard />
            </div>
        </div>
    )
}