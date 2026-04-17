import { useState } from 'react';
import { LuPanelLeft } from 'react-icons/lu';
import Sidebar from './Sidebar';
import NotificationWidget from './NotificationWidget';

import '../styles/Layout.css';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="home-container">
      <div className="mobile-header">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <LuPanelLeft size={18}/>
        </button>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {children}
      <NotificationWidget />
    </div>
  );
}
