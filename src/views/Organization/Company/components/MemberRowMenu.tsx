import { Fragment, type ReactNode } from 'react';
import { EllipsisVertical, RefreshCw, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '@/components/ds/Menu';
import type { MemberRowAction } from '../types';

interface ActionConfig {
    label: string;
    icon: ReactNode;
    destructive?: boolean;
}

const ACTIONS: Record<MemberRowAction, ActionConfig> = {
    updateRole: { label: 'Update role member', icon: <RefreshCw size={20} /> },
    resendInvite: { label: 'Resend invite', icon: <Send size={20} /> },
    removeMember: { label: 'Remove member', icon: <Trash2 size={20} />, destructive: true },
    revokeInvite: { label: 'Revoke invite', icon: <Trash2 size={20} />, destructive: true },
};

interface Props {
    actions: MemberRowAction[];
    memberLabel: string;
    onAction: (action: MemberRowAction) => void;
}

/** Kebab menu for a row. Destructive actions sit last, after a separator. */
export default function MemberRowMenu({ actions, memberLabel, onAction }: Props) {
    return (
        <Menu>
            <MenuTrigger asChild>
                <Button variant='ghost' size='icon' aria-label={`Actions for ${memberLabel}`}>
                    <EllipsisVertical size={16} />
                </Button>
            </MenuTrigger>
            <MenuContent>
                {actions.map((action, index) => {
                    const { label, icon, destructive } = ACTIONS[action];
                    const startsDestructive = destructive && index > 0 && !ACTIONS[actions[index - 1]].destructive;
                    return (
                        <Fragment key={action}>
                            {startsDestructive && <MenuSeparator />}
                            <MenuItem
                                icon={icon}
                                tone={destructive ? 'destructive' : 'default'}
                                onSelect={() => onAction(action)}
                            >
                                {label}
                            </MenuItem>
                        </Fragment>
                    );
                })}
            </MenuContent>
        </Menu>
    );
}
