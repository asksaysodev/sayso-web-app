import dayjs from 'dayjs';
import { ConversationInsight } from '@/types/coach';
import { InsightRating } from '../../../../types';
import useUpdateConversationInsight from '../../hooks/useUpdateConversationInsight';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

interface Props {
    insights: ConversationInsight[];
}

export default function CueTab({ insights }: Props) {
    const { updateInsightRating } = useUpdateConversationInsight();

    if (insights.length === 0) {
        return <div className="conv-cue-empty">No coaching insights recorded for this conversation.</div>;
    }

    const handleRate = (insightId: string, currentRating: InsightRating, newRating: InsightRating) => {
        const nextRating = currentRating === newRating ? null : newRating;
        updateInsightRating({ insightId, rating: nextRating });
    };

    return (
        <div className="conv-cue-list">
            {insights.map(insight => {
                const rating = insight.rating as InsightRating;
                return (
                    <div key={insight.id} className="conv-cue-row">
                        <span className="conv-cue-time">{dayjs(insight.created_at).format('h:mm A')}</span>
                        <span className="conv-cue-text">{insight.message}</span>
                        <div className="conv-cue-fb">
                            <button
                                className={`conv-fb-btn${rating === 'up' ? ' conv-fb-btn-up' : ''}`}
                                onClick={() => handleRate(insight.id, rating, 'up')}
                                aria-label="Thumbs up"
                            >
                                <ThumbsUp size={16}/>
                            </button>
                            <button
                                className={`conv-fb-btn${rating === 'down' ? ' conv-fb-btn-down' : ''}`}
                                onClick={() => handleRate(insight.id, rating, 'down')}
                                aria-label="Thumbs down"
                            >
                                <ThumbsDown size={16}/>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
