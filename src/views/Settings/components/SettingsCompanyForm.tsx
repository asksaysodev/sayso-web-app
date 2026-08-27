import { useEffect, useState } from "react";

import { useAccounts } from "../../../hooks/useAccounts";
import { useToast } from "../../../context/ToastContext";

import { LuLoader } from "react-icons/lu";
import FormLineAccount from "../../../components/FormLineAccount";
import TeamMembersTable from "./TeamMembersTable";
import { Account, Company, TEAM_ADMIN_ROLES } from "@/types/user";

interface Props {
    globalUser: Account | null;
    setUnsavedChanges: (unsavedChanges: boolean) => void;
}

export default function SettingsCompanyForm({ globalUser, setUnsavedChanges }: Props) {
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    //HOOKS
    const { getCompanyById, updateCompany } = useAccounts();
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

    //EFFECTS
    useEffect(() => {
        if (globalUser?.company_id) {
            getCompany(globalUser.company_id);
        }

    }, [globalUser]);

    useEffect(() => {
        setUnsavedChanges(false);
    }, [setUnsavedChanges]);

    const isTeamAdminRole = !!globalUser?.role && TEAM_ADMIN_ROLES.includes(globalUser.role);
    const allowEditingOrgName = (globalUser?.role === 'user' && globalUser.account_type === 'individual') || (isTeamAdminRole && globalUser.account_type === 'team') || globalUser?.role === 'superadmin';
	const isTeamMembersTableVisible = isTeamAdminRole && globalUser.account_type === 'team';
    
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
                                name='company_name'
                                placeholder='Organization'
                                value={company?.company_name || ''}
                                editable={allowEditingOrgName}
                                setUnsavedChanges={setUnsavedChanges}
                                updateFn={updateCompany}
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