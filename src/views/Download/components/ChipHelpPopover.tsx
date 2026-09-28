import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function ChipHelpPopover() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className='download-link'>Not sure which chip you have?</button>
            </PopoverTrigger>
            <PopoverContent align='end' className='download-chip-help'>
                <p className='download-chip-help-title'>Find your Mac's chip</p>
                <p>
                    Open the Apple menu and choose <strong>About This Mac</strong>.
                </p>
                <ul>
                    <li><strong>Chip: Apple M…</strong> → download <strong>Apple Silicon</strong></li>
                    <li><strong>Processor: …Intel…</strong> → download <strong>Intel</strong></li>
                </ul>
            </PopoverContent>
        </Popover>
    );
}
