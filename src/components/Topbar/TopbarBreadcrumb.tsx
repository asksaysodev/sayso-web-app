import { useLocation } from 'react-router-dom';
import useNavItems from '@/components/Sidebar/useNavItems';

export default function TopbarBreadcrumb() {
    const { pathname } = useLocation();
    const navItems = useNavItems();
    const current = navItems.find(({ to }) => (to === '/' ? pathname === '/' : pathname.startsWith(to)));

    if (!current) return null;

    return (
        <nav aria-label='Breadcrumb' className='topbar__breadcrumb'>
            <span aria-current='page'>{current.label}</span>
        </nav>
    );
}
