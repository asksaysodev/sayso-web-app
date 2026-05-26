import { openExternal } from "@/utils/helpers/openExternal";
import ConnectionItem from "./ConnectionItem";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSlack } from "@/hooks/useSlack";
import { useToast } from "@/context/ToastContext";
import slackIcon from '/assets/slack-icon.png';

const SlackTile = () => (
    <div className="connection-tile connection-tile--slack">
        <img src={slackIcon} alt="Slack" width={26} height={26} style={{ objectFit: 'contain' }} />
    </div>
);

export default function SlackConnection() {
    const [slackConnected, setSlackConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { globalUser, updateGlobalUser } = useAuth();
    const { disconnectSlack } = useSlack();
    const { showToast } = useToast();

    const handleConnect = async () => {
        if (!globalUser) return;
        const authUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/slack/auth/${globalUser.id}`;
        try {
            openExternal(authUrl);
        } catch (error) {
            console.error('❌ [SlackConnection] Error calling openExternal:', error);
            window.location.href = authUrl;
        }
    };

    const handleDisconnect = async () => {
        if (!globalUser) return;
        setIsLoading(true);
        await disconnectSlack(globalUser.id);
        setSlackConnected(false);
        setIsLoading(false);
        updateGlobalUser(globalUser.email);
        showToast('success', 'Slack disconnected successfully!');
    };

    useEffect(() => {
        setSlackConnected(globalUser?.slack_connected || false);
    }, [globalUser]);

    return (
        <ConnectionItem
            logoTile={<SlackTile />}
            title="Slack"
            category="Communication"
            description="Get call summaries delivered directly to your Slack channel."
            loading={isLoading}
            connected={slackConnected}
            handleConnection={handleConnect}
        />
    );
}
