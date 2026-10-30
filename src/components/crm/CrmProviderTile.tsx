import clsx from 'clsx';
import { getProvider } from '@/hooks/integrations/crm/providers/registry';
import type { CrmProviderId } from '@/hooks/integrations/crm/types';
import './CrmProviderTile.css';

interface Props {
    providerId: CrmProviderId;
    /** `md` = 44px tinted tile (cards/headers); `lg` = 64px white tile (loading/error states). */
    size?: 'md' | 'lg';
    className?: string;
}

/** CRM logo tile rendered from the registry (icon, label and tint come from the provider entry). */
export default function CrmProviderTile({ providerId, size = 'md', className }: Props) {
    const { label, iconSrc, tileBackground } = getProvider(providerId);
    const iconSize = size === 'lg' ? 34 : 26;
    return (
        <div
            className={clsx('crm-provider-tile', `crm-provider-tile--${size}`, className)}
            style={size === 'md' ? { background: tileBackground } : undefined}
        >
            <img src={iconSrc} alt={label} width={iconSize} height={iconSize} style={{ objectFit: 'contain' }} />
        </div>
    );
}
