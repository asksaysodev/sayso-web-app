import { useState } from 'react';

import { NavLink } from 'react-router-dom'
import {
    LuUsers,
    LuLogOut,
    LuSettings,
    LuCreditCard,
    LuCircleHelp,
    LuPanelLeft,
    LuShield,
} from 'react-icons/lu'


import Divider from './Divider';
import { openExternal } from '../utils/helpers/openExternal';
import SaysoModal from './SaysoModal';

import { useAuth } from '../context/AuthContext';

import logoHorizontal from '/assets/logo-pos-horizontal.png';
import '../styles/Sidebar.css';
import useHasSubscription from '@/hooks/useHasSubscription';
import DownloadDesktopAppButton from './DownloadDesktopAppButton';
import useUserNotAdminOnTeams from '@/hooks/useUserNotAdminOnTeams';
import LaunchCoachButton from './LaunchCoachButton';
import { Store } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SVG_FONT_SIZE = 18;
const HELP_CENTER_URL = "https://asksayso.notion.site/helpcenter"

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const { globalUser, handleSignOut, isSuperAdmin } = useAuth();
    const hasSubscription = useHasSubscription();

    const subjectValue = encodeURIComponent(`Sayso App Support Request - ${globalUser?.email ?? '{user email}'}`);
    const bodyValue = encodeURIComponent(`Describe the error and include any attachments or video links. All context or additional information will help us reproducing the error scenario`);
    const userNotAdminOnTeams = useUserNotAdminOnTeams()
    
    return (
        <>
        {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
        <div className={`sidebar-container ${isOpen ? 'sidebar-open' : ''}`}>
            {showSignOutModal && (
                <SaysoModal
                    title="Sign Out"
                    text="Are you sure you want to sign out?"
                    onConfirm={handleSignOut}
                    primaryText="Sign Out"
                    secondaryText="Cancel"
                    onDeny={() => setShowSignOutModal(false)}
                />
            )}
            <div className='full-w'>
                <div className="sidebar-header">
                    <img src={logoHorizontal} alt="Sayso Logo" />
                    <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
                        <LuPanelLeft size={SVG_FONT_SIZE}/>
                    </button>
                </div>
                <div className='sidebar-nav-container'>
                    {hasSubscription &&
                        <NavLink to="/" onClick={onClose}>
                            <div className="outline"></div>
                            <div className='sidebar-nav-item'>
                                <LuUsers size={SVG_FONT_SIZE}/>
                                <p>Dashboard</p>
                            </div>
                        </NavLink>
                    }
                    <NavLink to="/marketplace" onClick={onClose}>
                        <div className="outline"></div>
                        <div className='sidebar-nav-item'>
                            <Store size={SVG_FONT_SIZE}/>
                            <p>Marketplace</p>
                        </div>
                    </NavLink>
                    {isSuperAdmin && (
                        <NavLink to="/admin" onClick={onClose}>
                            <div className="outline"></div>
                            <div className='sidebar-nav-item'>
                                <LuShield size={SVG_FONT_SIZE}/>
                                <p>Admin</p>
                            </div>
                        </NavLink>
                    )}
                    <NavLink to="/settings" onClick={onClose}>
                        <div className="outline"></div>
                        <div className='sidebar-nav-item'>
                            <LuSettings size={SVG_FONT_SIZE}/>
                            <p>Settings</p>
                        </div>
                    </NavLink>
                    {!userNotAdminOnTeams && 
                        <NavLink to="/subscription" onClick={onClose}>
                            <div className="outline"></div>
                            <div className='sidebar-nav-item'>
                                <LuCreditCard size={SVG_FONT_SIZE}/>
                                <p>Subscription</p>
                            </div>
                        </NavLink>
                    }
                </div>
            </div>
            <div className="sidebar-footer">
                <div className='flex gap-3 flex-col'>
                    <LaunchCoachButton />
                    <DownloadDesktopAppButton />
                </div>
                
                <Divider />
                <div className='account-widget'>
                    <div className='account-widget-active-container'>
                        <div className='account-widget-icon'>
                            <p>{globalUser?.name?.charAt(0)}{globalUser?.lastname?.charAt(0)}</p>
                        </div>
                    </div>
                    <div className='account-widget-info'>
                        <div className='account-widget-info-header'>
                            <h3>{globalUser?.name} {globalUser?.lastname}</h3>
                        </div>
                        <p>{globalUser?.email}</p>
                    </div>
                </div>
                <Divider />
                <div className='sidebar-footer-button' onClick={() => openExternal(HELP_CENTER_URL)}>
                    <LuCircleHelp />
                    <p>Support</p>
                </div>
                <div className='sidebar-footer-button' onClick={() => setShowSignOutModal(true)}>
                    <LuLogOut />
                    <p>Log Out</p>
                </div>
            </div>
        </div>
        </>
    );
}