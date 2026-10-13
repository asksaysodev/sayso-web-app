import { useState } from 'react';

import { NavLink } from 'react-router-dom'
import {
    LuLogOut,
    LuCircleHelp,
    LuPanelLeft,
} from 'react-icons/lu'


import Divider from './Divider';
import { openExternal } from '../utils/helpers/openExternal';
import SaysoModal from './SaysoModal';

import { useAuth } from '../context/AuthContext';

import logoHorizontal from '/assets/logo-pos-horizontal.png';
import '../styles/Sidebar.css';
import DownloadDesktopAppButton from './DownloadDesktopAppButton';
import LaunchCoachButton from './LaunchCoachButton';
import { HELP_CENTER_URL } from '@/constants';
import useNavItems from './Sidebar/useNavItems';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SVG_FONT_SIZE = 18;

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const { globalUser, handleSignOut } = useAuth();
    const navItems = useNavItems();
    
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
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink key={to} to={to} onClick={onClose}>
                            <div className="outline"></div>
                            <div className='sidebar-nav-item'>
                                <Icon size={SVG_FONT_SIZE}/>
                                <p>{label}</p>
                            </div>
                        </NavLink>
                    ))}
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
                    <p>Help Center</p>
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