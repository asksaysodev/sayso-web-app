import { useState, useEffect } from "react";
import { LuBellRing, LuX, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Drawer, DrawerContent, DrawerPortal } from '@/components/ui/drawer';
import SaysoButton from "../SaysoButton";
import { DialogTitle } from "@/components/ui/dialog";
import NotificationContent from "./components/NotificationContent";
import { CreatedNotification } from "@/views/Admin/types";

interface Props {
    notification: CreatedNotification;
    currentIndex: number;
    total: number;
    onDismiss: () => void;
    onRemindLater: () => void;
    onPrev: () => void;
    onNext: () => void;
    readOnly?: boolean;
}

export function NotificationBottomSheet({ notification, currentIndex, total, onDismiss, onRemindLater, onPrev, onNext, readOnly = false }: Props) {
    const [open, setOpen] = useState(false);

    // not the best to do here. but is it in order to trigger the animation to happen.
    useEffect(() => { 
        setOpen(true);
    }, []);

    const handleDismiss = () => {
        setOpen(false);
        onDismiss();
    };

    return (
        <Drawer open={open} onOpenChange={setOpen} dismissible={false}>
            <DrawerPortal>
                <DrawerContent className='nw-mobile-drawer rounded-t-[14px] border-0 bg-white mt-0 max-h-[85vh]'>

                    <div className='nw-header'>
                        <div className='nw-header-left-container'>
                            <DialogTitle className='nw-header-title'>{notification.title}</DialogTitle>
                            {notification.description && (
                                <span className='nw-header-description'>{notification.description}</span>
                            )}
                        </div>
                        <div className='nw-header-actions'>
                            <button className='nw-header-btn' onClick={handleDismiss}>
                                <LuX />
                            </button>
                        </div>
                    </div>

                    <div className='nw-mobile-content-container'>
                        <NotificationContent notification={notification} />
                    </div>

                    {!readOnly && <div className='nw-footer'>
                        {notification.remindable && (
                            <SaysoButton
                                label='Remind Me Later'
                                icon={<LuBellRing />}
                                variant='outlined'
                                fullWidth
                                onClick={onRemindLater}
                            />
                        )}
                        {total > 1 && (
                            <div className='nw-pagination'>
                                <button
                                    className='nw-pagination-btn'
                                    onClick={onPrev}
                                    disabled={currentIndex === 0}
                                >
                                    <LuChevronLeft />
                                </button>
                                <span className='nw-pagination-counter'>{currentIndex + 1} / {total}</span>
                                <button
                                    className='nw-pagination-btn'
                                    onClick={onNext}
                                    disabled={currentIndex === total - 1}
                                >
                                    <LuChevronRight />
                                </button>
                            </div>
                        )}
                    </div>}

                </DrawerContent>
            </DrawerPortal>
        </Drawer>
    );
}
