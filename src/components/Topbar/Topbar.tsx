import UserMenu from '@/components/UserMenu/UserMenu';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import logoHorizontal from '/assets/logo-pos-horizontal.png';
import MobileMenuButton from './MobileMenuButton';
import TopbarBreadcrumb from './TopbarBreadcrumb';
import TopbarHistoryArrows from './TopbarHistoryArrows';
import './Topbar.css';

interface Props {
    onOpenMenu: () => void;
}

export default function Topbar({ onOpenMenu }: Props) {
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <header className='topbar'>
            <div className='topbar__start'>
                {isMobile
                    ? <>
                        <MobileMenuButton onClick={onOpenMenu} />
                        <img src={logoHorizontal} alt='Sayso' className='topbar__logo' />
                    </>
                    : <>
                        <TopbarHistoryArrows />
                        <TopbarBreadcrumb />
                    </>
                }
            </div>
            <UserMenu />
        </header>
    );
}
