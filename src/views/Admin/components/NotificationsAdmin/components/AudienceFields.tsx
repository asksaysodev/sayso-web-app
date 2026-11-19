import { Checkbox } from '@/components/ds/Checkbox';
import { AccountType, Audience, AudienceRole } from '../types';
import { ACCOUNT_TYPES, ROLE_LABELS } from '../utils/audience';

interface Props {
    audience: Audience;
    includeStaff: boolean;
    onChange: (audience: Audience) => void;
    onIncludeStaffChange: (includeStaff: boolean) => void;
    disabled?: boolean;
}

const roleSummary = (selected: AudienceRole[], all: AudienceRole[]): string => {
    if (selected.length === all.length) return 'All roles';
    if (!selected.length) return 'No roles';
    return all.filter(role => selected.includes(role)).map(role => ROLE_LABELS[role]).join(', ') + ' only';
};

/**
 * Account types (by company plan) as one grouped list. Checking a type selects all its
 * roles; team roles can then be unchecked one by one. Staff sits apart, off by default.
 */
export default function AudienceFields({ audience, includeStaff, onChange, onIncludeStaffChange, disabled }: Props) {
    const setRoles = (type: AccountType, roles: AudienceRole[]) => {
        const next = { ...audience };
        if (roles.length) next[type] = roles;
        else delete next[type];
        onChange(next);
    };

    return (
        <div className='notification-audience'>
            <ul className='notification-audience__list'>
                {ACCOUNT_TYPES.map(({ type, label, hint, roles: allRoles }) => {
                    const selected = audience[type] ?? [];
                    const hasRoles = allRoles.length > 1;
                    return (
                        <li key={type} className='notification-audience__row'>
                            <Checkbox
                                className='notification-audience__check'
                                label={
                                    <span className='notification-audience__text'>
                                        <span className='notification-audience__title'>{label}</span>
                                        <span className='notification-audience__hint'>
                                            {hasRoles && selected.length ? roleSummary(selected, allRoles) : hint}
                                        </span>
                                    </span>
                                }
                                checked={selected.length > 0}
                                onChange={event => setRoles(type, event.target.checked ? [...allRoles] : [])}
                                disabled={disabled}
                            />
                            {hasRoles && selected.length > 0 && (
                                <div className='notification-audience__roles' role='group' aria-label={`${label} roles`}>
                                    {allRoles.map(role => (
                                        <Checkbox
                                            key={role}
                                            className='notification-audience__role'
                                            label={ROLE_LABELS[role]}
                                            checked={selected.includes(role)}
                                            onChange={event =>
                                                setRoles(
                                                    type,
                                                    event.target.checked
                                                        ? allRoles.filter(r => r === role || selected.includes(r))
                                                        : selected.filter(r => r !== role),
                                                )
                                            }
                                            disabled={disabled}
                                        />
                                    ))}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>

            <Checkbox
                className='notification-audience__check notification-audience__staff'
                label={
                    <span className='notification-audience__text'>
                        <span className='notification-audience__title'>Send to Sayso staff (superadmin)</span>
                        <span className='notification-audience__hint'>Off by default. On its own, it works as a test send.</span>
                    </span>
                }
                checked={includeStaff}
                onChange={event => onIncludeStaffChange(event.target.checked)}
                disabled={disabled}
            />
        </div>
    );
}
