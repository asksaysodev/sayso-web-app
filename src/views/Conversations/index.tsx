import { PageHeader } from '@/components/ds/PageHeader';
import useIsTeamAdmin from '@/hooks/useIsTeamAdmin';
import Conversations from './components/Conversations';
import './Conversations.css';

export default function ConversationsPage() {
    // Owners, admins and superadmins of a team account see the whole company's calls.
    const isTeamAdmin = useIsTeamAdmin();

    return (
        <main className='conversations-page'>
            <PageHeader
                title='Conversations'
                description={`Review your ${isTeamAdmin ? 'company ' : ''}calls: summaries, cues, smart captures and market pulse.`}
            />
            <Conversations />
        </main>
    );
}
