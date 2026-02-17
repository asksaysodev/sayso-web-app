import Sidebar from './Sidebar';
import TopDragBar from './TopDragBar';

import '../styles/Home.css';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="home-container">
      <TopDragBar />
      <Sidebar />
      {children}
    </div>
  );
}
