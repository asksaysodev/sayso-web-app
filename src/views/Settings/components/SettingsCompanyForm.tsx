import { useEffect, useState } from "react";

import { useAccounts } from "../../../hooks/useAccounts";
import { useToast } from "../../../context/ToastContext";

import { LuLoader } from "react-icons/lu";
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
            setUnsavedChanges(inputValue !== '');
    }, [inputValue]);

    const allowEditingOrgName = (globalUser?.role === 'user' && globalUser.account_type === 'individual') || (globalUser?.role === 'admin' && globalUser.account_type === 'team') || globalUser?.role === 'superadmin';

	const isTeamMembersTableVisible = (globalUser?.role === 'admin' || globalUser?.role === 'superadmin') && globalUser.account_type === 'team';
	console.log('globalUser', globalUser);
	console.log('isTeamMembersTableVisible', isTeamMembersTableVisible);
    
    return (
        <div className="settings-company">
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
                        {isTeamMembersTableVisible &&
                            <TeamMembersTable />
                        }
                    </>
                )
            }
            
        </div>
    )
}