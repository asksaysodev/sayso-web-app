import { useState } from "react";
import { LuLoader } from "react-icons/lu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface Props {
    open: boolean;
    onClose: () => void;
    logoTile: React.ReactNode;
    title: string;
    description: string;
    onDisconnect: () => Promise<void>;
    isDisconnecting?: boolean;
}

export default function ManageConnectionModal({
    open,
    onClose,
    logoTile,
    title,
    description,
    onDisconnect,
    isDisconnecting = false,
}: Props) {
    const [confirming, setConfirming] = useState(false);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            if (isDisconnecting) return;
            setConfirming(false);
            onClose();
        }
    };

    const handleConfirm = async () => {
        await onDisconnect();
        setConfirming(false);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="manage-connection-modal">
                <DialogHeader>
                    <div className="manage-connection-modal-head">
                        {logoTile}
                        <div className="manage-connection-modal-head-info">
                            <DialogTitle className="manage-connection-modal-title">{title}</DialogTitle>
                            <span className="connection-status connection-status--connected">
                                <span className="connection-status-dot" />
                                Connected
                            </span>
                        </div>
                    </div>
                    <DialogDescription className="manage-connection-modal-desc">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="manage-connection-modal-section">
                    <h3 className="manage-connection-modal-section-title">Disconnect</h3>
                    <p className="manage-connection-modal-section-desc">
                        Sayso will stop sending data to {title}. Reconnecting will require you to re-authorize the app.
                    </p>

                    {!confirming ? (
                        <button
                            type="button"
                            className="connection-btn connection-btn--danger"
                            onClick={() => setConfirming(true)}
                        >
                            Disconnect
                        </button>
                    ) : (
                        <div className="manage-connection-modal-confirm">
                            <span className="manage-connection-modal-confirm-prompt">Are you sure?</span>
                            <div className="manage-connection-modal-confirm-actions">
                                <button
                                    type="button"
                                    className="connection-btn"
                                    onClick={() => setConfirming(false)}
                                    disabled={isDisconnecting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="connection-btn connection-btn--danger"
                                    onClick={handleConfirm}
                                    disabled={isDisconnecting}
                                >
                                    {isDisconnecting ? <LuLoader className="loading-icon" /> : 'Yes, disconnect'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
