import { Badge } from '@/components/ds/Badge';
import { PlaybookStatus } from '../types';
import statusBadge from '../utils/statusBadge';
import '../styles/PlaybookStatusBadge.css';

interface Props {
    status: PlaybookStatus;
}

export default function PlaybookStatusBadge({ status }: Props) {
    const { label, tone } = statusBadge(status);

    return (
        <Badge tone={tone} className='playbook-status-badge'>
            {status === 'processing' && <span className='playbook-status-badge__spinner' aria-hidden='true' />}
            {label}
        </Badge>
    );
}
