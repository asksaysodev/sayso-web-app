import { useEffect, useState } from "react";

import { useAccounts } from "../../../hooks/useAccounts";
import { useToast } from "../../../context/ToastContext";

import { LuLoader } from "react-icons/lu";
import SaysoModal from "../../../components/SaysoModal";
import FormLineAccount from "../../../components/FormLineAccount";
import { Account, Company } from "@/types/user";

interface Props {
    globalUser: Account | null;
    setUnsavedChanges: (unsavedChanges: boolean) => void;
}

export default function SettingsCompanyForm({ globalUser, setUnsavedChanges }: Props) {
    //STATE
        const [company, setCompany] = useState<Company | null>(null);
        const [inputValue, setInputValue] = useState('');
        const [isValidEmail, setIsValidEmail] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [deleteMemberId, setDeleteMemberId] = useState(null);
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
                                label='Company Name'
                                name='company'
                                placeholder='Company'
                                value={company?.company_name || ''}
                                editable={true}
                                setUnsavedChanges={setUnsavedChanges}
                            />
                        </form>
                        {/* <div className="account-settings-company-team-container">
                            <h3>Team</h3>
                            <div className="account-settings-company-team-list">
                                <div className="invite-team-member-container">
                                    <p>Add Team Member:</p>
                                    <div className="invite-team-member-input-container">
                                        <input type="email" placeholder="user@email.com" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                                        <button onClick={handleInviteTeamMember} disabled={!isValidEmail}>Invite</button>
                                    </div>
                                    
                                </div>
                                <ul>
                                    {
                                        company?.team?.members?.map((member, index) => (
                                            <li className={`${member.active ? 'active' : ''}`} key={index}>
                                                <div className="invite-team-member-item-container">
                                                    <p>{member.email}{!member.active && '  (pending)'}</p>
                                                    {
                                                        member.active && (
                                                            <button onClick={() => setDeleteMemberId(member.id)}> <FaXmark /></button>
                                                        )
                                                    }
                                                </div>
                                                <span className={`divider ${index === company?.team?.members?.length - 1 ? 'last' : ''}`}></span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div> */}
                        </>
                    )
                }
                
            </div>
        )
}