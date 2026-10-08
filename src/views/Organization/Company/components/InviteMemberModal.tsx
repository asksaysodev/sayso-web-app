import { useMemo, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { ChipsInput } from '@/components/ds/ChipsInput';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { SelectField, type SelectFieldOption } from '@/components/ds/SelectField';
import { useAuth } from '@/context/AuthContext';
import useInviteMembers from '../hooks/useInviteMembers';
import useTeams from '@/views/Organization/shared/hooks/useTeams';
import ModalError from '@/views/Organization/shared/components/ModalError';
import SkippedInvitesList from './SkippedInvitesList';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (raw: string) => raw.trim().toLowerCase();

interface Props {
    onClose: () => void;
}

/**
 * 202 → closes. 207 / 400 with `skipped` → stays open, chips cleared, lists what was not sent and why.
 */
export default function InviteMemberModal({ onClose }: Props) {
    const { globalUser } = useAuth();
    const { teams, isLoading: teamsLoading, isError: teamsError } = useTeams();
    const { invite, isPending, skipped, errorMessage, reset } = useInviteMembers();
    const [emails, setEmails] = useState<string[]>([]);
    const [teamId, setTeamId] = useState<string | null>(null);

    const ownEmail = globalUser?.email?.trim().toLowerCase();

    const teamOptions = useMemo<SelectFieldOption<string | null>[]>(
        () => [{ value: null, label: 'No team' }, ...teams.map((team) => ({ value: team.id, label: team.name }))],
        [teams],
    );

    const validateEmail = (email: string) => {
        if (!EMAIL_REGEX.test(email)) return 'Invalid email address';
        if (email === ownEmail) return "You can't invite yourself";
        return null;
    };

    const handleEmailsChange = (next: string[]) => {
        setEmails(next);
        if (errorMessage || skipped.length > 0) reset();
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !isPending) onClose();
    };

    const handleSubmit = () => {
        invite(
            { emails, teamId },
            {
                onSuccess: (data) => {
                    if (data.skipped.length === 0) onClose();
                    else setEmails([]);
                },
            },
        );
    };

    return (
        <Modal open onOpenChange={handleOpenChange}>
            <ModalContent hideClose={isPending}>
                <ModalHeader
                    icon={<UserPlus size={24} />}
                    title='Invite team member'
                    description='Enter one or more email addresses to invite to your organization.'
                />
                <ModalBody>
                    <ChipsInput
                        label='Email addresses'
                        chips={emails}
                        onChange={handleEmailsChange}
                        validate={validateEmail}
                        normalize={normalizeEmail}
                        placeholder='colleague@company.com'
                        helperText='Press Enter, Space, Tab or Comma to add each email.'
                        disabled={isPending}
                    />
                    <SelectField
                        label='Team'
                        options={teamOptions}
                        value={teamId}
                        onChange={setTeamId}
                        disabled={isPending || teamsLoading || teamsError}
                        helperText={teamsError ? "Couldn't load teams. You can still invite without one." : undefined}
                    />
                    <SkippedInvitesList skipped={skipped} />
                    <ModalError message={errorMessage} />
                </ModalBody>
                <ModalFooter>
                    <Button variant='secondary' onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={emails.length === 0} loading={isPending}>
                        Send invite
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
