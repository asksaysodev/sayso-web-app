import { useState } from "react";
import { LuBellRing, LuX } from "react-icons/lu";
import { Drawer, DrawerContent, DrawerPortal } from '@/components/ui/drawer';
import SaysoButton from "../SaysoButton";

export function NotificationBottomSheet({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true);

    return (
        <Drawer open={open} onOpenChange={setOpen} defaultOpen>
            <DrawerPortal>
                <DrawerContent className='nw-mobile-drawer rounded-t-[14px] border-0 bg-white mt-0 max-h-[85vh]'>

                    <div className='nw-header'>
                        <div className='nw-header-left-container'>
                            <span className='nw-header-title'>Notification's Title</span>
                            <span className='nw-header-description'>Check out how the released feature works!</span>
                        </div>
                        <div className='nw-header-actions'>
                            <button className='nw-header-btn' onClick={() => setOpen(false)}>
                                <LuX />
                            </button>
                        </div>
                    </div>

                    <div className='nw-mobile-content-container'>
                        <div className='nw-content nw-mobile-content'>
                            {children}
                        </div>
                    </div>

                    <div className='nw-footer'>
                        <SaysoButton
                            label='Remind Me Later'
                            icon={<LuBellRing />}
                            variant='outlined'
                            fullWidth
                        />
                    </div>

                </DrawerContent>
            </DrawerPortal>
        </Drawer>
    );
}