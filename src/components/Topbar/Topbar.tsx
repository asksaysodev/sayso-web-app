import UserMenu from '@/components/UserMenu/UserMenu';
import TopbarBreadcrumb from './TopbarBreadcrumb';
import TopbarHistoryArrows from './TopbarHistoryArrows';
import './Topbar.css';

export default function Topbar() {
    return (
        <header className='topbar'>
            <div className='topbar__start'>
                <TopbarHistoryArrows />
                <TopbarBreadcrumb />
            </div>
            <UserMenu />
        </header>
    );
}
