import { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const { pathname } = useLocation();
  // Mobile settings screens bring their own "← Title" header.
  const hideTopbar = isMobile && pathname === '/settings';

  return (
    <div className="app-shell">
      <Sidebar />
      <MobileSidebar open={sidebarOpen && isMobile} onOpenChange={setSidebarOpen} />
      <div className="app-shell__main">
        {!hideTopbar && <Topbar onOpenMenu={() => setSidebarOpen(true)} />}
        <div className="app-shell__content">
          {children}
        </div>
      </div>
      <NotificationWidget />
    </div>
  );
}
