import { ConversationSmartCapture } from '@/types/coach';
import { LPMAMA_CONFIG } from '../constants/lpmama';

interface Props {
    smartCaptures: ConversationSmartCapture[];
}

export default function LpmamaMeter({ smartCaptures }: Props) {
    const capturedTopics = new Set(smartCaptures.map(sc => sc.topic));
    const count = LPMAMA_CONFIG.filter(f => capturedTopics.has(f.key)).length;

    return (
        <div className="conv-meter" title={`${count} of ${LPMAMA_CONFIG.length} captured`}>
            <span className="conv-meter-count">{count}</span>
            <span className="conv-meter-div" />
            <div className="conv-meter-letters">
                {LPMAMA_CONFIG.map((f, i) => {
                    const captured = capturedTopics.has(f.key);
                    return (
                        <span
                            key={i}
                            className="conv-meter-letter"
                            title={`${f.label}${captured ? '' : ' — not captured'}`}
                            style={{
                                color: captured ? f.color : '#b9bfc9',
                                background: captured ? `${f.color}14` : 'transparent',
                                borderColor: captured ? `${f.color}33` : '#e7e9ee',
                            }}
                        >
                            {f.letter}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
