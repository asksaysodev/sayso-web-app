import { useState } from 'react';
import { ConversationItem } from '@/types/coach';
import { getProvider } from '@/hooks/integrations/crm/providers/registry';
import { LPMAMA_CONFIG, CAPTURE_DISPLAY_ORDER } from '../../constants/lpmama';
import useUpdateSmartCaptures from '../../hooks/useUpdateSmartCaptures';
import LpmamaCard from '../LpmamaCard';
import CrmResyncModal from '../CrmResyncModal';

interface Props {
    conversation: ConversationItem;
    canEdit: boolean;
}

export default function SmartCaptureTab({ conversation, canEdit }: Props) {
    const [resyncOpen, setResyncOpen] = useState(false);
    const { updateSmartCaptures } = useUpdateSmartCaptures();

    const byTopic = Object.fromEntries((conversation.smart_captures ?? []).map(sc => [sc.topic, sc.content]));
    const fieldByKey = Object.fromEntries(LPMAMA_CONFIG.map(f => [f.key, f]));
    const { crm_lead_id, crm_lead_name, crm_provider } = conversation;

    const saveTopic = async (topic: string, content: string) => {
        try {
            await updateSmartCaptures({ conversationId: conversation.id, captures: { [topic]: content } });
        } catch {
            throw new Error('Couldn’t save. Try again.');
        }
        if (crm_lead_id) setResyncOpen(true);
    };

    return (
        <>
            <div className="conv-sc-grid">
                {CAPTURE_DISPLAY_ORDER.map(key => (
                    <LpmamaCard
                        key={key}
                        field={fieldByKey[key]}
                        value={byTopic[key] ?? ''}
                        canEdit={canEdit}
                        badge={key === 'appointment' && conversation.appointment_booked
                            ? <span className="conv-sc-booked">Booked</span>
                            : undefined}
                        onSave={content => saveTopic(key, content)}
                    />
                ))}
            </div>
            {resyncOpen && crm_lead_id && (
                <CrmResyncModal
                    conversationId={conversation.id}
                    leadName={crm_lead_name ?? 'this lead'}
                    providerLabel={crm_provider ? getProvider(crm_provider).label : 'your CRM'}
                    onClose={() => setResyncOpen(false)}
                />
            )}
        </>
    );
}
