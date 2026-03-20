import { useQuery } from "@tanstack/react-query";
import MinutesRemaining from "./MinutesRemaining";
import WeeklyActivityCard from "./WeeklyActivityCard";
import getAccountUsage from "../services/getAccountUsage";

export default function InformativeCardsContainer() {

    const { data: accountUsage, isRefetching, isLoading } = useQuery({
        queryKey: ['dashboard-account-usage'],
        queryFn: getAccountUsage,
    });

    return (
        <div className='dashboard-cards-container'>
            <MinutesRemaining 
                accountUsage={accountUsage!} 
                isRefetching={isRefetching} 
                isLoading={isLoading}
            />
            <WeeklyActivityCard />
        </div>
    )
}