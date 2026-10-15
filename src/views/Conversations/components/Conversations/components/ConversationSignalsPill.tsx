import clsx from 'clsx';
import { PiCalendarCheck, PiMapPin } from 'react-icons/pi';
import type { ConversationSmartCapture, ConversationPulse } from '@/types/coach';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { LPMAMA_CONFIG } from '../constants/lpmama';
import TooltipArrow from './ConversationSignalsTooltipArrow';

interface Props {
    smartCaptures: ConversationSmartCapture[];
    pulse: ConversationPulse[];
    appointmentBooked: boolean | null;
}

export default function ConversationSignalsPill({ smartCaptures, pulse, appointmentBooked }: Props) {
    const capturedTopics = new Set(smartCaptures.map(sc => sc.topic));
    const hasPulse = pulse.length > 0;
    const hasAppointment = appointmentBooked === true;
    const pulseZip = pulse[0]?.zip_code;

    return (
        <TooltipProvider delayDuration={150}>
            <div className="conv-signals">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="conv-signals-group">
                            {LPMAMA_CONFIG.map((field) => (
                                <span
                                    key={field.key}
                                    className={clsx('conv-signals-item', capturedTopics.has(field.key) && 'conv-signals-item--on')}
                                >
                                    {field.letter}
                                </span>
                            ))}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>Smart Capture<TooltipArrow /></TooltipContent>
                </Tooltip>
                <div className="conv-signals-group">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className={clsx('conv-signals-item', hasPulse && 'conv-signals-item--on')}>
                                <PiMapPin size={16} />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {hasPulse ? `Market Pulse${pulseZip ? ` - ${pulseZip}` : ''}` : 'No Market Pulse'}
                            <TooltipArrow />
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className={clsx('conv-signals-item', hasAppointment && 'conv-signals-item--on')}>
                                <PiCalendarCheck size={16} />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {hasAppointment ? 'Appointment Booked' : 'No Appointment'}
                            <TooltipArrow />
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
}
