import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ButtonSpinner from '@/components/ButtonSpinner';
import { isMobileViewport } from '../utils/isMobileViewport';

interface Props {
    siliconUrl: string | null;
    intelUrl: string | null;
    isLoading: boolean;
    onDownload: (url: string) => void;
    onMobileClick: () => void;
}

export default function MacDownloadMenu({ siliconUrl, intelUrl, isLoading, onDownload, onMobileClick }: Props) {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (next: boolean) => {
        if (next && isMobileViewport()) {
            onMobileClick();
            return;
        }
        setOpen(next);
    };

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild disabled={isLoading || (!siliconUrl && !intelUrl)}>
                <button className='download-btn'>
                    Download
                    {isLoading ? <ButtonSpinner /> : <ChevronDown size={20} />}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='download-mac-menu'>
                <DropdownMenuItem disabled={!siliconUrl} onSelect={() => siliconUrl && onDownload(siliconUrl)}>
                    Apple Silicon
                </DropdownMenuItem>
                <DropdownMenuItem disabled={!intelUrl} onSelect={() => intelUrl && onDownload(intelUrl)}>
                    Intel
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
