import { LuLoader } from "react-icons/lu";

const ArrowIcon = () => (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8h10m-4-4 4 4-4 4" />
    </svg>
);

interface Props {
    logoTile: React.ReactNode;
    title: string;
    category: string;
    description: string;
    loading?: boolean;
    connected: boolean;
    connectedMeta?: string;
    handleConnection: () => void;
    handleManage?: () => void;
}

export default function ConnectionItem({
    logoTile,
    title,
    category,
    description,
    loading = false,
    connected,
    connectedMeta,
    handleConnection,
    handleManage,
}: Props) {
    return (
        <div className="connection-card">
            <div className="connection-card-top">
                {logoTile}
                <div className="connection-card-top-info">
                    <div className="connection-card-name">{title}</div>
                    <div className="connection-card-cat">{category}</div>
                </div>
                {connected && (
                    <span className="connection-status connection-status--connected">
                        <span className="connection-status-dot" />
                        Connected
                    </span>
                )}
            </div>

            <p className="connection-card-desc">{description}</p>

            <div className="connection-card-foot">
                {connected ? (
                    <>
                        {connectedMeta ? (
                            <span className="connection-meta">
                                <span className="connection-meta-hash">{connectedMeta}</span>
                            </span>
                        ) : <span />}
                        <button className="connection-btn" onClick={handleManage}>
                            Manage
                            <span className="connection-btn-arr"><ArrowIcon /></span>
                        </button>
                    </>
                ) : (
                    <>
                        <span className="connection-status connection-status--disconnected"></span>
                        <button
                            className="connection-btn connection-btn--primary"
                            onClick={handleConnection}
                            disabled={loading}
                        >
                            Connect
                            <span className="connection-btn-arr">
                                {loading ? <LuLoader className="loading-icon" /> : <ArrowIcon />}
                            </span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
