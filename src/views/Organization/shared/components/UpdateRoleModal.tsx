import { useState } from 'react';
import { RefreshCw, User } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { SelectField, type SelectFieldOption } from '@/components/ds/SelectField';
import { TextField } from '@/components/ds/TextField';
import useUpdateMemberRole from '../hooks/useUpdateMemberRole';
import type { AssignableRole, RoleTarget } from '../types';
import roleLabel from '../utils/roleLabel';
import ModalError from './ModalError';
import './UpdateRoleModal.css';

const ROLE_OPTIONS: SelectFieldOption<AssignableRole>[] = [
    { value: 'user', label: roleLabel('user') },
    { value: 'admin', label: roleLabel('admin') },
];

interface Props {
    target: RoleTarget;
    onClose: () => void;
}

export default function UpdateRoleModal({ target, onClose }: Props) {
    const currentRole: AssignableRole = target.role === 'admin' ? 'admin' : 'user';
    const [role, setRole] = useState<AssignableRole>(currentRole);
    const { updateRole, isPending, errorMessage } = useUpdateMemberRole();

    const handleOpenChange = (open: boolean) => {
        if (!open && !isPending) onClose();
    };

    const handleSave = () => {
        updateRole({ memberId: target.id, role }, { onSuccess: onClose });
    };

    return (
        <Modal open onOpenChange={handleOpenChange}>
            <ModalContent hideClose={isPending}>
                <ModalHeader
                    icon={<RefreshCw size={24} />}
                    title='Update member role'
                    description="Select an option below to change the user's role."
                />
                <ModalBody>
                    <div className='update-role-modal__fields'>
                        <TextField
                            className='update-role-modal__member'
                            label='Member'
                            leadingIcon={<User size={20} />}
                            value={target.email}
                            disabled
                            readOnly
                        />
                        <SelectField
                            className='update-role-modal__role'
                            label='Role'
                            options={ROLE_OPTIONS}
                            value={role}
                            onChange={setRole}
                            disabled={isPending}
                        />
                    </div>
                    <ModalError message={errorMessage} />
                </ModalBody>
                <ModalFooter>
                    <Button variant='secondary' onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={role === currentRole} loading={isPending}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
