import { PageHeader } from '@/components/ds/PageHeader';
import Conversations from './components/Conversations';
import './Conversations.css';

export default function ConversationsPage() {
    return (
        <main className='conversations-page'>
            <PageHeader
                title='Conversations'
                description='Review your calls: summaries, cues, smart captures and market pulse.'
            />
            <Conversations />
        </main>
    );
}
