import { useState, type FormEvent } from 'react';
import { FileUp, Globe } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { TextField } from '@/components/ds/TextField';
import { useUploadPlaybook } from '../hooks/useUploadPlaybook';
import { validatePlaybookFile } from '../utils/playbookFile';
import PlaybookFileField from './PlaybookFileField';
import '../styles/UploadPlaybookModal.css';

interface Props {
    onClose: () => void;
}

export default function UploadPlaybookModal({ onClose }: Props) {
    const { uploadPlaybook, isPending } = useUploadPlaybook();
    const [file, setFile] = useState<File | null>(null);
    const [alias, setAlias] = useState('');
    const [aliasTouched, setAliasTouched] = useState(false);

    const fileError = file ? validatePlaybookFile(file) : null;
    const trimmedAlias = alias.trim();
    const aliasError = aliasTouched && !trimmedAlias ? 'Enter a name for this playbook.' : undefined;
    const canSubmit = !!file && !fileError && !!trimmedAlias && !isPending;

    const handleOpenChange = (open: boolean) => {
        if (!open && !isPending) onClose();
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!file || !canSubmit) return;
        uploadPlaybook({ file, alias: trimmedAlias }, { onSuccess: onClose });
    };

    return (
        <Modal open onOpenChange={handleOpenChange}>
            <ModalContent hideClose={isPending}>
                <form className='upload-playbook-modal' onSubmit={handleSubmit}>
                    <ModalHeader
                        icon={<FileUp size={24} />}
                        title='Upload public playbook'
                        description='This script will be available to all Sayso users.'
                    />
                    <ModalBody>
                        <PlaybookFileField file={file} error={fileError} disabled={isPending} onChange={setFile} />
                        <TextField
                            label='Name'
                            placeholder='e.g. Expired Listings'
                            value={alias}
                            onChange={event => setAlias(event.target.value)}
                            onBlur={() => setAliasTouched(true)}
                            helperText='Users see this name in their playbook list.'
                            error={aliasError}
                            disabled={isPending}
                            required
                        />
                        <p className='upload-playbook-modal__notice'>
                            <Globe size={18} aria-hidden='true' />
                            <span>
                                <strong>Public script.</strong> Once processed, it shows up in every Sayso user's playbook list.
                            </span>
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='secondary' onClick={onClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={!canSubmit} loading={isPending}>
                            {isPending ? 'Uploading…' : 'Upload'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
