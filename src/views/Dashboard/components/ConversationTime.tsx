import { LuPhone } from "react-icons/lu";
import InformativeCard from "./InformativeCard";
import formatConversationTime from "@/utils/formatters/formatConversationTime";
import { useMemo } from "react";
import { ConversationTimeProps } from "../types";

export default function ConversationTime({ totalMinutes = 0, isRefetching, isLoading = false }: ConversationTimeProps) {
    const formattedTime = useMemo(() => formatConversationTime(totalMinutes), [totalMinutes]);

    return (
        <InformativeCard
            icon={<LuPhone />}
            title={'Conversation time'}
            description={'Total conversation time with Sayso over the last 30 days'}
            isLoading={isRefetching || isLoading}
        >
            <div className='card-content-container'>
                <div>
                    <p className='card-content-lighter-text'>
                        <span className='card-content-bold-text'>{formattedTime}</span>
                    </p>
                </div>
            </div>
        </InformativeCard>
    )
}
