import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Sheet } from '@/components/ds/Sheet';
import SidebarContent from './SidebarContent';
import './Sidebar.css';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function MobileSidebar({ open, onOpenChange }: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange} side='left' className='mobile-sidebar'>
            <DialogPrimitive.Title className='sidebar__sr-only'>Navigation</DialogPrimitive.Title>
            <SidebarContent hideLaunchCoach onNavigate={() => onOpenChange(false)} />
        </Sheet>
    );
}
