import FUBConnection from './FUBConnection';
import SlackConnection from './SlackConnection';
import './connections.css';

export default function SettingsConnectionsForm() {
    return (
        <div className="connections-grid">
            <SlackConnection />
            <FUBConnection />
        </div>
    );
}
