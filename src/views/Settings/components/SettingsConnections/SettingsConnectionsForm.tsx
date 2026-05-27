import FUBConnection from './FUBConnection';
import './connections.css';

const RequestIntegrationCard = () => (
    <div className="connection-card connection-card--request">
        <div className="connection-card-top">
            <div className="connection-request-tile">
                <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M10 6v4m0 4h.01" />
                </svg>
            </div>
            <div className="connection-card-top-info">
                <div className="connection-card-name">Don't see your integration?</div>
                <div className="connection-card-cat">Request it</div>
            </div>
        </div>
        <p className="connection-card-desc">
            More integrations are on the way. Reach out to your account manager to request one.
        </p>
    </div>
);

export default function SettingsConnectionsForm() {
    return (
        <div className="connections-grid">
            <FUBConnection />
            <RequestIntegrationCard />
        </div>
    );
}
