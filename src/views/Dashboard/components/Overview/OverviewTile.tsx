import type { ReactNode } from 'react';

interface Props {
    icon: ReactNode;
    label: string;
    children: ReactNode;
}

export default function OverviewTile({ icon, label, children }: Props) {
    return (
        <div className='dashboard-overview-tile'>
            <div className='dashboard-overview-tile__heading'>
                {icon}
                <span>{label}</span>
            </div>
            <div className='dashboard-overview-tile__body'>{children}</div>
        </div>
    );
}
