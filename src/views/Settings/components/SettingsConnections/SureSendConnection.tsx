import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import ConnectionItem from "./ConnectionItem";
import ManageConnectionModal from "./ManageConnectionModal";
import SureSendConnectModal from "./SureSendConnectModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useSureSend } from "@/hooks/useSureSend";
import suresendIcon from '/assets/suresend-icon-color.svg';

const SureSendTile = () => (
    <div className="connection-tile connection-tile--suresend">
        <img src={suresendIcon} alt="SureSend" width={26} height={26} style={{ objectFit: 'contain' }} />
    </div>
);

const TITLE = "SureSend";
const DESCRIPTION = "Push call summaries and contacts into the matching lead in SureSend.";

export default function SureSendConnection() {
    const [connected, setConnected] = useState(false);
    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const { globalUser, updateGlobalUser } = useAuth();
    const { disconnectSureSend } = useSureSend();
    const { showToast } = useToast();

    useEffect(() => {
        setConnected(globalUser?.suresend_connected || false);
    }, [globalUser]);

    const handleDisconnect = async () => {
        if (!globalUser) return;
        setIsDisconnecting(true);
        try {
            await disconnectSureSend();
            setConnected(false);
            await updateGlobalUser(globalUser.email);
            showToast('success', 'SureSend disconnected successfully!');
        } catch (error) {
            Sentry.captureException(
                Object.assign(new Error('SureSend disconnect failed in UI'), {})
            );
            showToast('error', 'Failed to disconnect SureSend');
        } finally {
            setIsDisconnecting(false);
        }
    };

    return (
        <>
            <ConnectionItem
                logoTile={<SureSendTile />}
                title={TITLE}
                category="Real-estate CRM"
                description={DESCRIPTION}
                connected={connected}
                connectedMeta={globalUser?.suresend_account_name ?? undefined}
                handleConnection={() => setConnectModalOpen(true)}
                handleManage={() => setManageOpen(true)}
            />
            <SureSendConnectModal
                open={connectModalOpen}
                onClose={() => setConnectModalOpen(false)}
            />
            <ManageConnectionModal
                open={manageOpen}
                onClose={() => setManageOpen(false)}
                logoTile={<SureSendTile />}
                title={TITLE}
                description={DESCRIPTION}
                onDisconnect={handleDisconnect}
                isDisconnecting={isDisconnecting}
            />
        </>
    );
}
