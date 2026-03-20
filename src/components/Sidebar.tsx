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

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const { globalUser, handleSignOut } = useAuth();
    const hasSubscription = useHasSubscription();

    const subjectValue = encodeURIComponent(`Sayso App Support Request - ${globalUser?.email ?? '{user email}'}`);
    const bodyValue = encodeURIComponent(`Describe the error and include any attachments or video links. All context or additional information will help us reproducing the error scenario`);
    
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
                        <LuPanelLeft size={18}/>
                    </button>
                </div>
                <div className='sidebar-nav-container'>
                    {hasSubscription &&
                        <NavLink to="/" onClick={onClose}>
                            <div className="outline"></div>
                            <div className='sidebar-nav-item'>
                                <LuUsers />
                                <p>Dashboard</p>
                            </div>
                        </NavLink>
                    }
                    {globalUser?.isAdmin && (
                    <NavLink to="/admin" onClick={onClose}>
                        <div className="outline"></div>
                        <div className='sidebar-nav-item'>
                            <LuShield />
                            <p>Admin</p>
                        </div>
                    </NavLink>
                    )}
                    <NavLink to="/settings" onClick={onClose}>
                        <div className="outline"></div>
                        <div className='sidebar-nav-item'>
                            <LuSettings />
                            <p>Settings</p>
                        </div>
                    </NavLink>
                    <NavLink to="/subscription" onClick={onClose}>
                        <div className="outline"></div>
                        <div className='sidebar-nav-item'>
                            <LuCreditCard />
                            <p>Subscription</p>
                        </div>
                    </NavLink>
                </div>
            </div>
            <div className="sidebar-footer">
                <DownloadDesktopAppButton />
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
                <div className='sidebar-footer-button' onClick={() => openExternal(`mailto:support@asksayso.com?subject=${subjectValue}&body=${bodyValue}`)}>
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