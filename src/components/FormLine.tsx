import { useState, useEffect } from 'react';
import { IoCheckmark, IoCloseOutline, IoPencilOutline } from 'react-icons/io5';
import { LuLoader } from 'react-icons/lu';
import { useToast } from '../context/ToastContext';
import { useProspects } from '../hooks/useProspects';

import '../styles/ProspectDetail.css';
import { Prospect } from '@/types/coach';


interface Props {
    label: string;
    name: string;
    placeholder: string;
    prospect: Prospect;
    fetchProspects: () => void;
    setUpdatedHeader: (updatedHeader: any) => void;
}

export default function FormLine({ label, name, placeholder, prospect, fetchProspects, setUpdatedHeader }: Props) {

    //STATE
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    //HOOKS
    const { showToast } = useToast();
    const { updateProspect } = useProspects();

    //FUNCTIONS
    const handleSave = async () => {
        setIsEditing(false);
        if(inputValue === '' || inputValue === null || inputValue === undefined) {
            setInputValue(prospect[name]);
            showToast('error', 'Please enter a value');
            return;
        }
        if(typeof inputValue !== 'string') {
            setInputValue(prospect[name]);
            showToast('error', 'Please enter a valid value');
            return;
        }
        try {
            setIsSaving(true);
            const updateData = {
                [name]: inputValue,
            }
            await updateProspect(prospect.id, updateData);
            await fetchProspects();
            // setIsSaving(false);
            showToast('success', 'Prospect updated successfully!');
        } catch (error) {
            // setIsSaving(false);
            showToast('error', 'Failed to update prospect');
            console.error('Error saving:', error);
        } finally {
            setIsSaving(false);
        }
    }

    const handleChange = (e) => {
        setInputValue(e.target.value);
        setUpdatedHeader(prev => ({
            ...prev,
            [name]: e.target.value
        }));
    }

    const handleClose = () => {
        setIsEditing(false);
        setInputValue(prospect[name]);
        setUpdatedHeader(prev => ({
            ...prev,
            [name]: prospect[name]
        }));
    }

    const handleKeyPress = (e) => {

        if(isSaving) {
            return;
        }

        if(isEditing) {
            if(e.key === 'Enter') {
                handleSave();
            }
            if(e.key === 'Escape') {
                handleClose();
            }
            return;
        }
    }

    //EFFECTS
    useEffect(() => {
        setInputValue(prospect[name]);
    }, [prospect]);


    return (
        <label className='prospect-detail-body-information-container-label' htmlFor={name}>{label}
            <div className={`prospect-detail-body-information-input-container ${isSaving ? 'saving' : ''}`}>
                {
                    isEditing ? (
                        <>
                            <input type="text" placeholder={placeholder} id={name} name={name} value={inputValue} onChange={handleChange} disabled={isSaving} onKeyDown={handleKeyPress} />
                            <div className='prospect-form-input-icon-container'>
                                <IoCloseOutline onClick={handleClose} />
                                <IoCheckmark onClick={handleSave} />
                            </div>

                        </>
                    ) : (
                        <>
                            <p>{inputValue}</p>
                            {
                                isSaving ? (
                                    <LuLoader className='prospect-form-input-icon-container-loader' />
                                ) : (
                                    <>
                                        <IoPencilOutline onClick={() => setIsEditing(true)} />
                                    </>
                                )
                            }
                            
                        </>
                    )
                }
            </div>
        </label>
    )
}