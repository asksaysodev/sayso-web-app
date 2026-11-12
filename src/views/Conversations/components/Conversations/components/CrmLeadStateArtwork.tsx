import CrmProviderTile from '@/components/crm/CrmProviderTile';
import type { CrmProviderId } from '@/hooks/integrations/crm/types';

interface Props {
    providerId: CrmProviderId;
    tone: 'info' | 'error';
}

/** Tinted halo around the CRM logo, shown on the lead modal's full-panel states. */
export default function CrmLeadStateArtwork({ providerId, tone }: Props) {
    return (
        <div className={`crm-lead__halo crm-lead__halo--${tone}`}>
            <div className={`crm-lead__ring crm-lead__ring--${tone}`}>
                <CrmProviderTile providerId={providerId} size="lg" />
            </div>
        </div>
    );
}
