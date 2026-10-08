import { useNavigate } from 'react-router-dom';
import { Check, User } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { ModalBody, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import displayName from '@/views/Organization/shared/utils/displayName';
import type { CreateTeamResponse } from '../types';
import './TeamCreated.css';

interface Props {
    created: CreateTeamResponse;
    onClose: () => void;
}

export default function TeamCreated({ created, onClose }: Props) {
    const navigate = useNavigate();
    const { team, members } = created;

    return (
        <>
            <ModalHeader icon={<Check size={24} />} tone='success' title='Team created successfully' />
            <ModalBody>
                <dl className='team-created__summary'>
                    <div className='team-created__summary-row'>
                        <dt>Team name</dt>
                        <dd className='team-created__summary-strong'>{team.name}</dd>
                    </div>
                    <div className='team-created__summary-row'>
                        <dt>Members</dt>
                        <dd className='team-created__summary-members'>
                            {members.length === 0
                                ? '–'
                                : members.map((member) => (
                                      <span key={member.account_id} className='team-created__member'>
                                          <span className='team-created__member-avatar' aria-hidden='true'>
                                              <User size={14} />
                                          </span>
                                          {displayName(member)}
                                      </span>
                                  ))}
                        </dd>
                    </div>
                    <div className='team-created__summary-row'>
                        <dt>Allocated hours</dt>
                        <dd className='team-created__summary-strong'>
                            {team.hour_cap === null ? 'No cap set' : `${team.hour_cap}hs/month`}
                        </dd>
                    </div>
                </dl>
            </ModalBody>
            <ModalFooter>
                <Button
                    variant='secondary'
                    onClick={() => {
                        onClose();
                        navigate(`/organization/teams/${team.id}`);
                    }}
                >
                    Edit
                </Button>
                <Button onClick={onClose}>Continue</Button>
            </ModalFooter>
        </>
    );
}
