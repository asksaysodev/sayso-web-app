import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isMobileViewport } from '../utils/isMobileViewport';

interface Props {
    siliconUrl: string | null;
    intelUrl: string | null;
    onDownload: (url: string) => void;
    onMobileClick: () => void;
}

/** Rendered once the release has loaded (the modal shows a skeleton button until then). */
export default function MacDownloadMenu({ siliconUrl, intelUrl, onDownload, onMobileClick }: Props) {
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
            <DropdownMenuTrigger asChild disabled={!siliconUrl && !intelUrl}>
                <button className='download-btn'>
                    Download
                    <ChevronDown size={20} />
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
