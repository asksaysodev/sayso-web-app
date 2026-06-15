import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { LuMapPin, LuCalendarCheck } from 'react-icons/lu';
import type { ConversationSmartCapture, ConversationPulse } from '@/types/coach';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { LPMAMA_CONFIG } from '../constants/lpmama';

const TooltipArrow = () => <TooltipPrimitive.Arrow className="fill-primary" />;

interface Props {
    insightCount: number;
    smartCaptures: ConversationSmartCapture[];
    pulse: ConversationPulse[];
    appointmentBooked: boolean | null;
}

export default function ConversationSignalsPill({ insightCount, smartCaptures, pulse, appointmentBooked }: Props) {
    const capturedTopics = new Set(smartCaptures.map(sc => sc.topic));
    const hasPulse = pulse.length > 0;
    const hasAppointment = appointmentBooked === true;
    const pulseZip = pulse[0]?.zip_code;

    return (
        <TooltipProvider delayDuration={150}>
            <div className="conv-signals">
				{
					insightCount > 0 &&
					<>
						<Tooltip>
							<TooltipTrigger asChild>
								<span className="conv-signals-count">{insightCount}</span>
							</TooltipTrigger>
							<TooltipContent>{insightCount} Cue Insights<TooltipArrow /></TooltipContent>
						</Tooltip>
						<span className="conv-signals-div" />
					</>
				}
				{
					smartCaptures.length > 0 &&
					<>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="conv-signals-letters">
									{LPMAMA_CONFIG.map((f, i) => {
										const captured = capturedTopics.has(f.key);
										return (
											<span
												key={i}
												className="conv-signals-letter"
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
							</TooltipTrigger>
							<TooltipContent>Smart Capture<TooltipArrow /></TooltipContent>
						</Tooltip>
					</>
				}
				{
					smartCaptures.length > 0 && hasPulse &&
					
					<>
						<span className="conv-signals-div" />
					</>
				}
                {hasPulse && (
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="conv-signals-icon">
                                    <LuMapPin size={13} />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>{`Market Pulse${pulseZip ? ` - ${pulseZip}` : ''}`}<TooltipArrow /></TooltipContent>
                        </Tooltip>
                    </>
                )}
                {hasAppointment && (
                    <>
                        <span className="conv-signals-div" />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="conv-signals-icon">
                                    <LuCalendarCheck size={13} />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>Appointment Booked<TooltipArrow /></TooltipContent>
                        </Tooltip>
                    </>
                )}
            </div>
        </TooltipProvider>
    );
}
