import { useState } from 'react';
import { LuTrash2, LuCheck, LuX } from 'react-icons/lu';
import { useMutation } from '@tanstack/react-query';
import { useAdminStore } from '@/store/adminStore';
import ButtonSpinner from '@/components/ButtonSpinner';
import deleteSignalSheetVersion from '../services/deleteSignalSheetVersion';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type ModalState = 'confirm' | 'loading' | 'success' | 'error';

export default function DeleteSheetButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState<ModalState>('confirm');

    const activeSheetVersion = useAdminStore(state => state.activeSheetVersion);
    const liveSheetVersion = useAdminStore(state => state.liveSheetVersion);
    const setSignalSheets = useAdminStore(state => state.setSignalSheets);
    const setActiveSheetVersion = useAdminStore(state => state.setActiveSheetVersion);
    const setLiveSheetVersion = useAdminStore(state => state.setLiveSheetVersion);

    const isViewingLiveSheet = activeSheetVersion === liveSheetVersion;

    const { mutate: deleteSheet } = useMutation({
        mutationFn: deleteSignalSheetVersion,
        onMutate: () => {
            setModalState('loading');
        },
        onSuccess: (data) => {
            setSignalSheets(data.versions);
            setActiveSheetVersion(data.activeVersion);
            setLiveSheetVersion(data.activeVersion);
            setModalState('success');
        },
        onError: () => {
            setModalState('error');
        },
    });

    const handleDeleteSheet = (): void => {
        deleteSheet(activeSheetVersion);
    };

    const handleOpenModal = () => {
        setModalState('confirm');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalState('confirm');
    };

    const renderModalContent = () => {
        switch (modalState) {
            case 'confirm':
                return (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Sheet Version</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete version {activeSheetVersion}? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleCloseModal}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDeleteSheet(); }}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                );

            case 'loading':
                return (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Deleting Sheet</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="import-modal-loading">
                            <ButtonSpinner color="#1d4871" size={24} />
                            <span>Deleting version {activeSheetVersion}...</span>
                        </div>
                    </>
                );

            case 'success':
                return (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Sheet Deleted</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="import-modal-result success">
                            <LuCheck size={32} />
                            <span>Sheet version deleted successfully!</span>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={handleCloseModal}>Done</AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                );

            case 'error':
                return (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Failed</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="import-modal-result error">
                            <LuX size={32} />
                            <span>Failed to delete sheet. Please try again.</span>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleCloseModal}>Close</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDeleteSheet(); }}>Retry</AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                );
        }
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="sayso-outlined-button delete-sheet-button"
                            onClick={handleOpenModal}
                            disabled={isViewingLiveSheet}
                        >
                            <LuTrash2 size={16} color="#dc2626" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete Signal Sheet Version</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <AlertDialog open={isModalOpen} onOpenChange={(open) => !open && modalState !== 'loading' && handleCloseModal()}>
                <AlertDialogContent>
                    {renderModalContent()}
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
