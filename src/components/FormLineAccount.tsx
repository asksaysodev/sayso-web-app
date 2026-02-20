import { useState, useEffect } from 'react';

import { IoCheckmark, IoCloseOutline, IoPencilOutline } from 'react-icons/io5';
import { LuLoader } from 'react-icons/lu';

import { useToast } from '../context/ToastContext';
import { useAccounts } from '../hooks/useAccounts';
import { useAuth } from '../context/AuthContext';

import '../views/Account/styles.css';

interface Props {
    label: string;
    name: string;
    placeholder: string;
    value: string;
    editable: boolean;
    setUnsavedChanges: (unsavedChanges: boolean) => void;
}

export default function FormLineAccount({ label, name, placeholder, value, editable, setUnsavedChanges }: Props) {

    //STATE
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);

    //HOOKS
    const { showToast } = useToast();
    const { updateAccount } = useAccounts();
    const { updateGlobalUser, globalUser } = useAuth();

    //FUNCTIONS
    const handleSave = async () => {

        setIsSaving(true);

        if(inputValue === '' || inputValue === null || inputValue === undefined) {
            setInputValue(value);
            showToast('error', 'Please enter a value');
            return;
        }
        if(typeof inputValue !== 'string') {
            setInputValue(value);
            showToast('error', 'Please enter a valid value');
            return;
        }

        try {
            const updateData = {
                [name]: inputValue,
            }
            await updateAccount(updateData);
            showToast('success', 'Account updated successfully!');
            setUnsavedChanges(false);
            setIsEditing(false);
            if (globalUser?.email) {
                await updateGlobalUser(globalUser.email);
            }
        } catch (error) {
            showToast('error', 'Failed to update account');
            console.error('Error saving:', error);
        } finally {
            setIsSaving(false); 
        }
    }

    const handleClose = () => {
        setIsEditing(false);
        setInputValue(value);
        setUnsavedChanges(false);
    }

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            handleSave();
        }
        if(e.key === 'Escape') {
            handleClose();
        }
    }

    useEffect(() => {
        if(inputValue !== value) {
            console.log('value changed');
            setUnsavedChanges(true);
        }
    }, [inputValue]);

    return (
        <label className='form-line-container-label' htmlFor={name}>
            <p className='form-line-container-label-title'>{label}</p>
            <div className={`form-line-input-container ${editable ? 'editable' : ''} ${isSaving ? 'saving' : ''}`}>
                {
                    isEditing ? (
                        <>
                            <input type="text" placeholder={placeholder} id={name} name={name} value={inputValue} onChange={handleChange} disabled={isSaving} onKeyDown={handleKeyPress} />
                            <div className='form-line-input-icon-container'>
                                <IoCloseOutline onClick={handleClose} />
                                <IoCheckmark onClick={handleSave} />
                            </div>

                        </>
                    ) : (
                        <>
                            <p>{inputValue}</p>
                            {
                                isSaving ? (
                                    <LuLoader className='form-line-input-icon-container-loader' />
                                ) : (
                                    <>
                                        {editable ? <IoPencilOutline onClick={() => setIsEditing(true)} /> : <></>}
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