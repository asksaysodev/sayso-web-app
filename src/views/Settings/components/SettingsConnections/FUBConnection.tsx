import ConnectionItem from "./ConnectionItem";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import fubIcon from '/assets/fub-icon.svg';

const FUBTile = () => (
    <div className="connection-tile connection-tile--fub">
        <img src={fubIcon} alt="Follow Up Boss" width={26} height={26} style={{ objectFit: 'contain' }} />
    </div>
);

export default function FUBConnection() {
    const [fubConnected, setFubConnected] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { globalUser } = useAuth();
    const { showToast } = useToast();

    const handleConnect = async () => {};

    useEffect(() => {
        // setFubConnected(globalUser?.fub_connected || false);
    }, [globalUser]);

    return (
        <ConnectionItem
            logoTile={<FUBTile />}
            title="Follow Up Boss"
            category="Real-estate CRM"
            description="Push call summaries and contacts into the matching lead in Follow Up Boss."
            loading={isLoading}
            connected={fubConnected}
            handleConnection={handleConnect}
        />
    );
}
