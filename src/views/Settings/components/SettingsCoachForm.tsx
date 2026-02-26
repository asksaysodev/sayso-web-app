import { useState, useEffect, useRef, useEffectEvent } from 'react';
import { LuCircleHelp } from 'react-icons/lu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useSettingsCoach from '../hooks/useSettingsCoach';
import useDebounce from '@/hooks/useDebounce';

export default function SettingsCoachForm() {
    const [bufferTime, setBufferTime] = useState<number | undefined>(undefined);
    const { coachSettings, mutateBufferTime } = useSettingsCoach();
    const serverValue = useRef<number | undefined>(undefined);
    const debouncedBufferTime = useDebounce(bufferTime, 1500);

    const updateBufferTime = useEffectEvent((ms: number) => {
        const seconds = ms / 1000;
        serverValue.current = seconds;
        setBufferTime(seconds);
    });

    useEffect(() => {
        if (coachSettings?.insight_buffer_time_ms !== undefined) {
            updateBufferTime(coachSettings.insight_buffer_time_ms);
        }
    }, [coachSettings]);

    useEffect(() => {
        if (debouncedBufferTime === undefined || debouncedBufferTime === serverValue.current) return;
        mutateBufferTime(debouncedBufferTime);
    }, [debouncedBufferTime]);

    return (
        <div className='settings-coach'>
            <div className='settings-coach-setting-item'>
                <div className='settings-coach-setting-left'>
                    <div className='settings-coach-setting-label-row'>
                        <span className='settings-coach-setting-label'>Buffer Time</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className='settings-coach-info-btn'>
                                        <LuCircleHelp size={14} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side='top' className='settings-coach-tooltip'>
                                    Choose how long to wait after the call starts before Sayso shows insights. Set to 0 for immediate coaching. Keep in mind insights will be generated when the engine detects a relevant moment in the conversation.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className='settings-coach-setting-description'>How long to wait after the call starts before Sayso begins showing insights.</p>
                </div>
                <div className='settings-coach-setting-right'>
                    <div className='settings-coach-range-row'>
                        <input
                            type='range'
                            min={0}
                            max={30}
                            step={1}
                            value={bufferTime ?? 0}
                            onChange={e => setBufferTime(Number(e.target.value))}
                            className='settings-coach-range'
                        />
                        <span className='settings-coach-range-value'>{bufferTime ?? 0}s</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
