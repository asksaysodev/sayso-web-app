import { Link } from 'react-router-dom';
import logoHorizontal from '/assets/logo-pos-horizontal.png';
import logoMark from '/assets/sayso.svg';

interface Props {
    collapsed: boolean;
}

export default function SidebarLogo({ collapsed }: Props) {
    return (
        <Link to='/' className='sidebar__logo' aria-label='Go to dashboard'>
            {collapsed
                ? <img src={logoMark} alt='Sayso' className='sidebar__logo-mark' />
                : <img src={logoHorizontal} alt='Sayso' className='sidebar__logo-full' />}
        </Link>
    );
}
