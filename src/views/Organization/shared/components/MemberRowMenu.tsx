import { Fragment } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '@/components/ds/Menu';
import type { RowActionConfig } from '../types';
import './MemberRowMenu.css';

interface Props<A extends string> {
    actions: A[];
    config: Record<A, RowActionConfig>;
    memberLabel: string;
    onAction: (action: A) => void;
}

export default function MemberRowMenu<A extends string>({ actions, config, memberLabel, onAction }: Props<A>) {
    return (
        <Menu>
            <MenuTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon'
                    className='member-row-menu__trigger'
                    aria-label={`Actions for ${memberLabel}`}
                >
                    <EllipsisVertical size={16} />
                </Button>
            </MenuTrigger>
            <MenuContent>
                {actions.map((action, index) => {
                    const { label, icon, destructive } = config[action];
                    const startsDestructive = destructive && index > 0 && !config[actions[index - 1]].destructive;
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
