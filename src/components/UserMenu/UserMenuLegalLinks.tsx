import { PRIVACY_POLICY_URL, TERMS_URL } from '@/constants';

export default function UserMenuLegalLinks() {
    return (
        <div className='user-menu__legal'>
            <a href={PRIVACY_POLICY_URL} target='_blank' rel='noopener noreferrer' className='user-menu__legal-link'>
                Privacy Policy
            </a>
            <span aria-hidden='true'>·</span>
            <a href={TERMS_URL} target='_blank' rel='noopener noreferrer' className='user-menu__legal-link'>
                Terms &amp; Conditions
            </a>
        </div>
    );
}
