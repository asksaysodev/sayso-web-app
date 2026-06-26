import { useState } from "react";
import { Mail, TriangleAlert } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import SaysoButton from "@/components/SaysoButton";

interface Props {
    open: boolean;
    onClose: () => void;
    logoTile: React.ReactNode;
    title: string;
    category?: string;
    description: string;
    accountEmail?: string | null;
    onDisconnect: () => Promise<void>;
    isDisconnecting?: boolean;
}

export default function ManageConnectionModal({
    open,
    onClose,
    logoTile,
    title,
    category,
    description,
    accountEmail,
    onDisconnect,
    isDisconnecting = false,
}: Props) {
    const [confirming, setConfirming] = useState(false);

    const state = isDisconnecting ? 'disconnecting' : confirming ? 'confirm' : 'manage';

    const handleOpenChange = (next: boolean) => {
        if (next || isDisconnecting) return;
        setConfirming(false);
        onClose();
    };

    const handleConfirm = async () => {
        try {
            await onDisconnect();
        } finally {
            setConfirming(false);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="p-0 gap-0 border-0 bg-transparent shadow-none max-w-[560px] w-full">
                <div className="suresend-manage" data-state={state}>
                    <div className="ssm-manage-view">
                        <div className="ssm-pad">
                            <div className="ssm-head">
                                {logoTile}
                                <div className="ssm-head-text">
                                    <div className="ssm-head-row">
                                        <DialogTitle className="ssm-h1">{title}</DialogTitle>
                                    </div>
                                    {category && <p className="ssm-sub">{category}</p>}
                                </div>
                            </div>

                            <DialogDescription className="ssm-lede">{description}</DialogDescription>

                            {accountEmail && (
                                <div className="ssm-meta">
                                    <div className="ssm-meta-row">
                                        <span className="ssm-k"><Mail size={15} /> Linked account</span>
                                        <span className="ssm-v">{accountEmail}</span>
                                    </div>
                                </div>
                            )}

                            <div className="ssm-rule" />

                            <div className="ssm-danger">
                                <h2 className="ssm-danger-title">Disconnect</h2>
                                <p className="ssm-danger-desc">Sayso will stop sending data to {title}. Reconnecting will require you to re-authorize the app.</p>

                                <div className="ssm-danger-actions">
                                    <SaysoButton
                                        label={`Disconnect ${title}`}
                                        variant="error-outlined"
                                        size="sm"
                                        onClick={() => setConfirming(true)}
                                    />
                                </div>

                                <div className="ssm-confirm">
                                    <div className="ssm-confirm-head">
                                        <TriangleAlert /> Disconnect {title}?
                                    </div>
                                    <p className="ssm-confirm-text">Syncing stops immediately. Data already sent to {title} stays there.</p>
                                    <div className="ssm-confirm-actions">
                                        <SaysoButton
                                            label="Disconnect"
                                            variant="error-outlined"
                                            size="sm"
                                            onClick={handleConfirm}
                                            disabled={isDisconnecting}
                                            loading={isDisconnecting}
                                            loadingLabel="Disconnecting…"
                                        />
                                        <SaysoButton
                                            label="Keep connected"
                                            variant="black"
                                            size="sm"
                                            onClick={() => setConfirming(false)}
                                            disabled={isDisconnecting}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
