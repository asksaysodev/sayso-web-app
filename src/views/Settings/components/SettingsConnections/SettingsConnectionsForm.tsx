import { CircleHelp } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { useAuth } from '@/context/AuthContext';
import { openExternal } from '@/utils/helpers/openExternal';
import SettingsCard, { SettingsCardTile } from '../SettingsCard';
import FUBConnection from './FUBConnection';
import SureSendConnection from './SureSendConnection';
import './connections.css';

function RequestIntegrationCard() {
    const { globalUser } = useAuth();
    const subjectValue = encodeURIComponent(`Sayso Integration Request - ${globalUser?.email ?? '{user email}'}`);
    const bodyValue = encodeURIComponent(`Which integration would you like Sayso to support? Any details about your use case will help us prioritize.`);

    return (
        <SettingsCard
            tile={
                <SettingsCardTile>
                    <CircleHelp size={24} aria-hidden />
                </SettingsCardTile>
            }
            title="Don't see your integration?"
            detail='Request it'
            description='More integrations are on the way. Reach out to your account manager to request one.'
            action={
                <Button
                    variant='secondary'
                    onClick={() => openExternal(`mailto:support@asksayso.com?subject=${subjectValue}&body=${bodyValue}`)}
                >
                    Request
                </Button>
            }
        />
    );
}

export default function SettingsConnectionsForm() {
    return (
        <div className='settings-cards-grid'>
            <FUBConnection />
            <SureSendConnection />
            <RequestIntegrationCard />
        </div>
    );
}
