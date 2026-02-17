import { useState, useEffect } from 'react';

import { useToast } from '../context/ToastContext';
import { useProspectsContext } from '../context/ProspectsContext';
import { useProspects } from '../hooks/useProspects';

import SaysoModal from './SaysoModal';
import Divider from './Divider';
import NewFileInput from './NewFileInput';
import FileCard from './FileCard';

import { LuX, LuPaperclip } from 'react-icons/lu';

import '../styles/ProspectDetail.css';
import '../styles/Buttons.css';
import BtnPrimary from './BtnPrimary';

interface Props {
  setCreatingProspect: (creatingProspect: boolean) => void;
}

export default function NewProspect({ setCreatingProspect }: Props) {
    
    //STATE
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [backdropVisible, setBackdropVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [leaveModalVisible, setLeaveModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingReady, setIsSavingReady] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        company: '',
        files: []
    });

    //HOOKS
    const { showToast } = useToast();
    const { handleNewProspect } = useProspects();
    const { fetchProspects } = useProspectsContext();

    //FUNCTIONS
  
    const handleCloseClick = () => {
        if(formData.name != '' || formData.email != '' || formData.lastname != '' || formData.company != '') {
            setLeaveModalVisible(true);
            return;
        }
        handleClose();
    }

    const handleClose = () => {
        setIsClosing(true);
        setBackdropVisible(false);
        setFormData({
            name: '',
            lastname: '',
            email: '',
            company: '',
            files: []
        });
        setTimeout(() => {
            setCreatingProspect(false);
        }, 300);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files);
        console.log('New files uploaded:', newFiles);
        
        if (newFiles.length === 0) return;
        
        setFormData(prevData => ({
            ...prevData,
            files: [...prevData.files, ...newFiles]
        }));
    
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    }

    const handleSaveClick = async () => {
        setIsSaving(true);
        try {
            await handleNewProspect(formData);
            fetchProspects();
            handleClose();
            showToast('success', 'Prospect created successfully!');
        } catch (error) {
            showToast('error', 'Failed to create prospect');
            console.error('Error creating prospect:', error);
        } finally {
            setIsSaving(false);
        }
    }

    //EFFECTS
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
            setBackdropVisible(true);
        }, 10);
        
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if(formData.name != '' && formData.email != '' && formData.lastname != '' && formData.company != '') {
            setIsSavingReady(true);
        } else {
            setIsSavingReady(false);
        }
    }, [formData]);


    return (
        <>  
            {
                leaveModalVisible && (
                    <SaysoModal 
                        title="Do you want to leave this page?"
                        text={`Are you sure you want to leave this page?\nThis action cannot be undone and all unsaved data will be lost.`}
                        isDelete = {false}
                        primaryText="Continue"
                        secondaryText="Yes, Leave"
                        onDeny={handleClose}
                        onConfirm={() => setLeaveModalVisible(false)}
                    />
                )
            }
            <div 
                className={`prospect-detail-view-container ${backdropVisible ? 'fade-in' : ''} ${isClosing ? 'fade-out' : ''}`} 
                onClick={handleCloseClick}
            />
            <div 
                className={`propect-detail-main-container ${isVisible ? 'slide-in' : ''} ${isClosing ? 'slide-out' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="prospect-detail-header">
                    <button onClick={handleCloseClick} className='prospect-detail-close-button'>
                        <LuX />
                    </button>
                    <div className='prospect-detail-header-content'>
                        <h2 className='prospect-detail-header-title'>Add New Prospect</h2>
                    </div>
                </div>
                <div className="propect-detail-body">
                    <div className='prospect-detail-body-information-container'>
                        <form>
                            <label className='prospect-detail-body-information-container-label' htmlFor='name'>Name
                                <div className={`prospect-detail-body-information-input-container`}>
                                    <input type="text" placeholder={'John'} id={'name'} name={'name'} value={formData.name} onChange={handleChange} disabled={isSaving} />
                                </div>
                            </label>
                            <label className='prospect-detail-body-information-container-label' htmlFor='name'>Lastname
                                <div className={`prospect-detail-body-information-input-container`}>
                                    <input type="text" placeholder={'Doe'} id={'lastname'} name={'lastname'} value={formData.lastname} onChange={handleChange} disabled={isSaving} />
                                </div>
                            </label>
                            <label className='prospect-detail-body-information-container-label' htmlFor='name'>Email
                                <div className={`prospect-detail-body-information-input-container`}>
                                    <input type="text" placeholder={'john@email.com'} id={'email'} name={'email'} value={formData.email} onChange={handleChange} disabled={isSaving} />
                                </div>
                            </label>
                            <label className='prospect-detail-body-information-container-label' htmlFor='name'>Company
                                <div className={`prospect-detail-body-information-input-container`}>
                                    <input type="text" placeholder={'Company Inc.'} id={'company'} name={'company'} value={formData.company} onChange={handleChange} disabled={isSaving} />
                                </div>
                            </label>
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
                                formData.files.map((file, index) => (
                                    <FileCard 
                                        status={file.uploadStatus || 'default'} 
                                        file={file} 
                                        key={index}
                                        progress={file.uploadProgress || 0}
                                        fromDatabase={false}
                                        setFormData={setFormData}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='add-prospect-footer'>
                    <BtnPrimary
                        text="Save Prospect"
                        onClick={handleSaveClick}
                        isDisabled={!isSavingReady}
                        isLoading={isSaving}
                    />
                </div>
            </div>
        </>
    )
}