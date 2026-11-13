import TwoFactorAuthSecurityOption from "./TwoFactorAuthSecurityOption";
import PasswordSecurityOption from "./PasswordSecurityOption";

export default function SettingsSecurity() {
    return (
        <div className='settings-cards-grid'>
            <TwoFactorAuthSecurityOption />
            <PasswordSecurityOption />
        </div>
    );
}
