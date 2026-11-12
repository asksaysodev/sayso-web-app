import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ds/Button';
import type { CrmLead } from '@/hooks/integrations/crm/types';
import CrmLeadStateArtwork from './CrmLeadStateArtwork';

interface Props {
    lead: CrmLead;
    onBack: () => void;
    onLink: () => void;
}

/** Shown when the CRM matched the entered phone/email to an existing person instead of creating a lead. */
export default function CrmLeadMatchState({ lead, onBack, onLink }: Props) {
    const displayName = lead.name?.trim() || lead.primaryEmail || lead.primaryPhone || 'this contact';

    return (
        <>
            <CrmLeadStateArtwork providerId={lead.providerId} tone="info" />
            <div className="crm-lead__copy">
                <DialogPrimitive.Title className="crm-lead__copy-title">This contact is already in your CRM</DialogPrimitive.Title>
                <p className="crm-lead__copy-text">
                    The phone or email you entered belongs to <strong className="crm-lead__copy-strong">{displayName}</strong>
                    {lead.stage && ` (Stage: ${lead.stage})`}.
                </p>
            </div>
            <div className="crm-lead__actions">
                <Button variant="secondary" size="sm" className="crm-lead__outline" onClick={onBack}>Back to edit</Button>
                <Button size="sm" className="crm-lead__link-button" title={`Link to ${displayName}`} onClick={onLink}>
                    <span className="crm-lead__link-label">Link to {displayName}</span>
                </Button>
            </div>
        </>
    );
}
