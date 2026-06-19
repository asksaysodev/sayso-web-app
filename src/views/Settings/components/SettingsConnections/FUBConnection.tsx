import ConnectionItem from "./ConnectionItem";
import ManageConnectionModal from "./ManageConnectionModal";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useFUB } from "@/hooks/useFUB";
import { openExternal } from "@/utils/helpers/openExternal";
import fubIcon from '/assets/fub-icon.svg';

const FUBTile = () => (
    <div className="connection-tile connection-tile--fub">
        <img src={fubIcon} alt="Follow Up Boss" width={26} height={26} style={{ objectFit: 'contain' }} />
    </div>
);

const TITLE = "Follow Up Boss";
const DESCRIPTION = "Push call summaries and contacts into the matching lead in Follow Up Boss.";

export default function FUBConnection() {
    const [fubConnected, setFubConnected] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);
    const { globalUser, updateGlobalUser } = useAuth();
    const { disconnectFUB } = useFUB();
    const { showToast } = useToast();

    const handleConnect = () => {
        if (!globalUser) return;
        const authUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/fub/auth/${globalUser.id}`;
        try {
            openExternal(authUrl);
        } catch (error) {
            console.error('❌ [FUBConnection] Error calling openExternal:', error);
            window.location.href = authUrl;
        }
    };

    const handleDisconnect = async () => {
        if (!globalUser) return;
        setIsDisconnecting(true);
        try {
            await disconnectFUB();
            setFubConnected(false);
            await updateGlobalUser(globalUser.email);
            showToast('success', 'Follow Up Boss disconnected successfully!');
        } catch (error) {
            console.error('❌ Error disconnecting FUB:', error);
            showToast('error', 'Failed to disconnect Follow Up Boss');
        } finally {
            setIsDisconnecting(false);
        }
    };

    useEffect(() => {
        setFubConnected(globalUser?.fub_connected || false);
    }, [globalUser]);

    const oauthHandled = useRef(false);
    useEffect(() => {
        if (oauthHandled.current) return;

        const params = new URLSearchParams(window.location.search);
        const fubStatus = params.get('fub');
        if (!fubStatus) { oauthHandled.current = true; return; }

        if (fubStatus === 'connected') {
            if (!globalUser?.email) return;
            oauthHandled.current = true;
            showToast('success', 'Follow Up Boss connected!');
            updateGlobalUser(globalUser.email);
        } else {
            oauthHandled.current = true;
            if (fubStatus === 'denied') showToast('warning', 'Follow Up Boss connection cancelled.');
            else if (fubStatus === 'error') showToast('error', 'Something went wrong connecting Follow Up Boss.');
        }

        params.delete('fub');
        const next = params.toString();
        window.history.replaceState({}, '', `${window.location.pathname}${next ? `?${next}` : ''}`);
    }, [globalUser]);

    return (
        <>
            <ConnectionItem
                logoTile={<FUBTile />}
                title={TITLE}
                category="Real-estate CRM"
                description={DESCRIPTION}
                connected={fubConnected}
                handleConnection={handleConnect}
                handleManage={() => setManageOpen(true)}
            />
            <ManageConnectionModal
                open={manageOpen}
                onClose={() => setManageOpen(false)}
                logoTile={<FUBTile />}
                title={TITLE}
                description={DESCRIPTION}
                onDisconnect={handleDisconnect}
                isDisconnecting={isDisconnecting}
            />
        </>
    );
}
