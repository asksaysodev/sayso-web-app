import { Fragment } from 'react';
import { ChevronDown } from 'lucide-react';
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '@/components/ds/Menu';
import { OVERVIEW_PERIODS } from '../../constants/overviewPeriods';
import type { OverviewPeriodOption, OverviewPeriod } from '../../types';

interface Props {
    value: OverviewPeriodOption;
    onChange: (period: OverviewPeriod) => void;
}

export default function PeriodSelect({ value, onChange }: Props) {
    return (
        <Menu>
            <MenuTrigger asChild>
                <button type='button' className='dashboard-period-select'>
                    {value.label}
                    <ChevronDown size={12} />
                </button>
            </MenuTrigger>
            <MenuContent className='dashboard-period-menu'>
                {OVERVIEW_PERIODS.map((option, index) => (
                    <Fragment key={option.value}>
                        {index > 0 && <MenuSeparator />}
                        <MenuItem onSelect={() => onChange(option.value)}>{option.label}</MenuItem>
                    </Fragment>
                ))}
            </MenuContent>
        </Menu>
    );
}
