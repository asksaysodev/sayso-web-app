import { Invitation } from '../types';
import InvitationCard from './InvitationCard';
import NoInvitationsState from './NoInvitationsState';
import '../styles/PartnerInvitations.css';

interface Props {
    invitations: Invitation[];
    partnerId: string;
}

export default function PartnerInvitations({ invitations, partnerId }: Props) {
    return (
        <div className="partner-invitations">
            {invitations.length === 0 ? (
                <NoInvitationsState />
            ) : (
                <>
                    <div className="partner-invitations__divider">
                        <span className="partner-invitations__divider-label">Invitations</span>
                        <span className="partner-invitations__divider-line" />
                    </div>
                    <div className="partner-invitations__list">
                        {invitations.map(invitation => {
                            const {id} = invitation || {};
                            return (
                                <InvitationCard
                                    key={`${partnerId}-${id}`}
                                    invitation={invitation}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
