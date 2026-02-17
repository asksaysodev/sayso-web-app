import { useState } from 'react';
import { LuArrowUp, LuCheck, LuX } from 'react-icons/lu';
import { useMutation } from '@tanstack/react-query';
import uploadSignalSheet from '../services/uploadSignalSheet';
import { useAdminStore } from '@/store/adminStore';
import ButtonSpinner from '@/components/ButtonSpinner';
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

type ModalState = 'confirm' | 'loading' | 'success' | 'error';

export default function ImportSheetButton() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState<ModalState>('confirm');

    const signalSheets = useAdminStore(state => state.signalSheets);
    const setSignalSheets = useAdminStore(state => state.setSignalSheets);
    const setActiveSheetVersion = useAdminStore(state => state.setActiveSheetVersion);

    const { mutate: uploadSheet } = useMutation({
        mutationFn: uploadSignalSheet,
        onMutate: () => {
            setModalState('loading');
        },
        onSuccess: (data) => {
            const newSheet = { version: data.version, signals: data.uploadedSignals };
            setSignalSheets([...signalSheets, newSheet]);
            setActiveSheetVersion(data.version);
            setModalState('success');
        },
        onError: () => {
            setModalState('error');
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setModalState('confirm');
        setIsModalOpen(true);

        event.target.value = '';
    };

    const handleConfirm = () => {
        if (selectedFile) {
            uploadSheet(selectedFile);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setModalState('confirm');
    };

    const renderModalContent = () => {
        switch (modalState) {
            case 'confirm':
                return (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Import New Sheet Version</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will create a new version of the signal sheet with the contents of "{selectedFile?.name}". Do you want to continue?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleConfirm(); }}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                );

            case 'loading':
                return (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Uploading Sheet</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="import-modal-loading">
                            <ButtonSpinner color="#1d4871" size={24} />
                            <span>Uploading {selectedFile?.name}...</span>
                        </div>
                    </>
                );

            case 'success':
                return (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Import Complete</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="import-modal-result success">
                            <LuCheck size={32} />
                            <span>Sheet imported successfully!</span>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={handleClose}>Done</AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                );

            case 'error':
                return (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Import Failed</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="import-modal-result error">
                            <LuX size={32} />
                            <span>Failed to import sheet. Please try again.</span>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleClose}>Close</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleConfirm(); }}>Retry</AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                );
        }
    };

    return (
        <>
            <label className="import-sheet-button">
                <LuArrowUp size={16} />
                <span>Import</span>
                <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                />
            </label>

            <AlertDialog open={isModalOpen} onOpenChange={(open) => !open && modalState !== 'loading' && handleClose()}>
                <AlertDialogContent>
                    {renderModalContent()}
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
