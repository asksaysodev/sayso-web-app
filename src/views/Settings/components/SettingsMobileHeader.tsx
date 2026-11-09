import { PiCaretLeft } from 'react-icons/pi';

interface Props {
    title: string;
    onBack: () => void;
}

export default function SettingsMobileHeader({ title, onBack }: Props) {
    return (
        <header className='settings-mobile-header'>
            <button type='button' className='settings-mobile-header__back' aria-label='Back' onClick={onBack}>
                <PiCaretLeft size={24} aria-hidden />
            </button>
            <h1 className='settings-mobile-header__title'>{title}</h1>
        </header>
    );
}
