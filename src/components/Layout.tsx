import { useState } from 'react';
import { LuPanelLeft } from 'react-icons/lu';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Sidebar from './Sidebar/Sidebar';
import MobileSidebar from './Sidebar/MobileSidebar';
import Topbar from './Topbar/Topbar';
import NotificationWidget from './NotificationWidget';

import './Layout.css';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <div className="app-shell">
      <Sidebar />
      <MobileSidebar open={sidebarOpen && isMobile} onOpenChange={setSidebarOpen} />
      <div className="app-shell__main">
        <div className="mobile-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <LuPanelLeft size={18}/>
          </button>
        </div>
        <Topbar />
        <div className="app-shell__content">
          {children}
        </div>
      </div>
      <NotificationWidget />
    </div>
  );
}
