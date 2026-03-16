import { useQuery } from "@tanstack/react-query";
import MinutesRemaining from "./MinutesRemaining";
import MinutesUsedCard from "./MinutesUsedCard";
import WeeklyActivityCard from "./WeeklyActivityCard";
import getAccountUsage from "../services/getAccountUsage";

export default function InformativeCardsContainer() {

    const { data: accountUsage, isRefetching, isLoading } = useQuery({
        queryKey: ['dashboard-account-usage'],
        queryFn: getAccountUsage,
    });

    return (
        <div className='dashboard-cards-container'>
            <MinutesUsedCard 
                accountUsage={accountUsage!} 
                isRefetching={isRefetching} 
                isLoading={isLoading}
            />
            <MinutesRemaining 
                accountUsage={accountUsage!} 
                isRefetching={isRefetching} 
                isLoading={isLoading}
            />
            <WeeklyActivityCard />
        </div>
    )
}