import { Menu } from 'lucide-react';

interface Props {
    onClick: () => void;
}

export default function MobileMenuButton({ onClick }: Props) {
    return (
        <button type='button' className='topbar__menu-button' aria-label='Open menu' onClick={onClick}>
            <Menu size={24} strokeWidth={1.5} />
        </button>
    );
}
