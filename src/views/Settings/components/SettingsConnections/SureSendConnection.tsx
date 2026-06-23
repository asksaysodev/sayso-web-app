import { useState } from 'react';
import * as Sentry from '@sentry/react';
import ConnectionItem from "./ConnectionItem";
import SureSendConnectModal from "./SureSendConnectModal";
import ManageConnectionModal from "./ManageConnectionModal";
import SureSendTile from "./SureSendTile";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useSureSend } from "@/hooks/useSureSend";

const TITLE = "SureSend";
const CATEGORY = "Real-estate CRM";
const DESCRIPTION = "Push call summaries and contacts into the matching lead in SureSend.";

export default function SureSendConnection() {
    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const { globalUser, updateGlobalUser } = useAuth();
    const { disconnectSureSend } = useSureSend();
    const { showToast } = useToast();

    const connected = globalUser?.suresend_connected ?? false;

    const handleDisconnect = async () => {
        if (!globalUser) return;
        setIsDisconnecting(true);
        try {
            await disconnectSureSend();
            await updateGlobalUser(globalUser.email);
            showToast('success', 'SureSend disconnected successfully.');
        } catch (error: any) {
            Sentry.captureException(
                Object.assign(new Error('SureSend disconnect failed in UI'), {
                    httpStatus: error?.response?.status,
                    cause: error,
                })
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
                category={CATEGORY}
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
                category={CATEGORY}
                description={DESCRIPTION}
                accountEmail={globalUser?.suresend_account_email ?? null}
                onDisconnect={handleDisconnect}
                isDisconnecting={isDisconnecting}
            />
        </>
    );
}
