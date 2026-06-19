import { useEffect, useState } from 'react';
import ConnectionItem from "./ConnectionItem";
import SureSendConnectModal from "./SureSendConnectModal";
import SureSendManageModal from "./SureSendManageModal";
import { useAuth } from "@/context/AuthContext";
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

    const { globalUser } = useAuth();

    useEffect(() => {
        setConnected(globalUser?.suresend_connected || false);
    }, [globalUser]);

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
            <SureSendManageModal
                open={manageOpen}
                onClose={() => setManageOpen(false)}
                onReconnect={() => { setManageOpen(false); setConnectModalOpen(true); }}
            />
        </>
    );
}
