import { CheckCircle2 } from 'lucide-react';
import SaysoButton from '@/components/SaysoButton';
import './styles/AddPartnerSuccess.css';

interface Props {
    teamCount: number;
    onClose: () => void;
}

export default function AddPartnerSuccess({ teamCount, onClose }: Props) {
    return (
        <div className="add-partner-success">
            <CheckCircle2 size={48} className="add-partner-success__icon" />
            <h3 className="add-partner-success__heading">
                {teamCount} {teamCount === 1 ? 'invitation' : 'invitations'} sent
            </h3>
            <p className="add-partner-success__subtext">
                Partner created. {teamCount} {teamCount === 1 ? 'team' : 'teams'} will receive their invitation shortly.
            </p>
            <SaysoButton label="Done" onClick={onClose} />
        </div>
    );
}
