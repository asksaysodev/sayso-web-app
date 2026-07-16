import { useQuery } from "@tanstack/react-query";
import ConversationTime from "./ConversationTime";
import WeeklyActivityCard from "./WeeklyActivityCard";
import getConversationTime from "@/services/getConversationTime";
import Tips from "./Tips";

export default function InformativeCardsContainer() {

    const { data: conversationTime, isRefetching, isLoading } = useQuery({
        queryKey: ['dashboard-conversation-time'],
        queryFn: getConversationTime,
    });

    return (
        <div className='dashboard-cards-container'>
            <Tips />

            <div className='dashboard-cards-right-column'>
                <ConversationTime
                    totalMinutes={conversationTime?.totalMinutes ?? 0}
                    isRefetching={isRefetching}
                    isLoading={isLoading}
                />
                <WeeklyActivityCard />
            </div>
        </div>
    )
}
