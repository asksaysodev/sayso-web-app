import { useState, useEffect } from 'react';

import { IoCheckmark, IoCloseOutline, IoPencilOutline } from 'react-icons/io5';
import { LuLoader } from 'react-icons/lu';

import { useToast } from '../context/ToastContext';
import { useAccounts } from '../hooks/useAccounts';
import { useAuth } from '../context/AuthContext';
import { PhoneInput, isValidPhone, toE164 } from './ui/PhoneInput';

import '../views/Settings/styles.css';

interface Props {
    label: string;
    name: string;
    placeholder: string;
    value: string;
    editable: boolean;
    setUnsavedChanges: (unsavedChanges: boolean) => void;
    updateFn?: (updateData: Record<string, string | null>) => Promise<void>;
    type?: 'text' | 'phone';
}

export default function FormLineAccount({ label, name, placeholder, value, editable, setUnsavedChanges, updateFn, type = 'text' }: Props) {

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

        if (type === 'phone') {
            const isEmpty = !inputValue || inputValue.trim() === '' || inputValue.trim() === '+1';
            if (!isEmpty && !isValidPhone(inputValue)) {
                showToast('error', 'Please enter a valid phone number');
                setIsSaving(false);
                return;
            }
            try {
                const updateData = { [name]: isEmpty ? null : toE164(inputValue) };
                await (updateFn ?? updateAccount)(updateData as Record<string, string | null>);
                showToast('success', 'Account updated successfully!');
                setUnsavedChanges(false);
                setIsEditing(false);
                if (globalUser?.email) await updateGlobalUser(globalUser.email);
            } catch (error) {
                showToast('error', 'Failed to update account');
                console.error('Error saving:', error);
            } finally {
                setIsSaving(false);
            }
            return;
        }

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
            const updateData = { [name]: inputValue }
            await (updateFn ?? updateAccount)(updateData);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            handleSave();
        }
        if(e.key === 'Escape') {
            handleClose();
        }
    }

    useEffect(() => {
        if(inputValue !== value) {
            setUnsavedChanges(true);
        }
    }, [inputValue, value]);

    return (
        <label className='form-line-container-label' htmlFor={name}>
            <p className='form-line-container-label-title'>{label}</p>
            <div className={`form-line-input-container ${editable ? 'editable' : ''} ${isSaving ? 'saving' : ''}`}>
                {
                    isEditing ? (
                        <>
                            {type === 'phone' ? (
                                <PhoneInput
                                    value={inputValue}
                                    onChange={setInputValue}
                                    disabled={isSaving}
                                    onKeyDown={handleKeyPress}
                                    className="shadow-none focus-visible:ring-0"
                                />
                            ) : (
                                <input
                                    type="text"
                                    placeholder={placeholder}
                                    id={name}
                                    name={name}
                                    value={inputValue}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                    onKeyDown={handleKeyPress}
                                />
                            )}
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