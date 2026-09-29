import type { ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '../Button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, type ModalTone } from '../Modal';

export interface ConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tone?: ModalTone;
    /** Defaults to `TriangleAlert` for `danger`. */
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    confirmLabel: string;
    cancelLabel?: string;
    onConfirm: () => void;
    /** Disables both actions and blocks dismissal while the confirm action runs. */
    loading?: boolean;
    children?: ReactNode;
}

export function ConfirmModal({
    open,
    onOpenChange,
    tone = 'danger',
    icon,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Cancel',
    onConfirm,
    loading = false,
    children,
}: ConfirmModalProps) {
    const headerIcon = icon ?? (tone === 'danger' ? <TriangleAlert size={24} /> : undefined);

    const handleOpenChange = (next: boolean) => {
        if (loading && !next) return;
        onOpenChange(next);
    };

    return (
        <Modal open={open} onOpenChange={handleOpenChange}>
            <ModalContent hideClose={loading} {...(!description && { 'aria-describedby': undefined })}>
                <ModalHeader icon={headerIcon} tone={tone} title={title} description={description} />
                {children && <ModalBody>{children}</ModalBody>}
                <ModalFooter>
                    <Button variant='secondary' onClick={() => handleOpenChange(false)} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button variant={tone === 'danger' ? 'destructive' : 'primary'} onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
