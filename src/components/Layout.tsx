import Sidebar from './Sidebar';

import '../styles/Home.css';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="home-container">
      <Sidebar />
      {children}
    </div>
  );
}
