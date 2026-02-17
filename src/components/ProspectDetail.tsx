import { useState, useEffect } from 'react';

import { useToast } from '../context/ToastContext';
import { useFiles } from '../hooks/useFiles';
import { useProspects } from '../hooks/useProspects';

import SaysoModal from './SaysoModal';
import Divider from './Divider';
import FormLine from './FormLine';
import NewFileInput from './NewFileInput';
import FileCard from './FileCard';

import { LuX, LuTrash, LuLoader, LuPaperclip } from 'react-icons/lu';


import '../styles/ProspectDetail.css';
import { Prospect } from '@/types/coach';

interface Props {
    prospect: Prospect;
    setSelectedProspect: (prospect: Prospect) => void;
    fetchProspects: () => void;
}

export default function ProspectDetail({ prospect, setSelectedProspect, fetchProspects }: Props) {
    
    //STATE
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [backdropVisible, setBackdropVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteFileModalVisible, setDeleteFileModalVisible] = useState(false);
    const [prospectFiles, setProspectFiles] = useState({files: []});
    const [existingFiles, setExistingFiles] = useState(null);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [deletingFileId, setDeletingFileId] = useState(null);
    const [updatedHeader, setUpdatedHeader] = useState({
        name: '',
        lastname: '',
        email: ''
    });

    //HOOKS
    const { showToast } = useToast();
    const { handleUploadFiles, fetchFiles, removeFile } = useFiles();
    const { deleteProspect } = useProspects();

    //FUNCTIONS
    const handleDeleteProspect = async () => {

        setDeleteModalVisible(false);
        setIsDeleting(true);
        try {
            await deleteProspect(prospect.id);
            await fetchProspects();
            handleClose();
            showToast('success', 'Prospect deleted successfully!');
            
        } catch (error) {
            showToast('error', 'Failed to delete prospect');
            console.error('Error deleting prospect:', error);
            return;
        } finally {
            setIsDeleting(false);
        }
    };

    const handleFetchFiles = async () => {
        const files = await fetchFiles(prospect.id);
        setExistingFiles(files);
    }

    const handleRemoveFile = async () => {

        setDeleteFileModalVisible(false);
        const fileId = fileToDelete.id;
        try {
            setDeletingFileId(fileId);
            await removeFile(fileId);
            await fetchProspects();
            setExistingFiles(prevFiles => ({
                ...prevFiles,
                files: prevFiles.files.filter(file => file.id !== fileId)
            }));
            showToast('success', 'File deleted successfully!');
        } catch (error) {
            showToast('error', 'Failed to delete file');
            console.error('Error deleting prospect:', error);
            return;
        } finally {
            setDeletingFileId(null);
            setFileToDelete(null);
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setBackdropVisible(false);
        setTimeout(() => {
            setSelectedProspect(null);
        }, 300);
    };

    const handleCancelDeleteFile = () => {
        setFileToDelete(null);
        setDeleteFileModalVisible(false);
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files);
        console.log('New files uploaded:', newFiles);
        
        if (newFiles.length === 0) return;
        
        const filesWithStatus = newFiles.map(file => ({
            file: file, 
            uploadStatus: 'loading',
            uploadProgress: 0
        }));
        
        setProspectFiles(prevFiles => ({
            ...prevFiles,
            files: [...prevFiles.files, ...filesWithStatus]
        }));
        
        try {

            await handleUploadFiles(
                newFiles, 
                'prospect', 
                prospect.id 
            );

            await fetchProspects();


            setProspectFiles(prevFiles => ({
                ...prevFiles,
                files: prevFiles.files.map(fileItem => {
                    const isNewFile = newFiles.some(newFile => 
                        newFile.name === fileItem.file?.name && newFile.size === fileItem.file?.size
                    );
                    if (isNewFile) {
                        return {
                            ...fileItem,
                            uploadStatus: 'success',
                            uploadProgress: 100
                        };
                    }
                    return fileItem;
                })
            }));
            
        } catch (error) {
            
            setProspectFiles(prevFiles => ({
                ...prevFiles,
                files: prevFiles.files.map(fileItem => {
                    const isNewFile = newFiles.some(newFile => 
                        newFile.name === fileItem.file?.name && newFile.size === fileItem.file?.size
                    );
                    if (isNewFile) {
                        return {
                            ...fileItem,
                            uploadStatus: 'error',
                            uploadProgress: 0
                        };
                    }
                    return fileItem;
                })
            }));
        }
    };
    

    //EFFECTS
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
            setBackdropVisible(true);
        }, 10);
        
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if( fileToDelete ) {
            setDeleteFileModalVisible(true);
        }
    }, [fileToDelete]);

    useEffect(() => {
        handleFetchFiles();
    }, [prospect.id]);

    useEffect(() => {
        setUpdatedHeader({
            name: prospect.name,
            lastname: prospect.lastname,
            email: prospect.email
        });
    }, [prospect]);

    return (
        <>  
            {
                deleteModalVisible && (
                    <SaysoModal 
                        title="Delete Prospect"
                        text={`Are you sure you want to delete this prospect?\nThis action cannot be undone and all related files and meeting data will be permanently removed.`}
                        isDelete = {true}
                        primaryText="Yes, Delete"
                        secondaryText="Cancel"
                        onDeny={() => setDeleteModalVisible(false)}
                        onConfirm={handleDeleteProspect}
                    />
                )
            }
            {
                deleteFileModalVisible && (
                    <SaysoModal 
                        title="Delete File"
                        text={`Are you sure you want to delete this file?\nThis action cannot be undone and the file will be permanently removed.`}
                        isDelete = {true}
                        primaryText="Yes, Delete"
                        secondaryText="Cancel"
                        onDeny={handleCancelDeleteFile}
                        onConfirm={handleRemoveFile}
                    />
                )
            }
            <div 
                className={`prospect-detail-view-container ${backdropVisible ? 'fade-in' : ''} ${isClosing ? 'fade-out' : ''}`} 
                onClick={handleClose}
            />
            <div 
                className={`propect-detail-main-container ${isVisible ? 'slide-in' : ''} ${isClosing ? 'slide-out' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="prospect-detail-header">
                    <button onClick={handleClose} className='prospect-detail-close-button'>
                        <LuX />
                    </button>
                    <div className='prospect-detail-header-content'>
                        <div className='prospect-detail-header-image-container'>
                            <div className='prospect-detail-header-image'>
                                <p>{`${updatedHeader.name.charAt(0).toUpperCase()} ${updatedHeader.lastname.charAt(0).toUpperCase()}`}</p>
                            </div>
                        </div>
                        <div className='prospect-detail-header-content-info'>
                            <h2 className='prospect-detail-header-name'>{`${updatedHeader.name} ${updatedHeader.lastname}`}</h2>
                            <p className='prospect-detail-header-email'>{updatedHeader.email}</p>
                            <div className={`prospect-detail-delete-container ${isDeleting ? 'deleting' : ''}`} onClick={() => setDeleteModalVisible(true)}>
                                {
                                    isDeleting ? (
                                        <LuLoader />
                                    ) : (
                                        <LuTrash />
                                    )
                                }
                                <p>Delete Prospect</p>
                            </div>
                        </div>
                    </div>
                    <Divider/>
                </div>
                <div className="propect-detail-body">
                    <div className='prospect-detail-body-information-container'>
                        <form>
                            <FormLine 
                                label='Name' 
                                prospect={prospect} 
                                name='name' 
                                placeholder='John'
                                fetchProspects={fetchProspects}
                                setUpdatedHeader={setUpdatedHeader}
                            />
                            <FormLine 
                                label='Lastname' 
                                prospect={prospect} 
                                name='lastname' 
                                placeholder='Doe'
                                fetchProspects={fetchProspects}
                                setUpdatedHeader={setUpdatedHeader}
                            />
                            <FormLine 
                                label='Email' 
                                prospect={prospect} 
                                name='email' 
                                placeholder='john.doe@example.com'
                                fetchProspects={fetchProspects}
                                setUpdatedHeader={setUpdatedHeader}
                            />
                            <FormLine 
                                label='Company' 
                                prospect={prospect} 
                                name='company' 
                                placeholder='Company Inc.'
                                fetchProspects={fetchProspects}
                                setUpdatedHeader={setUpdatedHeader}
                            />
                        </form>
                    </div>
                    <Divider/>
                    <div className='prospect-detail-body-files-container'>
                        <div className='prospect-detail-body-files-container-header'>
                            <div className='prospect-detail-body-files-container-header-icon'>
                                <LuPaperclip />
                            </div>
                            <div className='prospect-detail-body-files-container-header-title'>
                                <h4>Related Files:</h4>
                                <p>Upload files that can help you at your next meeting.</p>
                            </div>
                        </div>
                        <NewFileInput 
                            id="prospectFile"
                            onChange={handleFileChange}
                            accept=".pdf,.txt,.docx,.doc"
                        />
                        <div className='prospect-detail-body-files-container-files'>
                            {
                                prospectFiles.files.map((file, index) => (
                                    <FileCard 
                                        status={file.uploadStatus || 'default'} 
                                        file={file} 
                                        key={index}
                                        progress={file.uploadProgress || 0}
                                        fromDatabase={false}
                                        setFileToDelete={setFileToDelete}
                                        // removeFile={setDeleteFileModalVisible} $FixTS
                                        deletingFileId={deletingFileId}
                                    />
                                ))
                            }
                        </div>
                        <div className='prospect-detail-body-files-container-files'>
                            {
                                existingFiles ? (
                                    <>
                                        {
                                            existingFiles.files.map((file, index) => (
                                                <FileCard 
                                                    status={'default'} 
                                                    file={file} 
                                                    key={index}
                                                    fromDatabase={true}
                                                    setFileToDelete={setFileToDelete}
                                                    // removeFile={setDeleteFileModalVisible} $FixTS
                                                    deletingFileId={deletingFileId}
                                                />
                                            ))
                                        }
                                    </>
                                ):(
                                    <div className='inline-loader'>
                                        <LuLoader />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}