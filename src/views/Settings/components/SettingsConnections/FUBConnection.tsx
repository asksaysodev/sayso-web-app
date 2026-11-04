import { Button } from "@/components/ds/Button";
import { Badge } from "@/components/ds/Badge";
import SettingsCard from "../SettingsCard";
import ManageConnectionModal from "./ManageConnectionModal";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useFUB } from "@/hooks/useFUB";
import { openExternal } from "@/utils/helpers/openExternal";
import CrmProviderTile from "@/components/crm/CrmProviderTile";
import { getProvider } from "@/hooks/integrations/crm/providers/registry";

const FUBTile = () => <CrmProviderTile providerId="fub" />;

const TITLE = getProvider("fub").label;
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

    // Handles the OAuth callback's ?fub=connected|denied|error once, then drops the param through the router
    // (history.replaceState would leave the router's copy behind and bring it back on the next tab change).
    const [searchParams, setSearchParams] = useSearchParams();
    const fubStatus = searchParams.get('fub');
    const oauthHandled = useRef(false);
    useEffect(() => {
        if (oauthHandled.current || !fubStatus) return;

        if (fubStatus === 'connected') {
            if (!globalUser?.email) return;
            showToast('success', 'Follow Up Boss connected!');
            updateGlobalUser(globalUser.email);
        } else if (fubStatus === 'denied') {
            showToast('warning', 'Follow Up Boss connection cancelled.');
        } else if (fubStatus === 'error') {
            showToast('error', 'Something went wrong connecting Follow Up Boss.');
        }
        oauthHandled.current = true;

        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.delete('fub');
                return next;
            },
            { replace: true },
        );
    }, [fubStatus, globalUser, showToast, updateGlobalUser, setSearchParams]);

    return (
        <>
            <SettingsCard
                tile={<FUBTile />}
                title={TITLE}
                detail="Real-estate CRM"
                description={DESCRIPTION}
                status={fubConnected && <Badge tone="success">Connected</Badge>}
                action={fubConnected ? (
                    <Button variant='secondary' onClick={() => setManageOpen(true)}>Manage</Button>
                ) : (
                    <Button onClick={handleConnect}>Connect</Button>
                )}
            />
            <ManageConnectionModal
                open={manageOpen}
                onClose={() => setManageOpen(false)}
                logoTile={<FUBTile />}
                title={TITLE}
                category="Real-estate CRM"
                description={DESCRIPTION}
                onDisconnect={handleDisconnect}
                isDisconnecting={isDisconnecting}
            />
        </>
    );
}
