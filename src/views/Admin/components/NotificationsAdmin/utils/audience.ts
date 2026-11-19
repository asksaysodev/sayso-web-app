import { AccountType, Audience, AudienceRole } from '../types';

// Mirrors the server's rule (server utils/notificationAudience.js).
export const ACCOUNT_TYPES: { type: AccountType; label: string; hint: string; roles: AudienceRole[] }[] = [
    { type: 'individual', label: 'Individual accounts', hint: 'Users on an individual plan', roles: ['user'] },
    { type: 'team', label: 'Team accounts', hint: 'Users, admins and owners on a team plan', roles: ['user', 'admin', 'owner'] },
    { type: 'no_plan', label: 'Accounts with no plan', hint: 'Signed up but never subscribed', roles: ['user'] },
];

export const ROLE_LABELS: Record<AudienceRole, string> = { user: 'Users', admin: 'Admins', owner: 'Owners' };

/** Every role in every account type: the form's starting point. */
export const fullAudience = (): Audience =>
    Object.fromEntries(ACCOUNT_TYPES.map(({ type, roles }) => [type, [...roles]])) as Audience;

export const isAudienceEmpty = (audience: Audience, includeStaff: boolean): boolean =>
    !includeStaff && !Object.values(audience).some(roles => roles && roles.length > 0);

const joinWords = (words: string[]): string => {
    if (words.length <= 1) return words.join('');
    return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
};

const describeType = (type: AccountType, roles: AudienceRole[]): string => {
    const all = ACCOUNT_TYPES.find(t => t.type === type)!.roles;
    const everyone = roles.length === all.length;
    if (type === 'individual') return 'all users on individual accounts';
    if (type === 'no_plan') return 'all accounts with no plan';
    if (everyone) return 'everyone on team accounts';
    const names = all.filter(role => roles.includes(role)).map(role => ROLE_LABELS[role].toLowerCase());
    return `${joinWords(names)} on team accounts`;
};

/**
 * The audience in words, for the list and the send confirmation. No counts, by design.
 * e.g. "All users on individual accounts, admins and owners on team accounts, + Sayso staff"
 */
export const describeAudience = (audience: Audience | null, includeStaff: boolean): string => {
    if (audience === null) return 'Everyone (sent before audiences existed)';
    const parts = ACCOUNT_TYPES.flatMap(({ type }) => {
        const roles = audience[type];
        return roles && roles.length ? [describeType(type, roles)] : [];
    });
    const allSelected = ACCOUNT_TYPES.every(({ type, roles }) => audience[type]?.length === roles.length);
    let text = allSelected ? 'All users' : parts.join(', ');
    if (includeStaff) text = text ? `${text}, + Sayso staff` : 'Sayso staff only';
    if (!text) return 'Nobody';
    return text.charAt(0).toUpperCase() + text.slice(1);
};
