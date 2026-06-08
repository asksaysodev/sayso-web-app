import { LuMapPin, LuCalendarCheck } from 'react-icons/lu';
import type { ConversationSmartCapture, ConversationPulse } from '@/types/coach';
import { LPMAMA_CONFIG } from '../constants/lpmama';

interface Props {
    smartCaptures: ConversationSmartCapture[];
    pulse: ConversationPulse[];
    appointmentBooked: boolean | null;
}

export default function ConversationSignalsPill({ smartCaptures, pulse, appointmentBooked }: Props) {
    const capturedTopics = new Set(smartCaptures.map(sc => sc.topic));
    const count = LPMAMA_CONFIG.filter(f => capturedTopics.has(f.key)).length;
    const hasPulse = pulse.length > 0;
    const hasAppointment = appointmentBooked === true;

    return (
        <div className="conv-signals" title={`${count} of ${LPMAMA_CONFIG.length} LPMAMA fields captured`}>
			{
				count > 0 &&
				<>
					<span className="conv-signals-count">{count}</span>
					<span className="conv-signals-div" />
				</>
			}
            <div className="conv-signals-letters">
                {LPMAMA_CONFIG.map((f, i) => {
                    const captured = capturedTopics.has(f.key);
                    return (
                        <span
                            key={i}
                            className="conv-signals-letter"
                            title={`${f.label}${captured ? '' : ' — not captured'}`}
                            style={{ 
								color: captured ? 'var(--sayso-indigo)' : 'var(--sayso-indigo-washed)',
								fontWeight: captured ? '700' : '400'
							}}
                        >
                            {f.letter}
                        </span>
                    );
                })}
            </div>
            {hasPulse && (
                <>
                    <span className="conv-signals-div" />
                    <span className="conv-signals-icon" title="Market data available">
                        <LuMapPin size={13} />
                    </span>
                </>
            )}
            {hasAppointment && (
                <>
                    <span className="conv-signals-div" />
                    <span className="conv-signals-icon" title="Appointment booked">
                        <LuCalendarCheck size={13} />
                    </span>
                </>
            )}
        </div>
    );
}
