import FUBConnection from './FUBConnection';
import './connections.css';
import { useAuth } from '../../../../context/AuthContext';
import { openExternal } from '../../../../utils/helpers/openExternal';
import SureSendConnection from './SureSendConnection';

const ArrowIcon = () => (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8h10m-4-4 4 4-4 4" />
    </svg>
);

function RequestIntegrationCard() {
    const { globalUser } = useAuth();
    const subjectValue = encodeURIComponent(`Sayso Integration Request - ${globalUser?.email ?? '{user email}'}`);
    const bodyValue = encodeURIComponent(`Which integration would you like Sayso to support? Any details about your use case will help us prioritize.`);

    return (
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
            <div className="connection-card-foot">
                <span />
                <button
                    className="connection-btn connection-btn--ghost"
                    onClick={() => openExternal(`mailto:support@asksayso.com?subject=${subjectValue}&body=${bodyValue}`)}
                >
                    Request
                    <span className="connection-btn-arr"><ArrowIcon /></span>
                </button>
            </div>
        </div>
    );
}

export default function SettingsConnectionsForm() {
    return (
        <div className="connections-grid">
            <FUBConnection />
            <SureSendConnection />
            <RequestIntegrationCard />
        </div>
    );
}
