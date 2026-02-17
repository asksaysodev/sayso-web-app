import { useState, useEffect } from 'react';

import { LuTrash, LuLoader } from 'react-icons/lu';
import { FaRegCircleCheck, FaRotateRight} from 'react-icons/fa6';
import { GoFile } from 'react-icons/go';

import '../styles/FileCard.css';

interface Props {
    status: string;
    file: any;
    showDeleteModal?: boolean;
    progress: number;
    fromDatabase: boolean;
    setFormData: (formData: any) => void;
    setFileToDelete?: (file: any) => void;
    deletingFileId?: string | null;
}

export default function FileCard({status, file, showDeleteModal = false, progress: propProgress = 0, fromDatabase = false, setFormData, setFileToDelete, deletingFileId = null}: Props) {

    //STATE
    const [progress, setProgress] = useState(propProgress);
    const [isDeleting, setIsDeleting] = useState(false);


    //FUNCTIONS
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 MB';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
    };

    const handleRemoveFileClick = async () => {
        if(fromDatabase) {
            if (setFileToDelete) {
                setFileToDelete(file);
            }
            return;
        } else {
            //REMOVE FROM FORM LOCAL DATA
            setFormData((prevData: any) => ({ // $FixTS
                ...prevData,
                files: prevData.files.filter((f: any) => f.name !== file.name) // $FixTS
            }));
        }
    }

    //EFFECTS
    useEffect(() => {
        setProgress(propProgress);
    }, [propProgress]);

    useEffect(() => {
        if(status === 'success') {
            setProgress(100);
            return;
        } else if(status === 'loading' && propProgress === 0) {

            const timer = setTimeout(() => {
                if(progress < 90) {
                    setProgress(progress + 10);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [progress, status, propProgress]);

    useEffect(() => {
        setIsDeleting( deletingFileId === file.id );

    }, [deletingFileId]);


    return (
        <div className={`prospect-file-card-container ${status} ${isDeleting ? 'deleting' : ''}`}>
            <div className='prospect-file-card-icon-container'>
                <GoFile />
            </div>
            <div className='prospect-file-card-container-body'>
                <h4>{`${status === 'error' ? 'Upload failed, please try again' : fromDatabase ? file.file_name : file.file?.name || file.name}`}</h4>
                <p>{`${status === 'error' ? file.name : formatFileSize(fromDatabase ? file.file_size : file.file?.size || file.size)}`}</p>
                {
                    status === 'error' && (
                        <div className='prospect-file-card-error-container'>
                            <FaRotateRight />
                            <p>Try again</p>
                        </div>
                    )
                }
                {
                    (status === 'loading' || status === 'success') && (
                        <div className='prospect-file-loader-container'>
                            <div className='prospect-file-loader-progress-bar'>
                                <span style={{ width: `${progress}%` }}></span>
                            </div>
                            <p>{progress}%</p>
                        </div>     
                    )
                }
            </div>
            <div className='prospect-file-card-status-icon-container'>
                {
                    isDeleting ? (
                        <div className='prospect-file-card-status-icon-container-loader' >
                            <LuLoader />
                        </div>
                    ) :  (
                        <>
                            {status === 'success' && <FaRegCircleCheck />}
                            {(status === 'error' || status === 'default') && <LuTrash onClick={handleRemoveFileClick} />}
                        </>
                    )
                }
            </div>
        </div>
    )
}