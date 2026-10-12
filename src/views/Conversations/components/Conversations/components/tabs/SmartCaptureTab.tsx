import { ConversationSmartCapture } from '@/types/coach';
import { LPMAMA_CONFIG, CAPTURE_DISPLAY_ORDER } from '../../constants/lpmama';

interface Props {
    smartCaptures: ConversationSmartCapture[];
}

export default function SmartCaptureTab({ smartCaptures }: Props) {
    const byTopic = Object.fromEntries(smartCaptures.map(sc => [sc.topic, sc.content]));
    const fieldByKey = Object.fromEntries(LPMAMA_CONFIG.map(f => [f.key, f]));

    return (
        <div className="conv-sc-grid">
            {CAPTURE_DISPLAY_ORDER.map(key => {
                const field = fieldByKey[key];
                const value = byTopic[key];
                return (
                    <div key={key} className={`conv-sc-card${value ? '' : ' conv-sc-empty'}`}>
                        <div className="conv-sc-head">
                            <span
                                className="conv-sc-badge"
                                style={{ background: value ? field.color : '#c2c8d2' }}
                            >
                                {field.letter}
                            </span>
                            <span className="conv-sc-label">{field.label}</span>
                        </div>
                        <div className="conv-sc-val">{value || 'Not captured'}</div>
                    </div>
                );
            })}
        </div>
    );
}
