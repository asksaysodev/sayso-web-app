import { useState } from 'react';
import { LuPanelLeft } from 'react-icons/lu';
import Sidebar from './Sidebar';
import NotificationWidget from './NotificationWidget';

import './Layout.css';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
        <div className="app-shell__content">
          {children}
        </div>
      </div>
      <NotificationWidget />
    </div>
  );
}
