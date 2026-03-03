import { useEffect, useState } from "react";

import { useAccounts } from "../../../hooks/useAccounts";
import { useToast } from "../../../context/ToastContext";

import { LuLoader } from "react-icons/lu";
import SaysoModal from "../../../components/SaysoModal";
import FormLineAccount from "../../../components/FormLineAccount";
import TeamMembersTable from "./TeamMembersTable";
import { Account, Company } from "@/types/user";

interface Props {
    globalUser: Account | null;
    setUnsavedChanges: (unsavedChanges: boolean) => void;
}

export default function SettingsCompanyForm({ globalUser, setUnsavedChanges }: Props) {
    const [company, setCompany] = useState<Company | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
    const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);

    //HOOKS
    const { getCompanyById } = useAccounts();
    const { showToast } = useToast();

    const getCompany = async (companyId: string) => {
        if (!companyId) return;

        setIsLoading(true);

        try {
            const company = await getCompanyById(companyId);
            if(company && company.team && company.team.members && company.team.members.length > 0) {                        
                setCompany({
                    ...company,
                    team: {
                        members: company.team.members.sort((a, b) => {
                            if (a.active === b.active) return 0;
                            return a.active ? 1 : -1;
                        })
                    }
                });
            } else {
                setCompany(company);
            }
        } catch (error) {
            showToast('error', 'Failed to get company');
            console.error('Error getting company:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleDeleteMember = async () => {
        console.log('delete member', deleteMemberId);
    }

    //EFFECTS
    useEffect(() => {
        if(inputValue !== '') {
            const isValid = validateEmail(inputValue);
            setIsValidEmail(isValid);
        } else {
            setIsValidEmail(false);
        }
    }, [inputValue]);

    useEffect(() => {
        if (globalUser?.company_id) {
            getCompany(globalUser.company_id);
        }

    }, [globalUser]);

    useEffect(() => {
        if(deleteMemberId) {
            setShowDeleteMemberModal(true);
        } else {
            setShowDeleteMemberModal(false);
        }
    }, [deleteMemberId]);

    useEffect(() => {
            setUnsavedChanges(inputValue !== '');
    }, [inputValue]);

    const allowEditingOrgName = (globalUser?.role === 'user' && globalUser.account_type === 'individual') || (globalUser?.role === 'admin' && globalUser.account_type === 'team');
    
    return (
        <div className="settings-company">
            {
                showDeleteMemberModal && (
                    <SaysoModal
                        title="Delete Member"
                        text={`Are you sure you want to delete this member?\nThis action cannot be undone and the member will be permanently removed from the company.`}
                        isDelete={true}
                        primaryText="Yes, Delete"
                        secondaryText="Cancel"
                        onDeny={() => setDeleteMemberId(null)}
                        onConfirm={handleDeleteMember}
                    />
                )
            }
            {
                isLoading ? (
                    <div className='files-list-container-loading'>
                        <LuLoader className="loading-icon"/>
                    </div>
                ):(
                    <>
                        <form className="settings-company-form">
                            <FormLineAccount
                                label='Organization Name'
                                name='company'
                                placeholder='Organization'
                                value={company?.company_name || ''}
                                editable={allowEditingOrgName}
                                setUnsavedChanges={setUnsavedChanges}
                            />
                        </form>
                        <TeamMembersTable
                            onAddMember={() => console.log('add member')}
                            onRemoveMember={(id) => setDeleteMemberId(id)}
                        />
                    </>
                )
            }
            
        </div>
    )
}