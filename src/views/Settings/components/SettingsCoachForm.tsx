import { useState } from 'react';
import { LuCircleHelp } from 'react-icons/lu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function SettingsCoachForm() {
    const [bufferTime, setBufferTime] = useState(0);

    return (
        <div className='settings-coach'>
            <div className='settings-coach-setting-item'>
                <div className='settings-coach-setting-header'>
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
                    <span className='settings-coach-range-value'>{bufferTime}s</span>
                </div>
                <input
                    type='range'
                    min={0}
                    max={30}
                    step={5}
                    value={bufferTime}
                    onChange={e => setBufferTime(Number(e.target.value))}
                    className='settings-coach-range'
                />
            </div>
        </div>
    )
}
