import { useState } from 'react';
import { LuMenu } from 'react-icons/lu';
import Sidebar from './Sidebar';

import '../styles/Home.css';

import logoHorizontal from '/assets/logo-pos-horizontal.png';

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
          <LuMenu />
        </button>
        <img className="mobile-header-logo" src={logoHorizontal} alt="Sayso" />
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {children}
    </div>
  );
}
