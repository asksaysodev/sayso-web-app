import { ReactNode } from 'react';
import '../styles/PartnerIdentity.css';

interface Props {
    name: string;
    subtitle: string;
    trailing?: ReactNode;
}

export default function PartnerIdentity({ name, subtitle, trailing }: Props) {
    return (
        <div className="partner-identity">
            <div className="partner-identity__avatar">{name[0]?.toUpperCase() ?? '?'}</div>
            <div className="partner-identity__meta">
                <div className="partner-identity__name-line">
                    <span className="partner-identity__name">{name}</span>
                    {trailing}
                </div>
                <span className="partner-identity__subtitle">{subtitle}</span>
            </div>
        </div>
    );
}
